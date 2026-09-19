import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schema/user.schema.js';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signUp.dto.js';
import { checkEmail } from '@/common/utils/email.util.js';
import { checkPhone } from '@/common/utils/phone.util.js';
import { comparePass, hashPass } from '@/common/utils/bycrpt.util.js';
import { SignInDto } from './dto/signIn.dto.js';
import { JwtService } from '@/modules/jwt/jwt.service.js';
import { IUser } from '@/modules/user/interfaces/user.interface.js';
import { UpdatePasswordDto } from './dto/updatePassword.dto.js';
import { generateOtp } from '../../common/utils/geterateOtp.util.js';
import { EmailService } from '../../shared/services/email.service.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ResetPassDto } from './dto/resetPassword.dto.js';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signUp(userData: SignUpDto) {
    const emailExists = await checkEmail(userData.email, this.userModel);
    const phoneNumberExists = await checkPhone(
      userData.mobileNumber,
      this.userModel,
    );
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    if (phoneNumberExists) {
      throw new ConflictException('mobil number already exists');
    }
    const hashedPassword = await hashPass(userData.password);
    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  
  async signIn(userData: SignInDto) {
    const { identifier, password } = userData;
    const user = await this.userModel
      .findOne({
        $or: [
          { email: identifier },
          { recoveryEmail: identifier },
          { mobileNumber: identifier },
        ],
      })
      .select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await comparePass(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.jwtService.generateAccessToken(user);
    const refreshToken = await this.jwtService.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    const decodedToken = await this.jwtService.verifyToken(refreshToken);
    const data: IUser | null = await this.userModel.findById(decodedToken.sub);
    if (!data) throw new UnauthorizedException('User not found');

    const newAccessToken = await this.jwtService.generateAccessToken(data);
    const newRefreshToken = await this.jwtService.generateRefreshToken(data);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await comparePass(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    user.password = await hashPass(dto.newPassword);
    await user.save();
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const otp = generateOtp();
      await this.cacheManager.set(`password-reset-otp:${email}`, otp, 300000);
      await this.emailService.sendOtpEmail(email, otp);
    }
  }
  async verifyResetOtp(email: string, otp: string) {
    const storedOtp = await this.cacheManager.get(
      `password-reset-otp:${email}`,
    );
    if (!storedOtp) {
      throw new BadRequestException('OTP expired or not found');
    }
    if (storedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.cacheManager.del(`password-reset-otp:${email}`);
    await this.cacheManager.set(`otp-verified-${email}`, true, 10 * 60 * 1000);
  }
  async isOtpVerified(email: string): Promise<void> {
    const isVerified = await this.cacheManager.get(`otp-verified-${email}`);
    if (!isVerified) {
      throw new BadRequestException({
        message:
          'OTP has not been verified. You cannot reset the password without OTP verification.',
      });
    }
  }
  async resetPassword(resetPass: ResetPassDto): Promise<void> {
    const user = await this.userModel.findOne({ email: resetPass.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.password = await hashPass(resetPass.password);
    await user.save();
    await this.cacheManager.del(`otp-verified-${resetPass.email}`);
  }
}

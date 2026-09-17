import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userData: SignUpDto) {
    const emailExists = await checkEmail(userData.email, this.userModel);
    const phoneNUmberExists = await checkPhone(
      userData.mobileNumber,
      this.userModel,
    );
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    if (phoneNUmberExists) {
      throw new ConflictException('mobil number already exists');
    }
    const hashedPassword = await hashPass(userData.password);
    return this.userModel.create({ ...userData, password: hashedPassword });
  }

  async signIn(userData: SignInDto) {
    const { identifier, password } = userData;
    const user = await this.userModel.findOne({
      $or: [
        { email: identifier },
        { recoveryEmail: identifier },
        { mobileNumber: identifier },
      ],
    });
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
}

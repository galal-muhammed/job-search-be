import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/signUp.dto.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { SignInDto } from './dto/signIn.dto.js';
import { JwtService } from '../jwt/jwt.service.js';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { UpdatePasswordDto } from './dto/updatePassword.dto.js';
import { ForgotPasswordDto } from './dto/forgetPassword.dto.js';
import { VerifyOtpDto } from './dto/verifyOtp.dto.js';
import { ResetPassDto } from './dto/resetPassword.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('signup')
  @ResponseMessage('User created successfully')
  signUp(@Body() userData: SignUpDto) {
    return this.authService.signUp(userData);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Signed in successfully')
  async signIn(
    @Body() userData: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(userData);

    this.jwtService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return result;
  }
  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Password updated successfully')
  updatePassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(userId, dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('OTP sent to your email')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('OTP verified successfully')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyResetOtp(dto.email, dto.otp);
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password reset successfully')
  async resetPassword(@Body() resetPasswordDto: ResetPassDto) {
    await this.authService.isOtpVerified(resetPasswordDto.email);
    await this.authService.resetPassword(resetPasswordDto);
  }
}

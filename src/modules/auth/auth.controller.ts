import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/signUp.dto.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { SignInDto } from './dto/signIn.dto.js';
import { JwtService } from '../jwt/jwt.service.js';

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
}


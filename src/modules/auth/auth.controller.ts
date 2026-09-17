import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/signUp.dto.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { SignInDto } from './dto/signIn.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @ResponseMessage('User created successfully')
  signUp(@Body() userData: SignUpDto) {
    return this.authService.signUp(userData);
  }
  @Post('signin')
  signIn(@Body() userData:SignInDto){
    return this.authService.signIn(userData);
  }
}

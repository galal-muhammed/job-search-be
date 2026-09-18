import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@/modules/jwt/jwt.module.js';
import { SharedModule } from '../../shared/shared.module.js';

@Module({
  imports:[JwtModule,UserModule,SharedModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}



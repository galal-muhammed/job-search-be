import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ResponseInterceptor } from './common/Interceptors/response.interceptor.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@/modules/jwt/jwt.service.js';
import { JwtModule } from '@/modules/jwt/jwt.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UserModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

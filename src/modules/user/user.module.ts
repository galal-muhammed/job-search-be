import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema.js';
import { JwtModule } from '../jwt/jwt.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[MongooseModule]
})
export class UserModule {}

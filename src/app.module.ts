import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

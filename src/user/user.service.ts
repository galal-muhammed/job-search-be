import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema.js';
import { checkEmail } from '../common/utils/email.util.js';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(userData: CreateUserDto) {
    const emailExists = await checkEmail(userData.email, this.userModel);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    return this.userModel.create(userData);
  }
}

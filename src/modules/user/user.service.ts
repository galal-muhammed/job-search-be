import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema.js';
import { checkEmail } from '../../common/utils/email.util.js';
import { checkPhone } from '../../common/utils/phone.util.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const emailTaken = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (emailTaken) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.mobileNumber) {
      const mobileTaken = await this.userModel.findOne({
        mobileNumber: updateUserDto.mobileNumber,
        _id: { $ne: id },
      });
      if (mobileTaken) {
        throw new ConflictException('Mobile number already in use');
      }
    }
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      returnDocument: 'after',
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }
  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return deleted;
  }
}

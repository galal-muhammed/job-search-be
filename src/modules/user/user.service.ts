import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema.js';
import { checkEmail } from '../../common/utils/email.util.js';
import { checkPhone } from '../../common/utils/phone.util.js';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  
}

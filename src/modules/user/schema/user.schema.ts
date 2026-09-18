import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../enum/role.enum.js';
import { Status } from '../enum/status.enum.js';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, trim: true })
  firstName: string;
  @Prop({ required: true, type: String, trim: true })
  lastName: string;
  @Prop({ type: String })
  userName: string;
  @Prop({
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ type: String, lowercase: true, trim: true })
  recoveryEmail: string;

  @Prop({ required: true, type: Date })
  DOB: Date;

  @Prop({ required: true, type: String, unique: true, trim: true })
  mobileNumber: string;

  @Prop({ required: true, type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ type: String, enum: Status, default: Status.Offline })
  status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function () {
  this.userName = `${this.firstName} ${this.lastName}`;
});

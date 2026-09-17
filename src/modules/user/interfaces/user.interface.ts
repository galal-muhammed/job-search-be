import { Types } from 'mongoose';
import { Role } from '../enum/role.enum.js';
import { Status } from '../enum/status.enum.js';

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  recoveryEmail?: string;
  DOB: Date;
  mobileNumber: string;
  role: Role;
  status: Status;
}
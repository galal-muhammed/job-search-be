import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/role.enum.js';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsOptional()
  recoveryEmail?: string;

  @IsDateString()
  @IsNotEmpty()
  DOB: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

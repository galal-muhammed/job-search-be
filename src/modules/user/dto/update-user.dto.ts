import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEmail()
  @IsOptional()
  recoveryEmail?: string;

  @IsDateString()
  @IsOptional()
  DOB?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;
}
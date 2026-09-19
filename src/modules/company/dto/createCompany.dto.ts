import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { CompanySize } from '../enum/companySize.enum.js';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(CompanySize)
  @IsNotEmpty()
  numberOfEmployees: CompanySize;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;
}
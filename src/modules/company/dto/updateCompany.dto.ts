import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { CompanySize } from '../enum/companySize.enum.js';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(CompanySize)
  @IsOptional()
  numberOfEmployees?: CompanySize;

  @IsEmail()
  @IsOptional()
  companyEmail?: string;
}
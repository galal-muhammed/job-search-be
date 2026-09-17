import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; 

  @IsString()
  @IsNotEmpty()
  password: string;
}
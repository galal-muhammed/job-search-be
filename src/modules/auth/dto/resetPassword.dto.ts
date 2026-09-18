import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ResetPassDto {
  @IsEmail({allow_display_name: true},{message: "Please enter a valid email address"})
  email: string;
  @IsNotEmpty({message: "Password is required"})
  @IsString({message: "Password must be a string"})
  @Matches(/^.{8,}$/, {
    message: 'Password must be at least 8 characters long, include at least one uppercase letter, and one symbol',
  })
  password: string;
}
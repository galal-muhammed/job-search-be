import * as bcrypt from "bcrypt";
import { BadRequestException, HttpStatus, UnauthorizedException } from "@nestjs/common";


const saltNumber: number = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
export const hashPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltNumber);
  const hashPassword: string = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const comparePass = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashPassword);
  if (!isMatch) {
    console.log(HttpStatus.UNAUTHORIZED);
    throw new UnauthorizedException("Invalid email or password");
  }
  return true; // Explicitly return true/false based on comparison
};
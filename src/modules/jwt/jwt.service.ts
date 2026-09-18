import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { Response } from "express";
import { IUser } from '@/modules/user/interfaces/user.interface.js';
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateAccessToken(info: IUser): Promise<any> {
    const id: string = info._id.toString();
    const payload: object = { sub: id, email: info.email, role: info.role };
    return this.jwtService.sign(payload, { expiresIn: "1h" });
  }

  async generateRefreshToken(info: IUser): Promise<any> {
    const payload: object = { sub: info._id, role: info.role };
    return this.jwtService.sign(payload, { expiresIn: "60d" });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException({ message: "Invalid or expired token" });
    }
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 604800000, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 24 * 60 * 60 * 1000, // 2 months
    });
  }
}
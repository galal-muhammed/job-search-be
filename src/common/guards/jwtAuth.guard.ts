import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service.js';
import { CustomRequest } from '@/common/interfaces/request.interface.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const decoded = await this.jwtService.verifyToken(accessToken);
      request.user = decoded;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(
          `Invalid access token: ${error.message}`,
        );
      }

      throw new UnauthorizedException('Invalid access token');
    }
  }
}

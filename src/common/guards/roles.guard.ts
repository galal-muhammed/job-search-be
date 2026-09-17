import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@/modules/user/enum/role.enum.js";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );
    if (!roles) return true;
    try {
      const req = context.switchToHttp().getRequest();
      const userRole = req.user.role;
      const hasRole = roles.some((role) => role === userRole);
      if (!hasRole) {
        throw new ForbiddenException("Forbidden resource");
      }

      return true; // Grant access if roles match
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
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
    const roles: Role[] = this.reflector.get<Role[]>(
      "roles",
      context.getHandler(),
    );
    if (!roles) return true;

    const req = context.switchToHttp().getRequest();
    const userRole = req.user?.role;

    if (!userRole) {
      throw new UnauthorizedException("User not authenticated");
    }

    const hasRole = roles.some((role) => role === userRole);
    if (!hasRole) {
      throw new ForbiddenException("Forbidden resource");
    }

    return true;
  }
}
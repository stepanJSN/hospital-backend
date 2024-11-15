import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTPayload } from 'src/auth/types/auth.type';
import { Role } from '@prisma/client';

export class OwnerOrAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JWTPayload = request.user;
    const userId = request.params.id;

    if (user.role === Role.Admin || user.id === userId) {
      return true;
    }
    throw new ForbiddenException();
  }
}

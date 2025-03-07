import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('el token es requerido');

    return true;
  }

  private getTokenFromHeader(request: Request) {
    const token = request.headers.authorization
      ? request.headers.authorization?.split(' ')[1]
      : [];

    return token ?? undefined;
  }
}

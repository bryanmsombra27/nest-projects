import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException(
        'el token es requerido para continuar...',
      );

    const user = this.authService.verifyToken(token);

    request['user'] = user;

    return true;
  }

  private getTokenFromHeader(request: Request) {
    const headers = request.headers as any;
    const token = headers.authorization
      ? headers.authorization?.split(' ')[1]
      : undefined;
    console.log(token, 'TOKEN DE PETICION');

    return token ?? undefined;
  }
}

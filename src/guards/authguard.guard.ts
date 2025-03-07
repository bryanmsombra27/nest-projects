import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('el token es requerido');
    }
    const user: User = this.authService.verifyToken(token);

    console.log(user, 'AUTH GUARD USER');
    // if (user.role.name == 'tienda')
    //   throw new UnauthorizedException('acceso denegado');

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as any;

    const authorization = headers?.authorization;
    const token = authorization?.split(' ')[1] ?? undefined;

    return token;
  }
}

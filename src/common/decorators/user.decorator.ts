import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const LoggedUser = createParamDecorator(
  (roles: string[] = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    console.log(user, 'ROLE USER');

    if (!roles.includes(user.role.name))
      throw new UnauthorizedException('Acceso denegado');

    return user;
  },
);

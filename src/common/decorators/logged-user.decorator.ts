import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPayloadToken } from '../api_responses';

// export const LoggedUser = (...args: string[]) => SetMetadata('logged-user', args);
export const LoggedUser = createParamDecorator(
  (roles: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserPayloadToken;
    const role = user.role.name;
    if (!roles.includes(role)) {
      throw new UnauthorizedException('accesso denegado');
    }
    return user;
  },
);

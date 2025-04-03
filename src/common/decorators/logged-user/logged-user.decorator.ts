import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';

export const LoggedUser = createParamDecorator(
  (roles: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as EncodedPayloadToken;
    const role = user.rol_name;
    if (!roles.includes(role)) {
      throw new UnauthorizedException('accesso denegado');
    }
    return user;
  },
);

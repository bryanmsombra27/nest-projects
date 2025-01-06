import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

// DECLARAR UN DECORADOR PERSONALIZADO
export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('user not found (request)');

    return data ? user[data] : user;
  },
);

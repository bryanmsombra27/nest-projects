import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const LoggedUser = createParamDecorator(
  (roles: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as any;
    const role = user.role.name;
    if (!roles.includes(role)) {
      throw new UnauthorizedException('accesso denegado');
    }
    return user;
  },
);

export const supabaseUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as any;
  console.log(user.id, 'SUPABASE USER');

  if (!user) {
    throw new UnauthorizedException('accesso denegado');
  }
  return user;
});

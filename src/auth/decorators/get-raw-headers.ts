import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data, context: ExecutionContext) => {
    // OBTENER EL OBJETO REQUEST DE LA PETICION
    const req = context.switchToHttp().getRequest();
    console.log(`REQUEST ${req}`);

    return req.rawHeaders;
  },
);

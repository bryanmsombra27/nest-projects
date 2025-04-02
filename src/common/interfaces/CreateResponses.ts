import { Rol } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface CreateRolResponse extends CommonResponse {
  rol: Rol;
}

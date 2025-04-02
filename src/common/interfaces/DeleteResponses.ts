import { Rol } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface DeleteRolResponse extends CommonResponse {
  rol: Rol;
}

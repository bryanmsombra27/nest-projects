import { Rol } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface UpdateRolResponse extends CommonResponse {
  rol: Rol;
}

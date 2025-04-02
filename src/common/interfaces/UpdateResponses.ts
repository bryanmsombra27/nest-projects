import { Personal, Rol } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface UpdateRolResponse extends CommonResponse {
  rol: Rol;
}
export interface UpdatePersonalResponse extends CommonResponse {
  personal: Personal;
}

import { Personal, Rol } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface CreateRolResponse extends CommonResponse {
  rol: Rol;
}

export interface CreatePersonalResponse extends CommonResponse {
  personal: Omit<Personal, 'password'>;
}

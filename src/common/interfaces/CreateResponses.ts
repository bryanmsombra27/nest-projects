import { Personal, Rol, Usuario } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface CreateRolResponse extends CommonResponse {
  rol: Rol;
}

export interface CreatePersonalResponse extends CommonResponse {
  personal: Omit<Personal, 'password'>;
}
export interface CreateUsuarioResponse extends CommonResponse {
  usuario: Usuario;
}

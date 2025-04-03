import { Personal, Rol, Usuario } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface DeleteRolResponse extends CommonResponse {
  rol: Rol;
}
export interface DeletePersonalResponse extends CommonResponse {
  personal: Personal;
}

export interface DeleteUsuarioResponse extends CommonResponse {
  usuario: Usuario;
}

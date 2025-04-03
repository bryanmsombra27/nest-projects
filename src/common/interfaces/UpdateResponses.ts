import { Personal, Rol, Usuario } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface UpdateRolResponse extends CommonResponse {
  rol: Rol;
}
export interface UpdatePersonalResponse extends CommonResponse {
  personal: Personal;
}

export interface UpdateUsuarioResponse extends CommonResponse {
  usuario: Usuario;
}

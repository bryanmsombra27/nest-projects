import { Modulos, Personal, Rol, Submodulos, Usuario } from '@prisma/client';

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
export interface DeleteModuloResponse extends CommonResponse {
  modulo: Modulos;
}
export interface DeleteSubModuloResponse extends CommonResponse {
  submodulo: Submodulos;
}

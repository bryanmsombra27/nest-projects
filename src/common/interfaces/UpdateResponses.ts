import { Modulos, Personal, Rol, Submodulos, Usuario } from '@prisma/client';

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

export interface UpdateModuloResponse extends CommonResponse {
  modulo: Modulos;
}
export interface UpdateSubModuloResponse extends CommonResponse {
  submodulo: Submodulos;
}

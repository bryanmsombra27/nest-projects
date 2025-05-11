import { Personal, Rol, Usuario, Modulos, Submodulos } from '@prisma/client';

interface CommonResponse {
  message: string;
  meta: Meta;
}
interface Meta {
  totalPages: number;
  actualPage: number;
  totalCount: number;
}

export interface GetAllRoles extends CommonResponse {
  roles: Rol[];
}
export interface GetAllPersonal extends CommonResponse {
  personal: Personal[];
}

export interface GetAllUsuarios extends CommonResponse {
  usuarios: Usuario[];
}

export interface GetAllModulos extends CommonResponse {
  modulos: Modulos[];
}

export interface GetAllSubmodulos extends CommonResponse {
  submodulos: Submodulos[];
}

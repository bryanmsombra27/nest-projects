import { Personal, Rol, Usuario, Modulos } from '@prisma/client';

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

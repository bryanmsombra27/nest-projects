import { Personal, Rol, Usuario } from '@prisma/client';

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

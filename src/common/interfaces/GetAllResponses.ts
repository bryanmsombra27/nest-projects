import { Rol } from '@prisma/client';

interface CommonResponse {
  message: string;
}
interface Meta {
  totalPages: number;
  actualPage: number;
  totalCount: number;
}

export interface GetAllRoles extends CommonResponse {
  roles: Rol[];
  meta: Meta;
}

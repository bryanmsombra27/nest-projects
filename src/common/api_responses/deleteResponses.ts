import { Role } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface DeleteRoleResponse extends CommonResponse {
  role: Role;
}

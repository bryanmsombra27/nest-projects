import { Role, User } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface DeleteRoleResponse extends CommonResponse {
  role: Role;
}
export interface DeleteUserResponse extends CommonResponse {
  user: Pick<User, 'name' | 'isActive' | 'id'>;
}

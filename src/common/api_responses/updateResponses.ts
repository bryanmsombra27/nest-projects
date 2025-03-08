import { Role, User } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface UpdateRolResponse extends CommonResponse {
  role: Role;
}

export interface UpdateUserResponse extends CommonResponse {
  user: User;
}

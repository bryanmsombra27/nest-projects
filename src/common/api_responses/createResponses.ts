import { Role, User } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface CreateRolResponse extends CommonResponse {
  role: Role;
}
export interface CreateUserResponse extends CommonResponse {
  user: Pick<User, 'id' | 'email' | 'name'>;
  token: string;
}

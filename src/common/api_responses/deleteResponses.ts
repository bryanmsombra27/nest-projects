import { Provider, Role, User, Warehouse } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface DeleteRoleResponse extends CommonResponse {
  role: Role;
}
export interface DeleteUserResponse extends CommonResponse {
  user: Pick<User, 'name' | 'isActive' | 'id'>;
}

export interface DeleteWarehouseResponse extends CommonResponse {
  warehouse: Warehouse;
}

export interface DeleteProviderResponse extends CommonResponse {
  provider: Provider;
}

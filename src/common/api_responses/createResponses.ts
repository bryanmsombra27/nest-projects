import { Role, User, Warehouse, Provider } from '@prisma/client';

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
export interface CreateWarehouseResponse extends CommonResponse {
  warehouse: Warehouse;
}
export interface CreateProviderResponse extends CommonResponse {
  provider: Provider;
}

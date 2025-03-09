import { Role, User, Warehouse } from '@prisma/client';

interface CommonResponse {
  message: string;
}

export interface UpdateRolResponse extends CommonResponse {
  role: Role;
}

export interface UpdateUserResponse extends CommonResponse {
  user: User;
}
export interface UpdateWarehouseResponse extends CommonResponse {
  warehouse: Warehouse;
}

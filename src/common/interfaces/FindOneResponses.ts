import { Personal, Rol } from '@prisma/client';

export interface FindRoleResponse {
  rol: Rol;
}

export type FindPersonalResponse = Omit<Personal, 'password'>;

export type LoggedUser = Omit<Personal, 'password'>;

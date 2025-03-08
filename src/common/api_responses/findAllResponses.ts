import { Role, User } from '@prisma/client';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
}

export interface FindAllCommonResponse {
  message: string;
  pagination: PaginationInfo;
}

export interface FindAllRoles extends FindAllCommonResponse {
  roles: Role[];
}

export interface FindAllUsers extends FindAllCommonResponse {
  users: User[];
}

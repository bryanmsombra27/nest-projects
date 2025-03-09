import {
  Order,
  Product,
  Provider,
  Role,
  User,
  Warehouse,
} from '@prisma/client';

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

export interface FindAllWarehouses extends FindAllCommonResponse {
  warehouses: Warehouse[];
}

export interface FindAllProviders extends FindAllCommonResponse {
  providers: Provider[];
}

export interface FindAllProducts extends FindAllCommonResponse {
  products: Product[];
}

export interface FindAllOrders extends FindAllCommonResponse {
  orders: Order[];
}

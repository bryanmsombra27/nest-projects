interface CommonResponse {
  message: string;
}

export interface UserPayloadToken {
  role: {
    name: string;
    id: string;
  };
  warehouse: {
    name: string;
    id: string;
  };
  name: string;
  id: string;
  roleId: string;
  warehouseId: string;
}

export interface LoginResponse extends CommonResponse {
  token: string;
}

export interface EncodedPayloadToken {
  id: string;
  nombre: string;
  email: string;
  rol_id: string;
  rol_name: string;
}

interface Modulo {
  id: string;
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
  role_id: string;
  module_id: string;
  ModulosPermissions: ModulePermission;
  Permisos_submodulos: any[];
}

interface ModulePermission {
  id: string;
  name: string;
  route: string;
  icon: string;
}

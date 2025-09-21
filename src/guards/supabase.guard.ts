import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener token de las cabeceras  de la peticion
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader)
      throw new UnauthorizedException('token de acceso requerido');

    const token = authHeader.split(' ')[1];

    // Verificar sesión en Supabase
    const { data, error } = await this.supabase.getClient().auth.getUser(token);

    if (error || !data?.user) throw new UnauthorizedException('token invalido');

    // Guardar el usuario en la request
    request.user = data.user;
    return true;
  }
}

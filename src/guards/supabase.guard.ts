import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

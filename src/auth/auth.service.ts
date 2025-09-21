import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/common/dtos/loginDto';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async createSupabaseUser(user: LoginDto) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.log('ERROR DE REGISTRO SUPABASE: ', error);
      throw new BadRequestException('No fue posible realizar el registro');
    }

    return {
      message: 'Usuario registrado con exito, por favor verifica tu cuenta',
      user: data.user,
    };
  }

  async login(user: LoginDto) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    if (error) {
      throw new BadRequestException('Correo o contraseña invalidos');
    }

    return {
      message: 'Login exitoso!',
      token: data.session.access_token,
    };
  }

  async logout() {
    const supabase = this.supabase.getClient();
    let { error } = await supabase.auth.signOut();

    if (error) {
      throw new BadRequestException('Error en la sesion');
    }
  }
}

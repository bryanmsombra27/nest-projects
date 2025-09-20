import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/common/dtos/loginDto';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabase: SupabaseService,
  ) {}

  generateToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return token;
  }

  verifyToken(token: string) {
    const decodeToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!decodeToken) throw new UnauthorizedException('Token invalido');

    return decodeToken;
  }

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
}

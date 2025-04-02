import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './authDto';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  generateToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return token;
  }

  verifyToken(token: string) {
    try {
      const decodeToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decodeToken) throw new UnauthorizedException('Token invalido');

      return decodeToken;
    } catch (error) {
      throw new UnauthorizedException('Token ya no es valido');
    }
  }

  async login(loginDto: LoginDto) {
    const personal = await this.prismaService.personal.findFirst({
      where: {
        email: loginDto.email,
      },

      include: {
        rol: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!personal) throw new NotFoundException('Credenciales invalidas');

    if (!(await compare(loginDto.password, personal.password))) {
      throw new BadRequestException('Credenciales incorrectas');
    }
    const personalToken = {
      id: personal.id,
      nombre: personal.nombre,
      email: personal.email,
      rol_id: personal.rolId,
      rol_name: personal.rol.name,
    };

    const token = this.generateToken(personalToken);

    return {
      message: 'Login exitoso!',
      token,
    };
  }
}

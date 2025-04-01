import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { LoginDto } from './dto/LoginDto';
import { PrismaService } from '../services/prisma.service';
import { LoginResponse, UserPayloadToken } from '../common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  generateToken(payload: UserPayloadToken) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10h',
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
      throw new UnauthorizedException('Inicia sesion para continuar...');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },

      select: {
        password: true,
        roleId: true,
        id: true,
        name: true,
        warehouseId: true,
        role: {
          select: {
            name: true,
            id: true,
          },
        },
        warehouse: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('El usuario no fue encontrado');

    if (!(await compare(password, user.password)))
      throw new UnauthorizedException('Credenciales invalidas');

    const token = this.generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
      roleId: user.roleId,
      warehouseId: user.warehouseId,
      warehouse: user.warehouse,
    });

    return {
      message: 'Login exitoso!',
      token,
      role: user.role.name,
    };
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

export interface Credentials {
  email: string;
  password: string;
}

export interface GenerateToken {
  id: number;
  name: string;
  role: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  generateToken(payload: GenerateToken) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return token;
  }
  verifyToken(token: string) {
    const decodeToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!decodeToken) throw new UnauthorizedException('token invalido');

    return decodeToken;
  }

  async signIn(credentials: Credentials) {
    const user = await this.userRepository.findOne({
      where: {
        isActive: true,
        email: credentials.email,
      },
      select: {
        role: {
          id: true,
          name: true,
        },
      },
    });

    if (!user) throw new UnauthorizedException('Usuario invalido');

    if (!(await compare(credentials.password, user.password)))
      throw new UnauthorizedException('Contraseñas invalidas');

    const token = this.generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return token;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadToken } from '../common/api_responses';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  generateToken(payload: UserPayloadToken) {
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

    console.log(decodeToken, 'TOKEN DECODIFICADO');

    return decodeToken;
  }
}

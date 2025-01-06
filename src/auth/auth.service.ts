import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private showDBErrors(error: any): never {
    console.log(error);
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }

  private getJsonWebToken(payload: JwtPayload): String {
    return this.jwtService.sign(payload);
  }

  async checkAuthStatus(user: User) {
    const token = this.getJsonWebToken({
      id: user.id,
    });

    return {
      msg: 'user created successfully!',
      user: {
        ...user,
        token,
      },
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);

      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      const user = this.userRepository.create(createUserDto);

      await this.userRepository.save(user);

      const token = this.getJsonWebToken({
        id: user.id,
      });

      delete user.password;
      return {
        msg: 'user created successfully!',
        user: {
          ...user,
          token,
        },
      };
    } catch (error) {
      this.showDBErrors(error);
    }
  }

  async login(userLogged: LoginUserDto) {
    const { email, password } = userLogged;

    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: {
          email: true,
          password: true,
          id: true,
        },
      });

      if (!(await bcrypt.compare(password, user.password)))
        throw new UnauthorizedException(`invalid password`);

      const token = this.getJsonWebToken({
        id: user.id,
      });

      return { ...user, token };
    } catch (error) {
      this.showDBErrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

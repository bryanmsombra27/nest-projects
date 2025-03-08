import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../services/prisma.service';
import { CreateUserResponse } from '../common/api_responses';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const { email, name, password, phone } = createUserDto;

    try {
      const hashedPassword = await hash(password, 10);

      const storeRole = await this.prismaService.role.findFirst({
        where: {
          isActive: true,
          name: 'tienda',
        },
      });

      const user = await this.prismaService.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          phone,
          roleId: storeRole.id,
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      const token = this.authService.generateToken({
        id: user.id,
        name: user.name,
        role: user.role,
        roleId: user.roleId,
      });

      return {
        message: 'Usuario creado con exito!',
        user: {
          email: user.email,
          id: user.id,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      this.handleErrorDb(error);
    }
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleErrorDb(error: any) {
    console.log(error, 'ERROR DB');

    if (error.code == 'P2002') {
      throw new BadRequestException('email ya fue registrado');
    }
  }
}

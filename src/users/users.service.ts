import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../services/prisma.service';
import { AuthService } from '../auth/auth.service';
import {
  CreateUserResponse,
  DeleteUserResponse,
  FindAllUsers,
  PaginationDto,
  UpdateUserResponse,
} from '../common';

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
          email: email.toLowerCase(),
          name: name.toLowerCase(),
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

  async findAll(paginationDto: PaginationDto): Promise<FindAllUsers> {
    const { limit, page, search } = paginationDto;

    const offset = (+page - 1) * limit;
    const clause: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
      },
      skip: offset,
      take: limit,
    };
    const countClause: Prisma.UserCountArgs = {
      where: {
        isActive: true,
      },
    };

    if (search) {
      clause.where = {
        ...clause.where,
        name: {
          contains: search.toLowerCase(),
        },
        email: {
          contains: search.toLowerCase(),
        },
        phone: {
          contains: search.toLowerCase(),
        },
      };
      countClause.where = {
        ...countClause,
        name: {
          contains: search.toLowerCase(),
        },
        email: {
          contains: search.toLowerCase(),
        },
        phone: {
          contains: search,
        },
      };
    }
    const total = await this.prismaService.user.count(countClause);
    const users = await this.prismaService.user.findMany(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Usuarios activos',
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalRows: total,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('El usuario no fue encontrado');

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const beforeUser = await this.findOne(id);

    const user = await this.prismaService.user.update({
      data: {
        email: updateUserDto.email?.toLowerCase() ?? beforeUser.email,
        name: updateUserDto.name?.toLowerCase() ?? beforeUser.name,
        phone: updateUserDto.phone ?? beforeUser.phone,
      },

      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Usuario actualizado con exito!',
      user,
    };
  }

  async remove(id: string): Promise<DeleteUserResponse> {
    await this.findOne(id);

    const user = await this.prismaService.user.update({
      data: {
        isActive: false,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Usuario eliminado con exito!',
      user: {
        id: user.id,
        isActive: user.isActive,
        name: user.name,
      },
    };
  }

  private handleErrorDb(error: any) {
    console.log(error, 'ERROR DB');

    if (error.code == 'P2002') {
      throw new BadRequestException('email ya fue registrado');
    }
  }
}

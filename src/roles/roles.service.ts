import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import {
  PaginationDto,
  CreateRolResponse,
  DeleteRoleResponse,
  FindAllRoles,
  UpdateRolResponse,
} from '../common';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<CreateRolResponse> {
    const role = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name.toLowerCase(),
      },
    });

    return {
      message: 'Rol creado con exito!',
      role,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllRoles> {
    const { limit, page, search } = paginationDto;

    const offset = (+page - 1) * limit;
    const clause: Prisma.RoleFindManyArgs = {
      where: {
        isActive: true,
      },
      skip: offset,
      take: limit,
    };
    const countClause: Prisma.RoleCountArgs = {
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
      };
      countClause.where = {
        ...countClause,
        name: {
          contains: search.toLowerCase(),
        },
      };
    }
    const total = await this.prismaService.role.count(countClause);
    const roles = await this.prismaService.role.findMany(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Roles activos',
      pagination: {
        currentPage: page,
        totalRows: total,
        totalPages,
      },
      roles,
    };
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.prismaService.role.findUnique({
      where: {
        isActive: true,
        id,
      },
    });

    if (!role) throw new NotFoundException('El rol no es valido');

    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRolResponse> {
    await this.findOne(id);

    const role = await this.prismaService.role.update({
      data: {
        name: updateRoleDto.name,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Rol actualizado con exito!',
      role,
    };
  }

  async remove(id: string): Promise<DeleteRoleResponse> {
    await this.findOne(id);

    const role = await this.prismaService.role.update({
      data: {
        isActive: false,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Rol eliminado con exito!',
      role,
    };
  }
}

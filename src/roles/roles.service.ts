import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Prisma, Rol } from '@prisma/client';
import { GetAllRoles } from 'src/common/interfaces/GetAllResponses';
import { CreateRolResponse } from 'src/common/interfaces/CreateResponses';
import { FindRoleResponse } from 'src/common/interfaces/FindOneResponses';
import { UpdateRolResponse } from 'src/common/interfaces/UpdateResponses';
import { DeleteRolResponse } from 'src/common/interfaces/DeleteResponses';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<CreateRolResponse> {
    const rol = await this.prismaService.rol.create({
      data: createRoleDto,
    });

    return {
      message: 'Rol creado con exito!',
      rol,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<GetAllRoles> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;
    const clause: Prisma.RolFindManyArgs = {
      take: limit,
      skip: offset,
    };
    const countClause: Prisma.RolCountArgs = {};

    if (paginationDto.search) {
      clause.where.name = {
        startsWith: paginationDto.search.toLowerCase().trim(),
      };
      countClause.where.name = {
        startsWith: paginationDto.search.toLowerCase().trim(),
      };
    }

    const roles = await this.prismaService.rol.findMany(clause);
    const count = await this.prismaService.rol.count(countClause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Roles activos',
      roles,
      meta: {
        actualPage: page,
        totalCount: count,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.prismaService.rol.findFirst({
      where: {
        isActive: true,
        id,
      },
    });
    if (!rol) throw new NotFoundException('El rol no fue encontrado');

    return rol;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRolResponse> {
    const rol = await this.findOne(id);

    const updatedRol = await this.prismaService.rol.update({
      where: {
        isActive: true,
        id,
      },
      data: {
        name: updateRoleDto.name ?? rol.name,
        description: updateRoleDto.description ?? rol.description,
      },
    });

    return {
      message: 'Rol actulizado con exito!',
      rol: updatedRol,
    };
  }

  async remove(id: string): Promise<DeleteRolResponse> {
    const rol = await this.findOne(id);

    await this.prismaService.rol.update({
      where: {
        isActive: true,
        id,
      },
      data: {
        isActive: false,
      },
    });

    return { message: 'Rol eliminado con exito', rol };
  }
}

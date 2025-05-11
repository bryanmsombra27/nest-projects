import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmoduloDto } from './dto/create-submodulo.dto';
import { UpdateSubmoduloDto } from './dto/update-submodulo.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Prisma } from '@prisma/client';
import { GetAllSubmodulos } from 'src/common/interfaces/GetAllResponses';
import { UpdateSubModuloResponse } from 'src/common/interfaces/UpdateResponses';
import { DeleteSubModuloResponse } from 'src/common/interfaces/DeleteResponses';

@Injectable()
export class SubmodulosService {
  constructor(private prismaService: PrismaService) {}

  async create(createSubmoduloDto: CreateSubmoduloDto) {
    const { submodules } = createSubmoduloDto;

    const modulos = await this.prismaService.submodulos.createMany({
      data: submodules,
    });

    return {
      message: 'Submodulos creados con exito!',
      modulos,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<GetAllSubmodulos> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const clause: Prisma.SubmodulosFindManyArgs = {
      take: limit,
      skip: offset,
    };
    const countClause: Prisma.SubmodulosCountArgs = {};

    if (paginationDto.search) {
      const whereClause: Prisma.SubmodulosWhereInput = {
        OR: [
          {
            name: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            route: { contains: paginationDto.search.toLowerCase() },
          },
          {
            icon: { contains: paginationDto.search.toLowerCase() },
          },
        ],
      };

      clause.where = whereClause;
      countClause.where = whereClause;
    }
    const submodulos = await this.prismaService.submodulos.findMany(clause);
    const count = await this.prismaService.submodulos.count(countClause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Submodulos activos',
      meta: {
        actualPage: page,
        totalCount: count,
        totalPages,
      },
      submodulos,
    };
  }

  async findOne(id: string) {
    const submodulo = await this.prismaService.submodulos.findUnique({
      where: { id },
    });

    if (!submodulo) throw new NotFoundException('Submodulo no encontrado');

    return submodulo;
  }

  async update(
    id: string,
    updateSubmoduloDto: UpdateSubmoduloDto,
  ): Promise<UpdateSubModuloResponse> {
    const submodulo = await this.findOne(id);
    const { icon, module_id, name, route } = updateSubmoduloDto;

    const submoduloUpdated = await this.prismaService.submodulos.update({
      where: {
        id,
      },
      data: {
        icon: icon ?? submodulo.icon,
        name: name ?? submodulo.name,
        module_id: module_id ?? submodulo.module_id,
        route: route ?? submodulo.route,
      },
    });

    return {
      message: 'Submodulo actualizado con exito!',
      submodulo: submoduloUpdated,
    };
  }

  async remove(id: string): Promise<DeleteSubModuloResponse> {
    await this.findOne(id);

    const submodulo = await this.prismaService.submodulos.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Submodulo eliminado con exito!',
      submodulo,
    };
  }
}

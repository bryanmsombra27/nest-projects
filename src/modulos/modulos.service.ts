import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { CreateModuloResponse } from 'src/common/interfaces/CreateResponses';
import { GetAllModulos } from 'src/common/interfaces/GetAllResponses';
import { UpdateModuloResponse } from 'src/common/interfaces/UpdateResponses';
import { DeleteModuloResponse } from 'src/common/interfaces/DeleteResponses';

@Injectable()
export class ModulosService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createModuloDto: CreateModuloDto,
  ): Promise<CreateModuloResponse> {
    const { icon, name, route } = createModuloDto;

    const clause: Prisma.ModulosCreateArgs = {
      data: {
        icon,
        name,
        route,
      },
    };

    if (createModuloDto?.submodules?.length > 0) {
      clause.data.Submodulos = {
        createMany: {
          data: createModuloDto.submodules,
        },
      };
    }

    const modulo = await this.prismaService.modulos.create(clause);

    return {
      message: 'Modulo creado exitosamente!',
      modulo,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<GetAllModulos> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const clause: Prisma.ModulosFindManyArgs = {
      take: limit,
      skip: offset,
    };
    const countClause: Prisma.ModulosCountArgs = {};

    if (paginationDto.search) {
      const whereClause: Prisma.ModulosWhereInput = {
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

    const modulos = await this.prismaService.modulos.findMany(clause);
    const count = await this.prismaService.modulos.count(countClause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'modulos activos',
      meta: {
        actualPage: page,
        totalCount: count,
        totalPages,
      },
      modulos,
    };
  }

  async findOne(id: string) {
    const modulo = await this.prismaService.modulos.findUnique({
      where: {
        id,
      },
    });
    if (!modulo) throw new NotFoundException('Modulo no encontrado');

    return modulo;
  }

  async update(
    id: string,
    updateModuloDto: UpdateModuloDto,
  ): Promise<UpdateModuloResponse> {
    const modulo = await this.findOne(id);
    const { icon, name, route, submodules } = updateModuloDto;

    const clause: Prisma.ModulosUpdateArgs = {
      where: {
        id,
      },
      data: {
        icon: icon ?? modulo.icon,
        name: name ?? modulo.name,
        route: route ?? modulo.route,
      },
    };

    const updateModule = await this.prismaService.modulos.update(clause);

    return {
      message: 'Modulo actualizado con exito!',
      modulo: updateModule,
    };
  }

  async remove(id: string): Promise<DeleteModuloResponse> {
    await this.findOne(id);

    const modulo = await this.prismaService.modulos.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Modulo eliminado con exito!',
      modulo,
    };
  }
}

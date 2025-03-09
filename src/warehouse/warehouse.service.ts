import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from '../services/prisma.service';
import {
  CreateWarehouseResponse,
  DeleteWarehouseResponse,
  FindAllWarehouses,
  PaginationDto,
  UpdateWarehouseResponse,
} from '../common';
import { Prisma } from '@prisma/client';

@Injectable()
export class WarehouseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<CreateWarehouseResponse> {
    const { name } = createWarehouseDto;
    const warehouse = await this.prismaService.warehouse.create({
      data: {
        name: name.toLowerCase(),
      },
    });

    return {
      message: 'Almacen creado con exito!',
      warehouse,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllWarehouses> {
    const { limit, page, search } = paginationDto;

    const offset = (+page - 1) * limit;
    const clause: Prisma.WarehouseFindManyArgs = {
      where: {
        isActive: true,
      },
      skip: offset,
      take: limit,
    };
    const countClause: Prisma.WarehouseCountArgs = {
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
    const total = await this.prismaService.warehouse.count(countClause);
    const warehouses = await this.prismaService.warehouse.findMany(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Usuarios activos',
      warehouses,
      pagination: {
        currentPage: page,
        totalPages,
        totalRows: total,
      },
    };
  }

  async findOne(id: string) {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: {
        isActive: true,
        id,
      },
    });
    if (!warehouse) throw new NotFoundException('No se encontro almacen');

    return warehouse;
  }

  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<UpdateWarehouseResponse> {
    const warehousePrev = await this.findOne(id);
    const { name } = updateWarehouseDto;

    const warehouse = await this.prismaService.warehouse.update({
      data: {
        name: name ?? warehousePrev.name,
      },

      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Almacen actualizado con exito!',
      warehouse,
    };
  }

  async remove(id: string): Promise<DeleteWarehouseResponse> {
    await this.findOne(id);
    const warehouse = await this.prismaService.warehouse.update({
      data: {
        isActive: false,
      },

      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Almacen eliminado con exito!',
      warehouse,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { PaginationDTo } from '../common/dto/pagination';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const warehouseInstance =
      this.warehouseRepository.create(createWarehouseDto);
    const warehouse = await this.warehouseRepository.save(warehouseInstance);

    return {
      message: 'Almacen creado con exito!',
      warehouse,
    };
  }

  async findAll(pagination: PaginationDTo) {
    const { limit: take, page: currentPage, search } = pagination;
    const page = currentPage ?? 1;
    const limit = take ?? 10;
    const offset = (+page - 1) * limit;

    const clause: FindManyOptions<Warehouse> = {
      where: {
        isActive: true,
      },

      take: limit,
      skip: offset,
    };

    if (search) {
      clause.where = {
        ...clause.where,
        name: ILike(`%${search.toLowerCase()}%`),
        address: ILike(`%${search.toLowerCase()}%`),
      };
    }

    const [warehouses, count] =
      await this.warehouseRepository.findAndCount(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);
    return {
      message: 'almacenes registrados',
      count,
      actualPage: currentPage,
      lastPage: totalPages,
      warehouses,
    };
  }

  async findOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!warehouse) throw new NotFoundException('No se encontro almacen');

    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.findOne(id);

    warehouse.address = updateWarehouseDto.address ?? warehouse.address;
    warehouse.name = updateWarehouseDto.name ?? warehouse.name;

    await this.warehouseRepository.save(warehouse);
    return {
      message: 'Almacen actualizado con exito!',
      warehouse,
    };
  }

  async remove(id: number) {
    const warehouse = await this.findOne(id);

    warehouse.isActive = false;
    await this.warehouseRepository.save(warehouse);

    return {
      message: 'Almacen eliminado con exito!',
      warehouse,
    };
  }
}

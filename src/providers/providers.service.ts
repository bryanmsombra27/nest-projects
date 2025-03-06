import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { PaginationDTo } from '../common/dto/pagination';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    const providerIns = this.providerRepository.create(createProviderDto);

    const provider = await this.providerRepository.save(providerIns);

    return {
      message: 'Proveedor creado con exito!',
      provider,
    };
  }

  async findAll(paginationDto: PaginationDTo) {
    const { limit: take, page: skip, search } = paginationDto;
    const page = skip ?? 1;
    const limit = take ?? 10;
    const offset = (+page - 1) * limit;

    const clause: FindManyOptions<Provider> = {
      where: {
        isActive: true,
      },
      take: limit,
      skip: offset,
    };

    if (search) {
      clause.where = {
        ...clause.where,
        name: ILike(`%${search}%`),
        address: ILike(`%${search}%`),
      };
    }

    const [providers, count] =
      await this.providerRepository.findAndCount(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Proveedores activos',
      count,
      actualPage: page,
      lastPage: totalPages,
      providers,
    };
  }

  async findOne(id: number) {
    const provider = await this.providerRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!provider) throw new NotFoundException('No se encontro proveedor');

    return provider;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const { address, name } = updateProviderDto;

    const provider = await this.findOne(id);

    provider.name = name ?? provider.name;
    provider.address = address ?? provider.address;

    await this.providerRepository.save(provider);

    return {
      message: 'Proveedor actualizado con exito!',
      provider,
    };
  }

  async remove(id: number) {
    const provider = await this.findOne(id);

    provider.isActive = false;
    await this.providerRepository.save(provider);
    return {
      message: 'Proveedor eliminado  con exito',
      provider,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PrismaService } from '../services/prisma.service';
import {
  CreateProviderResponse,
  DeleteProviderResponse,
  FindAllProviders,
  PaginationDto,
  UpdateProviderResponse,
} from '../common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProvidersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProviderDto: CreateProviderDto,
  ): Promise<CreateProviderResponse> {
    const { address, name } = createProviderDto;
    const provider = await this.prismaService.provider.create({
      data: {
        address: address.toLowerCase(),
        name: name.toLowerCase(),
      },
    });

    return {
      message: 'Proveedor creado con exito!',
      provider,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllProviders> {
    const { limit, page, search } = paginationDto;

    const offset = (+page - 1) * limit;
    const clause: Prisma.ProviderFindManyArgs = {
      where: {
        isActive: true,
      },
      skip: offset,
      take: limit,
    };
    const countClause: Prisma.ProviderCountArgs = {
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
        address: {
          contains: search.toLowerCase(),
        },
      };

      countClause.where.name = {
        contains: search.toLowerCase(),
      };
      countClause.where.address = {
        contains: search.toLowerCase(),
      };
    }
    const total = await this.prismaService.provider.count(countClause);
    const providers = await this.prismaService.provider.findMany(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Usuarios activos',
      providers,
      pagination: {
        currentPage: page,
        totalPages,
        totalRows: total,
      },
    };
  }

  async findOne(id: string) {
    const provider = await this.prismaService.provider.findUnique({
      where: {
        isActive: true,
        id,
      },
    });
    if (!provider) throw new NotFoundException('No se encontro el proveedor');

    return provider;
  }

  async update(
    id: string,
    updateProviderDto: UpdateProviderDto,
  ): Promise<UpdateProviderResponse> {
    const { address, name } = updateProviderDto;
    const providerPrev = await this.findOne(id);

    const provider = await this.prismaService.provider.update({
      data: {
        name: name ? name.toLowerCase() : providerPrev.name,
        address: address ? address.toLowerCase() : providerPrev.address,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Proveedor actualizo con exito!',
      provider,
    };
  }

  async remove(id: string): Promise<DeleteProviderResponse> {
    await this.findOne(id);

    const provider = await this.prismaService.provider.update({
      data: {
        isActive: false,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Proveedor actualizo con exito!',
      provider,
    };
  }
}

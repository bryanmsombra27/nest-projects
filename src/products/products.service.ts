import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProvidersService } from '../providers/providers.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { User } from '../users/entities/user.entity';
import { PaginationDTo } from 'src/common/dto/pagination';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly providerService: ProvidersService,
    private readonly warehouseService: WarehouseService,
  ) {}

  async create(user: User, createProductDto: CreateProductDto) {
    const { name, price, providerId } = createProductDto;
    const provider = await this.providerService.findOne(providerId);

    const productIns = this.productRepository.create({
      name,
      price,
      provider,
      warehouse: user.warehouse,
    });
    const product = await this.productRepository.save(productIns);

    return {
      message: 'Producto creado con exito!',
      product,
    };
  }

  async findAll(paginationDto: PaginationDTo) {
    const { limit: take, page: skip, search } = paginationDto;
    const page = skip ?? 1;
    const limit = take ?? 10;
    const offset = (+page - 1) * limit;

    const clause: FindManyOptions<Product> = {
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
      };
    }

    const [products, count] = await this.productRepository.findAndCount(clause);

    const totalPages = Math.ceil(count / limit);
    return {
      message: 'Productos activos',
      count,
      actualPage: page,
      lastPage: totalPages,
      products,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!product) throw new NotFoundException('No se encontro el producto');

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, price } = updateProductDto;

    const product = await this.findOne(id);

    product.name = name ?? product.name;
    product.price = price ?? product.price;

    await this.productRepository.save(product);

    return {
      message: 'Producto actualizado con exito!',
      product,
    };
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    product.isActive = false;

    await this.productRepository.save(product);

    return {
      message: 'Producto eliminado con exito!',
      product,
    };
  }
}

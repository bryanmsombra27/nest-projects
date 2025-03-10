import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../services/prisma.service';
import {
  CreateProductResponse,
  DeleteProductResponse,
  FindAllProducts,
  PaginationDto,
  UpdateProductResponse,
  UserPayloadToken,
} from '../common';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: UserPayloadToken,
    createProductDto: CreateProductDto,
  ): Promise<CreateProductResponse> {
    const { name, price, quantity } = createProductDto;

    const product = await this.prismaService.product.create({
      data: {
        price,
        name: name.toLowerCase(),
        warehouseId: user.warehouseId,
        stock: {
          create: {
            quantity,
          },
        },
      },
    });

    // await this.prismaService.stock.create({
    //   data: {
    //     quantity,
    //     productId: product.id,
    //   },
    // });

    return {
      message: 'Producto creado con exito!',
      product,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllProducts> {
    const { limit, page, search } = paginationDto;

    const offset = (+page - 1) * limit;
    const clause: Prisma.ProductFindManyArgs = {
      where: {
        isActive: true,
      },
      skip: offset,
      take: limit,
    };
    const countClause: Prisma.ProductCountArgs = {
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
    const total = await this.prismaService.product.count(countClause);
    const products = await this.prismaService.product.findMany(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Productos activos',
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalRows: total,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        isActive: true,
        id,
      },
    });
    if (!product) throw new NotFoundException('No se encontro el producto');

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    const { name, price } = updateProductDto;
    const productPrev = await this.findOne(id);

    const product = await this.prismaService.product.update({
      data: {
        name: name ? name.toLowerCase() : productPrev.name,
        price: price ?? productPrev.price,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Producto actualizado con exito!',
      product,
    };
  }

  async remove(id: string): Promise<DeleteProductResponse> {
    await this.findOne(id);

    const product = await this.prismaService.product.update({
      data: {
        isActive: false,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Producto actualizado con exito!',
      product,
    };
  }
}

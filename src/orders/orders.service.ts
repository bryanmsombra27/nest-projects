import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../services/prisma.service';
import {
  CreateOrderResponse,
  DeleteOrderResponse,
  FindAllOrders,
  PaginationDto,
  UpdateOrderResponse,
  UserPayloadToken,
} from '../common';
import { OrderItem, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: UserPayloadToken,
    createOrderDto: CreateOrderDto,
  ): Promise<CreateOrderResponse> {
    const { products } = createOrderDto;
    const productsIds = products.map((product) => product.productId);
    const productsInDB = await this.prismaService.product.findMany({
      where: {
        isActive: true,
        warehouseId: user.warehouseId,

        id: {
          in: productsIds,
        },
      },
      include: {
        stock: {
          select: {
            id: true,
            quantity: true,
            commit: true,
          },
        },
      },
    });

    if (products.length !== productsInDB.length)
      throw new BadRequestException(
        'Error al crear la orden, uno o varios productos no existen',
      );

    const orderItemsInstances = [];
    const updateStockInstances = [];

    for (const product of products) {
      const productInDB = productsInDB.find(
        (item) => item.id == product.productId,
      );

      if (
        product.quantity >
        productInDB.stock.quantity - productInDB.stock.commit
      )
        throw new BadRequestException(
          `El producto ${productInDB.name} no tiene stock suficiente para surtir, la orden fue cancelada`,
        );
      updateStockInstances.push(
        this.prismaService.stock.update({
          where: {
            isActive: true,
            id: productInDB.stock.id,
          },
          data: {
            commit: productInDB.stock.commit + product.quantity,
          },
        }),
      );

      orderItemsInstances.push({
        quantity: product.quantity,
        price: productInDB.price,
        productId: productInDB.id,
      });
    }
    await Promise.all(updateStockInstances);

    const order = await this.prismaService.order.create({
      data: {
        status: 'PENDING',
        OrderItems: {
          createMany: {
            data: orderItemsInstances,
          },
        },
      },
    });

    return {
      message: 'Orden creada con exito!',
      order,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllOrders> {
    const { limit, page, search } = paginationDto;

    const offset = (+page - 1) * limit;
    const clause: Prisma.OrderFindManyArgs = {
      where: {
        isActive: true,
      },
      skip: offset,
      take: limit,
    };
    const countClause: Prisma.OrderCountArgs = {
      where: {
        isActive: true,
      },
    };

    if (search) {
      clause.where = {
        ...clause.where,
      };

      // countClause.where = {
      //   ...countClause,

      // };
    }
    const total = await this.prismaService.order.count(countClause);
    const orders = await this.prismaService.order.findMany(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Ordenes activas',
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalRows: total,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prismaService.order.findUnique({
      where: {
        isActive: true,
        id,
      },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateOrderResponse> {
    const orderPrev = await this.findOne(id);
    const order = await this.prismaService.order.update({
      data: {
        status: updateOrderDto.status ?? orderPrev.status,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Status de la orden actualizado con exito!',
      order,
    };
  }

  async remove(id: string): Promise<DeleteOrderResponse> {
    await this.findOne(id);
    const order = await this.prismaService.order.update({
      where: {
        isActive: true,
        id,
      },
      data: {
        isActive: false,
      },
    });

    return {
      message: 'Orden eliminada con exito!',
      order,
    };
  }
}

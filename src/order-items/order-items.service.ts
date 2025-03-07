import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
import { OrderService } from '../order/order.service';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { PaginationDTo } from 'src/common/dto/pagination';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createOrderItemDto: CreateOrderItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    // await queryRunner.connect()
    await queryRunner.startTransaction();
    try {
      const productIds = [];
      const orderItemsInstance: OrderItem[] = [];

      for (const product of createOrderItemDto.productIds) {
        productIds.push(product.id);
      }

      const orderInstance = queryRunner.manager.create(Order, { user });
      const order = await queryRunner.manager.save(orderInstance);
      const products = await queryRunner.manager.find(Product, {
        where: {
          isActive: true,
          id: In(productIds),
        },
      });
      if (productIds.length !== products.length) {
        throw new BadRequestException('Los productos no coinciden');
      }

      for (const product of products) {
        const item = createOrderItemDto.productIds.find(
          (p) => p.id == product.id,
        );

        if (!item) {
          throw new BadRequestException(`El producto no esta disponible`);
        }

        const orderItem = queryRunner.manager.create(OrderItem, {
          order,
          product,
          quantity: item.quantity,
          price: product.price,
        });
        orderItemsInstance.push(orderItem);
      }
      const orderItems = await queryRunner.manager.save(orderItemsInstance);

      await queryRunner.commitTransaction();

      return {
        message: 'Orden creada con exito!',
        orderItems,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('No fue posible crear la orden');
    }
  }

  async findAll(pagination: PaginationDTo) {
    const { limit: take, page: skip, search } = pagination;
    const page = skip ?? 1;
    const limit = take ?? 10;
    const offset = (+page - 1) * limit;

    const clause: FindManyOptions<OrderItem> = {
      where: {
        isActive: true,
      },
      take: limit,
      skip: offset,
    };
    if (search) {
      clause.where = {
        ...clause.where,
        product: {
          name: ILike(`${search}`),
        },
      };
    }
    const [orderItems, count] =
      await this.orderItemRepository.findAndCount(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Order Items activos',
      count,
      actualPage: page,
      lastPage: totalPages,
      orderItems,
    };
  }

  async findOne(id: number) {
    const orderItem = await this.orderItemRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!orderItem)
      throw new NotFoundException('Producto ordenado no encontrado');

    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);
    orderItem.quantity = updateOrderItemDto.productIds[0].quantity;

    await this.orderItemRepository.save(orderItem);

    return {
      message: 'Producto ordenado actualizado  con exito!',
      orderItem,
    };
  }

  async remove(id: number) {
    const orderItem = await this.findOne(id);

    orderItem.isActive = false;

    await this.orderItemRepository.save(orderItem);
    return {
      message: 'Producto ordenado eliminado  con exito!',
      orderItem,
    };
  }
}

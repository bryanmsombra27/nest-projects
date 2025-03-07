import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { PaginationDTo } from 'src/common/dto/pagination';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(user: User) {
    const orderInstance = this.orderRepository.create({
      user,
    });

    const order = await this.orderRepository.save(orderInstance);

    return {
      message: 'Orden creada con exito!',
      order,
    };
  }

  async findAll(paginationDto: PaginationDTo) {
    const { limit: take, page: skip, search } = paginationDto;
    const page = skip ?? 1;
    const limit = take ?? 10;
    const offset = (+page - 1) * limit;

    const clause: FindManyOptions<Order> = {
      where: {
        isActive: true,
      },

      take: limit,
      skip: offset,
    };

    if (search) {
      clause.where = {
        ...clause.where,
        user: {
          name: ILike(`${search}`),
        },
      };
    }

    const [orders, count] = await this.orderRepository.findAndCount(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Stocks activos',
      count,
      actualPage: page,
      lastPage: totalPages,
      orders,
    };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!order) throw new NotFoundException('Orden no encontrada');

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    order.status = updateOrderDto.status ?? order.status;

    await this.orderRepository.save(order);
    return {
      message: 'El estado de la orden se actualizo con exito!',
      order,
    };
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    order.isActive = false;

    await this.orderRepository.save(order);
    return {
      message: 'La orden se elimino con exito!',
      order,
    };
  }
}

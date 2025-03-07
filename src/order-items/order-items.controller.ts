import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { AuthGuard } from '../guards/authguard.guard';
import { LoggedUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ADMIN_ROLE, STORE_ROLE } from '../common/config/constants';
import { PaginationDTo } from '../common/dto/pagination';

@Controller('order-items')
@UseGuards(AuthGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.orderItemsService.create(user, createOrderItemDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    paginationDto: PaginationDTo,
  ) {
    return this.orderItemsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.orderItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.orderItemsService.remove(+id);
  }
}

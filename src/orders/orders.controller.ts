import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  ADMIN_ROLE,
  LoggedUser,
  PaginationDto,
  STORE_ROLE,
  UserPayloadToken,
} from '../common';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: UserPayloadToken,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(user, createOrderDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.remove(id);
  }
}

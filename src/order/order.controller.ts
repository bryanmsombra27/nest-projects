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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../guards/authguard.guard';
import { LoggedUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ADMIN_ROLE, STORE_ROLE } from '../common/config/constants';
import { PaginationDTo } from '../common/dto/pagination';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    // @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(user);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Query() paginationDto: PaginationDTo,
  ) {
    return this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.orderService.remove(+id);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { Status } from '../entities/order.entity';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(Status, { message: `solo se admite el estatus de: ${Status}` })
  status: Status;
}

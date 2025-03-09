import {
  ArrayMinSize,
  IsArray,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];
}

import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => OrderItem)
  productIds: OrderItem[];
}

class OrderItem {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

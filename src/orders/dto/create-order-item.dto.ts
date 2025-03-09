import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsPositive()
  productId: number;
}

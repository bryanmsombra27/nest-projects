import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @IsNumber()
  @IsOptional()
  commit?: number;
}

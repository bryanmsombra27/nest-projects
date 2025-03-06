import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDTo {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;
}

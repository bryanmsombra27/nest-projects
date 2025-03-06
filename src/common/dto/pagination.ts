import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PaginationDTo {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  search?: string;
}

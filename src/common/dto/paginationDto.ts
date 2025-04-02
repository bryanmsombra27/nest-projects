import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search: string;
}

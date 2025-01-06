import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'quantity of records returned',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // enableImplicitConversions :true
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'how much records do you  have  to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

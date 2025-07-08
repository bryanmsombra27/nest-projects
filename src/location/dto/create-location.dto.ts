import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateLocationDto {
  //   @ValidateNested({ each: true })
  //   @Type(() => Number)
  @ArrayMinSize(2)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  location: number[];
}

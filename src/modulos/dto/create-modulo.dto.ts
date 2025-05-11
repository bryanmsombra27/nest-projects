import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateModuloDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  route: string;

  @IsNotEmpty()
  icon: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSubmoduloDto)
  @IsOptional()
  submodules?: CreateSubmoduloDto[];
}

export class CreateSubmoduloDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  route: string;

  @IsNotEmpty()
  icon: string;
}

import { Type } from 'class-transformer';
import { isArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateSubmoduloDto {
  @ValidateNested({ each: true })
  @Type(() => SubmoduleDto)
  submodules: SubmoduleDto[];
}

export class SubmoduleDto {
  @IsNotEmpty()
  module_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  route: string;

  @IsNotEmpty()
  icon: string;
}

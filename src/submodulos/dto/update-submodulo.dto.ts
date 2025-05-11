import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmoduloDto, SubmoduleDto } from './create-submodulo.dto';

export class UpdateSubmoduloDto extends PartialType(SubmoduleDto) {}

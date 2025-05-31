import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  id: string;

  @IsBoolean()
  edit: boolean;
  @IsBoolean()
  write: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  read: boolean;

  // @IsArray({ each: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionSubmoduleDto)
  submodules?: CreatePermissionSubmoduleDto[];
}

class CreatePermissionSubmoduleDto {
  @IsString()
  id: string;

  @IsBoolean()
  edit: boolean;
  @IsBoolean()
  write: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  read: boolean;
}

// id: string;
// edit: boolean;
// delete: boolean;
// write: boolean;
// submodules?: {
//   id: string;
//   edit: boolean;
//   delete: boolean;
//   write: boolean;
// }[];

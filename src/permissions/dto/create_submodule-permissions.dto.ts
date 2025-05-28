import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsString } from 'class-validator';

export class CreateSubmodulePermissionsDto {
  @IsString()
  submoduleId: string;

  @IsString()
  roleId: string;

  @IsBoolean()
  edit: boolean;

  @IsBoolean()
  write: boolean;

  @IsBoolean()
  delete: boolean;
}
export class UpdateSubmodulePermissionDto extends PartialType(
  CreateSubmodulePermissionsDto,
) {}

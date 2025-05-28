import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { LoggedUser } from 'src/common/decorators/logged-user/logged-user.decorator';
import { ValidRoles } from 'src/common/config/constants';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';
import { AuthGuard } from 'src/guards/auth.guard';
import { PaginationDto } from 'src/common/dto/paginationDto';
import {
  CreateSubmodulePermissionsDto,
  UpdateSubmodulePermissionDto,
} from './dto/create_submodule-permissions.dto';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post(':id')
  create(
    @Body() createPermissionDto: CreatePermissionDto[],
    @Param('id') id: string,
  ) {
    return this.permissionsService.create(id, createPermissionDto);
  }

  @Get(':id')
  findAll(@Query() paginationDto: PaginationDto, @Param('id') id: string) {
    return this.permissionsService.findAll(id, paginationDto);
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post('submodules')
  createSubmodules(
    @Body() createPermissionSubmoduleDto: CreateSubmodulePermissionsDto,
  ) {
    return this.permissionsService.createSubmodulePermissions(
      createPermissionSubmoduleDto,
    );
  }

  @Patch('submodules/:id')
  updateSubmodules(
    @Param('id') id: string,
    @Body() createPermissionSubmoduleDto: UpdateSubmodulePermissionDto,
  ) {
    return this.permissionsService.updateSubmodulePermissions(
      id,
      createPermissionSubmoduleDto,
    );
  }
  @Delete('submodules/:id')
  deleteSubmodules(@Param('id') id: string) {
    return this.permissionsService.removeSubmodulePermission(id);
  }
}

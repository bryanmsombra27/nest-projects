import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../guards/auth.guard';
import { LoggedUser } from '../common/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { ADMIN_ROLE } from '../common/config/constants';

@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.rolesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.rolesService.remove(id);
  }
}

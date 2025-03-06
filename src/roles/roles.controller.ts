import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDTo } from '../common/dto/pagination';
import { AuthguardGuard } from '../guards/authguard.guard';
import { LoggedUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ADMIN_ROLE } from '../common/config/constants';

@Controller('roles')
@UseGuards(AuthguardGuard)
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
    @Query() paginationDto: PaginationDTo,
  ) {
    return this.rolesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@LoggedUser([ADMIN_ROLE]) user: User, @Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@LoggedUser([ADMIN_ROLE]) user: User, @Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}

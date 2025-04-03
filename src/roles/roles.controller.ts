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
import { PaginationDto } from '../common/dto/paginationDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';
import { ValidRoles } from 'src/common/config/constants';
import { LoggedUser } from 'src/common/decorators/logged-user/logged-user.decorator';

@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(
    @Body() createRoleDto: CreateRoleDto,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.rolesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
    @Param('id') id: string,
  ) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
    @Param('id') id: string,
  ) {
    return this.rolesService.remove(id);
  }

  @Delete('def/:id')
  delete(
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
    @Param('id') id: string,
  ) {
    return this.rolesService.delete(id);
  }
}

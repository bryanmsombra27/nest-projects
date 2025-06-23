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
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { LoggedUser } from 'src/common/decorators/logged-user/logged-user.decorator';
import { ValidRoles } from 'src/common/config/constants';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('modulos')
@UseGuards(AuthGuard)
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Post()
  create(
    @Body() createModuloDto: CreateModuloDto,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN]) user: EncodedPayloadToken,
  ) {
    return this.modulosService.create(createModuloDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN]) user: EncodedPayloadToken,
  ) {
    return this.modulosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN]) user: EncodedPayloadToken,
  ) {
    return this.modulosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuloDto: UpdateModuloDto,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN]) user: EncodedPayloadToken,
  ) {
    return this.modulosService.update(id, updateModuloDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN]) user: EncodedPayloadToken,
  ) {
    return this.modulosService.remove(id);
  }
}

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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  ADMIN_ROLE,
  LoggedUser,
  PaginationDto,
  UserPayloadToken,
} from '../common';

@Controller('providers')
@UseGuards(AuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Body() createProviderDto: CreateProviderDto,
  ) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.providersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.providersService.remove(id);
  }
}

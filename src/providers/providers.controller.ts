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
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { AuthGuard } from '../guards/authguard.guard';
import { PaginationDTo } from '../common/dto/pagination';
import { LoggedUser } from '../common/decorators/user.decorator';
import { ADMIN_ROLE, STORE_ROLE } from '../common/config/constants';
import { User } from '../users/entities/user.entity';

@Controller('providers')
@UseGuards(AuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Body()
    createProviderDto: CreateProviderDto,
  ) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Query() paginationDto: PaginationDTo,
  ) {
    return this.providersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.providersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(+id, updateProviderDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.providersService.remove(+id);
  }
}

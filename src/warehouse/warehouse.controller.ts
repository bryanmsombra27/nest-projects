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
  ParseUUIDPipe,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { LoggedUser, PaginationDto, UserPayloadToken } from '../common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('warehouse')
@UseGuards(AuthGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  create(
    @LoggedUser() user: UserPayloadToken,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll(
    @LoggedUser() user: UserPayloadToken,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.warehouseService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser() user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser() user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser() user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.warehouseService.remove(id);
  }
}

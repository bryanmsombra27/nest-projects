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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PaginationDTo } from '../common/dto/pagination';
import { LoggedUser } from '../common/decorators/user.decorator';
import { ADMIN_ROLE } from '../common/config/constants';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../guards/authguard.guard';

@Controller('warehouse')
@UseGuards(AuthGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDTo) {
    return this.warehouseService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(+id);
  }
}

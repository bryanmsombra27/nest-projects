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
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PaginationDTo } from '../common/dto/pagination';
import { LoggedUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ADMIN_ROLE, STORE_ROLE } from 'src/common/config/constants';
import { AuthGuard } from '../guards/authguard.guard';

@Controller('stock')
@UseGuards(AuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Body() createStockDto: CreateStockDto,
  ) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Query() paginationDto: PaginationDTo,
  ) {
    return this.stockService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.stockService.remove(+id);
  }
}

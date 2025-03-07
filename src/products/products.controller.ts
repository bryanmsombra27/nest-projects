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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { LoggedUser } from '../common/decorators/user.decorator';
import { ADMIN_ROLE, STORE_ROLE } from '../common/config/constants';
import { User } from '../users/entities/user.entity';
import { PaginationDTo } from '../common/dto/pagination';
import { AuthGuard } from '../guards/authguard.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user, createProductDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Query() paginationDto: PaginationDTo,
  ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: User,
    @Param('id') id: string,
  ) {
    return this.productsService.remove(+id);
  }
}

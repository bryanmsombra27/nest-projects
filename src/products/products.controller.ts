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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  ADMIN_ROLE,
  LoggedUser,
  PaginationDto,
  STORE_ROLE,
  UserPayloadToken,
} from '../common';
import { ProductAssignationDto } from './dto/product-assignation.dto';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user, createProductDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE, STORE_ROLE]) user: UserPayloadToken,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.productsService.remove(id);
  }

  @Post('assignation')
  productAssignation(
    @LoggedUser([STORE_ROLE]) user: UserPayloadToken,
    @Body() productAssigationDto: ProductAssignationDto,
  ) {
    return this.productsService.productAssignation(user, productAssigationDto);
  }
}

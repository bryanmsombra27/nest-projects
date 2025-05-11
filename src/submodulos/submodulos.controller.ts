import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubmodulosService } from './submodulos.service';
import { CreateSubmoduloDto } from './dto/create-submodulo.dto';
import { UpdateSubmoduloDto } from './dto/update-submodulo.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Controller('submodulos')
export class SubmodulosController {
  constructor(private readonly submodulosService: SubmodulosService) {}

  @Post()
  create(@Body() createSubmoduloDto: CreateSubmoduloDto) {
    return this.submodulosService.create(createSubmoduloDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.submodulosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submodulosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmoduloDto: UpdateSubmoduloDto,
  ) {
    return this.submodulosService.update(id, updateSubmoduloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submodulosService.remove(id);
  }
}

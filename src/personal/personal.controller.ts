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
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { LoggedUser } from 'src/common/decorators/logged-user/logged-user.decorator';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';
import { ValidRoles } from 'src/common/config/constants';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  create(
    @Body() createPersonalDto: CreatePersonalDto,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.personalService.create(createPersonalDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.personalService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.personalService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonalDto: UpdatePersonalDto,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.personalService.update(id, updatePersonalDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.personalService.remove(id);
  }

  @Delete('def/:id')
  removeFromTable(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT]) user: EncodedPayloadToken,
  ) {
    return this.personalService.delete(id);
  }
}

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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { LoggedUser } from 'src/common/decorators/logged-user/logged-user.decorator';
import { ValidRoles } from 'src/common/config/constants';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.AUX])
    user: EncodedPayloadToken,
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.AUX])
    user: EncodedPayloadToken,
  ) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.AUX])
    user: EncodedPayloadToken,
  ) {
    return this.userService.findOne(id);
  }

  @Get('qr/:id')
  generateQRUser(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.AUX])
    user: EncodedPayloadToken,
  ) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN])
    user: EncodedPayloadToken,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN])
    user: EncodedPayloadToken,
  ) {
    return this.userService.remove(id);
  }

  @Delete('def/:id')
  delete(
    @Param('id') id: string,
    @LoggedUser([ValidRoles.ROOT, ValidRoles.ADMIN])
    user: EncodedPayloadToken,
  ) {
    return this.userService.delete(id);
  }
}

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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  LoggedUser,
  ADMIN_ROLE,
  UserPayloadToken,
  PaginationDto,
} from '../common';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(user, createUserDto);
    // return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.remove(id);
  }
}

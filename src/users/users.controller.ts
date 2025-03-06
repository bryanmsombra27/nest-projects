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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDTo } from '../common/dto/pagination';
import { AuthGuard } from '../guards/authguard.guard';
import { LoggedUser } from '../common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { ADMIN_ROLE } from '../common/config/constants';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Query() paginationDto: PaginationDTo,
  ) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@LoggedUser([ADMIN_ROLE]) user: User, @Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: User,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@LoggedUser([ADMIN_ROLE]) user: User, @Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

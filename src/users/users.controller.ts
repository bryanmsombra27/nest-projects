import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { LoggedUser } from '../common/decorators/logged-user.decorator';
import { ADMIN_ROLE } from '../common/config/constants';
import { UserPayloadToken } from '../common/api_responses';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@LoggedUser([ADMIN_ROLE]) user: UserPayloadToken) {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @LoggedUser([ADMIN_ROLE]) user: UserPayloadToken,
    @Param('id') id: string,
  ) {
    return this.usersService.remove(+id);
  }
}

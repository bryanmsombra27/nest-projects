import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDTo } from '../common/dto/pagination';
import { AuthService } from '../auth/auth.service';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const passwordHash = await hash(password, 10);
    const role = await this.roleRepository.findOne({
      where: {
        isActive: true,
        name: ILike('%tienda%'),
      },
    });

    // const userInstance = await this.userRepository.preload({
    //   ...rest,
    //   password: passwordHash,
    //   role: {
    //     id: 2,
    //   },
    // });

    const userInstance = this.userRepository.create({
      ...rest,
      password: passwordHash,
      role: role,
    });

    const { password: dbPassword, ...user } =
      await this.userRepository.save(userInstance);

    const token = this.jwtService.generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });
    return {
      message: 'usuario creado con exito!',
      user,
      token,
    };
  }

  async findAll(paginationDto: PaginationDTo) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const [users, count] = await this.userRepository.findAndCount({
      where: {
        isActive: true,
        role: {
          id: 2,
        },
      },
      take: limit,
      skip: offset,
    });

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);
    return {
      message: 'Tiendas encontradas',
      actualPage: page,
      lastPage: totalPages,
      count,
      stores: users,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!user) throw new NotFoundException('no se encontro tienda');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const { email, name, phone } = updateUserDto;

    user.email = email ?? user.email;
    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;

    await this.userRepository.save(user);

    return {
      message: 'Perfil actualizado con exito!',
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    user.isActive = false;
    await this.userRepository.save(user);

    return {
      message: 'tienda eliminada con exito!',
    };
  }
}

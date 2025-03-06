import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindManyOptions, Not, Repository } from 'typeorm';
import { PaginationDTo } from '../common/dto/pagination';
import { ADMIN_ROLE } from '../common/config/constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);

    return await this.roleRepository.save(role);
  }

  async findAll(paginationDto: PaginationDTo) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const clause: FindManyOptions<Role> = {
      where: {
        isActive: true,
        name: Not(ADMIN_ROLE),
      },
      take: limit,
      skip: offset,
    };

    const [roles, count] = await this.roleRepository.findAndCount(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'roles activos',
      actualPage: page,
      lastPage: totalPages,
      count,
      roles,
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });

    if (!role) {
      throw new NotFoundException('No se encontro rol');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    role.name = updateRoleDto.name ?? role.name;

    return await this.roleRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);

    role.isActive = false;

    await this.roleRepository.save(role);

    return {
      message: 'Rol Eliminado con exito!',
      role,
    };
  }
}

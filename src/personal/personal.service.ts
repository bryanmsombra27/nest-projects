import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { CreatePersonalResponse } from 'src/common/interfaces/CreateResponses';
import { hash } from 'bcryptjs';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Personal, Prisma } from '@prisma/client';
import { GetAllPersonal } from 'src/common/interfaces/GetAllResponses';
import { FindPersonalResponse } from 'src/common/interfaces/FindOneResponses';
import { UpdatePersonalResponse } from 'src/common/interfaces/UpdateResponses';
import { DeletePersonalResponse } from 'src/common/interfaces/DeleteResponses';

@Injectable()
export class PersonalService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createPersonalDto: CreatePersonalDto,
  ): Promise<CreatePersonalResponse> {
    const { password, ...newPersonal } = createPersonalDto;

    const hashedPassword = await hash(password, 10);

    const personal = await this.prismaService.personal.create({
      data: {
        ...newPersonal,
        password: hashedPassword,
      },
      select: {
        email: true,
        id: true,
        isActive: true,
        nombre: true,
        rolId: true,
        telefono: true,
        rol: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { message: 'Personal creado con exito', personal };
  }

  async findAll(paginationDto: PaginationDto): Promise<GetAllPersonal> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const clause: Prisma.PersonalFindManyArgs = {
      where: {
        isActive: true,
      },
      take: limit,
      skip: offset,
      select: {
        email: true,
        id: true,
        isActive: true,
        nombre: true,
        telefono: true,
        rolId: true,
        rol: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    };
    const countClause: Prisma.PersonalCountArgs = {
      where: {
        isActive: true,
      },
    };
    if (paginationDto.search) {
      clause.where = {
        isActive: true,
        nombre: { startsWith: paginationDto.search.toLowerCase() },
        email: { startsWith: paginationDto.search.toLowerCase() },
        telefono: { startsWith: paginationDto.search.toLowerCase() },
      };
      clause.where = {
        isActive: true,
        nombre: { startsWith: paginationDto.search.toLowerCase() },
        email: { startsWith: paginationDto.search.toLowerCase() },
        telefono: { startsWith: paginationDto.search.toLowerCase() },
      };
    }
    const personal = await this.prismaService.personal.findMany(clause);
    const count = await this.prismaService.personal.count(countClause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Personal Activo',
      personal,
      meta: {
        actualPage: page,
        totalCount: count,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<FindPersonalResponse> {
    const personal = await this.prismaService.personal.findFirst({
      where: {
        isActive: true,
        id,
      },
      select: {
        nombre: true,
        email: true,
        id: true,
        isActive: true,
        rolId: true,
        telefono: true,
        rol: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    if (!personal) throw new NotFoundException('No se encontro el personal');

    return personal;
  }

  async update(
    id: string,
    updatePersonalDto: UpdatePersonalDto,
  ): Promise<UpdatePersonalResponse> {
    const personal = await this.findOne(id);
    const updatePersonal = await this.prismaService.personal.update({
      where: {
        isActive: true,
        id,
      },
      data: {
        email: updatePersonalDto.email ?? personal.email,
        nombre: updatePersonalDto.nombre ?? personal.nombre,
        telefono: updatePersonalDto.telefono ?? personal.telefono,
      },
    });

    return {
      message: 'Personal actualizado con exito!',
      personal: updatePersonal,
    };
  }

  async remove(id: string): Promise<DeletePersonalResponse> {
    const personal = await this.findOne(id);

    const updatedPersonal = await this.prismaService.personal.update({
      data: {
        isActive: false,
      },
      where: {
        isActive: true,
        id,
      },
    });

    return {
      message: 'Personal eliminado con exito!',
      personal: updatedPersonal,
    };
  }

  async delete(id: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: {
        id,
      },
    });
    if (!personal) {
      throw new NotFoundException('El personal ya fue eliminado del sistema');
    }

    await this.prismaService.personal.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Personal eliminado con exito!',
    };
  }
}

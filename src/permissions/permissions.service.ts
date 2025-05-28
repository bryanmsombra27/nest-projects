import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Prisma } from '@prisma/client';
import {
  CreateSubmodulePermissionsDto,
  UpdateSubmodulePermissionDto,
} from './dto/create_submodule-permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  async create(roleId: string, createPermissionDto: CreatePermissionDto[]) {
    const rol = await this.prismaService.rol.findUnique({
      where: {
        id: roleId,
        isActive: true,
      },
    });

    if (!rol) {
      throw new NotFoundException(
        'No fue posible asignar el permiso a un rol inactivo o eliminado',
      );
    }
    console.log(createPermissionDto, 'PERMISSION DTO');

    for (const module of createPermissionDto) {
      console.log(module, 'MODULO ITERADO');

      if (!module?.submodules) {
        await this.prismaService.permisos_modulos.create({
          data: {
            role_id: roleId,
            module_id: module.id,
            edit: module.edit ?? false,
            write: module.write ?? false,
            delete: module.delete ?? false,
            read: true,
          },
        });
      } else {
        const submodules = [];
        for (const submodule of module.submodules) {
          submodules.push({
            submodule_id: submodule.id,
            delete: submodule.delete ?? false,
            edit: submodule.edit ?? false,
            write: submodule.write ?? false,
            read: true,
          });
        }

        await this.prismaService.permisos_modulos.create({
          data: {
            role_id: roleId,
            module_id: module.id,
            edit: module.edit ?? false,
            write: module.write ?? false,
            delete: module.delete ?? false,
            read: true,
            Permisos_submodulos: {
              createMany: {
                data: submodules,
              },
            },
          },
        });
      }
    }

    return {
      message: 'Los permisos para el modulo se asignaron correctamente!',
    };
  }

  async createSubmodulePermissions(
    createPermissionSubmoduleDto: CreateSubmodulePermissionsDto,
  ) {
    const {
      delete: deletePermission,
      edit,
      roleId,
      submoduleId,
      write,
    } = createPermissionSubmoduleDto;

    const rol = await this.prismaService.rol.findUnique({
      where: {
        id: roleId,
        isActive: true,
      },
    });

    if (!rol) {
      throw new NotFoundException(
        'No fue posible asignar el permiso a un rol inactivo o eliminado',
      );
    }

    // await this.prismaService.permisos_submodulos.create({
    //   data: {
    //     delete: deletePermission,
    //     edit,
    //     write,
    //     module_permission_id:"",
    //     submodule_id: submoduleId,
    //     read: true,
    //     // role_id: roleId,
    //   },
    // });

    return {
      message:
        'Los permisos para el submodulo fueron asignados con correctamente!',
    };
  }

  async findAll(roleId: string, paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;
    const clause: Prisma.Permisos_modulosFindManyArgs = {
      // take: limit,
      // skip: offset,
      where: {
        role_id: roleId,
      },
      include: {
        Permisos_submodulos: {
          select: {
            delete: true,
            edit: true,
            write: true,
            module_permission_id: true,
            submodule_id: true,
          },
        },
      },
    };
    const countClause: Prisma.Permisos_modulosCountArgs = {
      where: {
        role_id: roleId,
      },
    };

    if (paginationDto.search) {
      // const whereSearchClause: Prisma.Permisos_modulosWhereInput = {
      //   OR: [
      //     {
      //       : {
      //         contains: paginationDto.search.toLowerCase().trim(),
      //       },
      //     },
      //   ],
      //   name: {
      //     not: 'root',
      //   },
      // };
      // clause.where = whereSearchClause;
      // countClause.where = whereSearchClause;
    }
    const permisos = await this.prismaService.permisos_modulos.findMany(clause);
    const count = await this.prismaService.permisos_modulos.count(countClause);

    return {
      message: 'Permisos activos',
      permisos,
    };
  }

  async findOne(id: string) {
    const permission = await this.prismaService.permisos_modulos.findUnique({
      where: {
        id,
      },
    });
    if (!permission)
      throw new NotFoundException(
        'No fue posible encontrar la asignacion del permiso para el rol',
      );

    return permission;
  }

  async updateSubmodulePermissions(
    id: string,
    updatePermissionDto: UpdateSubmodulePermissionDto,
  ) {
    const permission = await this.findOne(id);
    const { edit, write, delete: deletePermission } = updatePermissionDto;

    const updatedPermission =
      await this.prismaService.permisos_submodulos.update({
        where: {
          id,
        },
        data: {
          edit: edit ?? permission.edit,
          write: write ?? permission.write,
          delete: deletePermission ?? permission.delete,
        },
      });

    return {
      message: 'los permisos para el modulo se han actualizado exitosamente',
      permission: updatedPermission,
    };
  }
  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    const {
      edit,
      // roleId,
      write,
      delete: deletePermission,
    } = updatePermissionDto;

    const updatedPermission = await this.prismaService.permisos_modulos.update({
      where: {
        id,
      },
      data: {
        edit: edit ?? permission.edit,
        write: write ?? permission.write,
        delete: deletePermission ?? permission.delete,
      },
    });

    return {
      message: 'los permisos para el modulo se han actualizado exitosamente',
      permission: updatedPermission,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    const permissionDeleted = await this.prismaService.permisos_modulos.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Los permisos para el modulo fueron revocados con exito!',
      permission: permissionDeleted,
    };
  }

  async removeSubmodulePermission(id: string) {
    const permission = await this.prismaService.permisos_submodulos.findUnique({
      where: {
        id,
      },
    });

    if (!permission)
      throw new NotFoundException('no se ha asignado permiso para el modulo');

    const permissionDeleted =
      await this.prismaService.permisos_submodulos.delete({
        where: {
          id,
        },
      });

    return {
      message: 'Los permisos para el modulo fueron revocados con exito!',
      permission: permissionDeleted,
    };
  }
}

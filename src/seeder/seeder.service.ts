import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';
import { Modulos } from '@prisma/client';

@Injectable()
export class SeederService {
  constructor(private readonly prismaService: PrismaService) {}

  async runSeed() {
    try {
      await this.prismaService.permisos_submodulos.deleteMany();
      await this.prismaService.permisos_modulos.deleteMany();
      await this.prismaService.personal.deleteMany();

      await this.prismaService.rol.deleteMany();
      await this.prismaService.submodulos.deleteMany();
      await this.prismaService.modulos.deleteMany();

      await this.createRoles();
      await this.createPersonal();
      await this.createModulos();

      console.log('SEEDER CARGADO CON EXITO!');

      return {
        message: 'SEEDER IMPORTADO CON EXITO!',
      };
    } catch (error) {
      console.log(error, 'ERROR SEEDER');
      throw new BadRequestException('No fue posible cargar el archivo seeder');
    }
  }

  private async createRoles() {
    const roles = [
      { name: 'admin', description: 'rol de administador del sistema QRUD' },
      { name: 'root', description: 'rol principañ  del sistema QRUD' },
      { name: 'aux', description: 'rol auxiliar del sistema QRUD' },
    ];

    await this.prismaService.rol.createMany({ data: roles });
  }

  private async createPersonal() {
    const roles = await this.prismaService.rol.findMany();
    const rolRoot = roles.find((rol) => rol.name == 'root');

    const items = Array.from({ length: 10 }, (_, index) => {
      const password = hashSync('123456', 10);
      return {
        nombre: faker.person.fullName(),
        telefono: faker.phone.number({ style: 'human' }),
        email: faker.internet.email(),
        password,
        rolId: index == 0 ? rolRoot.id : roles[0].id,
      };
    });

    await this.prismaService.personal.createMany({ data: items });
  }

  private async createModulos() {
    const roles = await this.prismaService.rol.findMany();
    const rolRoot = roles.find((rol) => rol.name == 'root');

    const initModules: Modulo[] = [
      {
        name: 'Usuarios',
        route: '/ver-usuarios',
        icon: 'fa-users',
      },
      {
        name: 'Personal',
        route: '/ver-personal',
        icon: 'fa-users-gear',
      },
      {
        name: 'Rol',
        route: '/ver-rol',
        icon: 'fa-r',
      },
      {
        name: 'Modulos',
        route: '/modulo',
        icon: 'fa-m',
      },
      {
        name: 'Contraseña',
        route: '/contrasena',
        icon: 'fa-key',
      },
      {
        name: 'QR',
        route: '/qr',
        icon: 'fa-qrcode',
      },
    ];

    // const modules = await this.prismaService.modulos.createManyAndReturn({
    //   data: initModules,
    // });
    const modulosPromises: Promise<Modulos>[] = [];

    for (const module of initModules) {
      modulosPromises.push(
        this.prismaService.modulos.create({
          data: {
            ...module,
            Permisos_modulos: {
              create: {
                delete: true,
                edit: true,
                read: true,
                role_id: rolRoot.id,
                write: true,
              },
            },
          },
        }),
      );
    }

    const modulos = await Promise.all(modulosPromises);
  }
}

interface Modulo {
  name: string;
  icon: string;
  route: string;
}

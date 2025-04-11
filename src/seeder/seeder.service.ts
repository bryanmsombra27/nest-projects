import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(private readonly prismaService: PrismaService) {}

  async runSeed() {
    try {
      await this.prismaService.rol.deleteMany();
      await this.prismaService.personal.deleteMany();

      await this.createRoles();
      await this.createPersonal();

      console.log('SEEDER CARGADO CON EXITO!');

      return {
        message: 'SEEDER IMPORTADO CON EXITO!',
      };
    } catch (error) {
      console.log(error, 'ERROR SEEDER');
      throw new BadRequestException('No fue posible cargar el archivo seeder');
    }
  }

  async generateUsers() {}

  async createRoles() {
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
}

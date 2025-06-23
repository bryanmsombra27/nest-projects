import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { CreateUsuarioResponse } from 'src/common/interfaces/CreateResponses';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Prisma, Usuario } from '@prisma/client';
import { GetAllUsuarios } from 'src/common/interfaces/GetAllResponses';
import { UpdateUsuarioResponse } from 'src/common/interfaces/UpdateResponses';
import { DeleteUsuarioResponse } from 'src/common/interfaces/DeleteResponses';
import { toDataURL } from 'qrcode';
import { opt, qrEmail, transport } from 'src/common/helpers/qrEmail';
import { FirebaseService } from 'src/common/services/firebase/firebase.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUsuarioResponse> {
    try {
      const usuario = await this.prismaService.usuario.create({
        data: createUserDto,
      });

      return {
        message: 'Usuario creado con exito!',
        usuario,
      };
    } catch (error) {
      if (error.code == 'P2002')
        throw new BadRequestException('El email ya existe!');

      throw new BadRequestException('No fue posible crear el usuario');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GetAllUsuarios> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const clause: Prisma.UsuarioFindManyArgs = {
      // where: {
      //   isActive: true,
      // },
      take: limit,
      skip: offset,
    };
    const countClause: Prisma.UsuarioCountArgs = {
      // where: {
      //   isActive: true,
      // },
    };

    if (paginationDto.search) {
      clause.where = {
        OR: [
          {
            nombre: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            email: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            rfc: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            direccion: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            telefono: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
        ],
      };
      countClause.where = {
        // isActive: true,
        OR: [
          {
            nombre: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            email: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            rfc: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            direccion: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            telefono: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
        ],
      };
    }

    const usuarios = await this.prismaService.usuario.findMany(clause);
    const count = await this.prismaService.usuario.count(countClause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Usuarios Activos',
      meta: {
        actualPage: page,
        totalCount: count,
        totalPages,
      },
      usuarios,
    };
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.prismaService.usuario.findFirst({
      where: {
        isActive: true,
        id,
      },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return usuario;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUsuarioResponse> {
    const usuario = await this.findOne(id);
    const { direccion, email, nombre, rfc, telefono } = updateUserDto;

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        isActive: true,
        id,
      },
      data: {
        direccion: direccion ?? usuario.direccion,
        email: email ?? usuario.email,
        nombre: nombre ?? usuario.nombre,
        rfc: rfc ?? usuario.rfc,
        telefono: telefono ?? usuario.telefono,
      },
    });

    return {
      message: 'Usuario actualizado con exito!',
      usuario: updatedUser,
    };
  }

  async remove(id: string): Promise<DeleteUsuarioResponse> {
    const usuario = await this.findOne(id);

    await this.prismaService.usuario.update({
      where: {
        isActive: true,
        id,
      },
      data: {
        isActive: false,
      },
    });

    return {
      message: 'Usuario eliminado con exito',
      usuario,
    };
  }

  async delete(id: string) {
    const usuario = await this.prismaService.usuario.findFirst({
      where: {
        id,
      },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    await this.prismaService.usuario.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Usuario eliminado con exito',
    };
  }

  async activate(id: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('El usuario no fue encontrado');

    await this.prismaService.usuario.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });

    return {
      message: 'Usuario activado con exito!',
    };
  }

  async generateQRUser(id: string) {
    const usuario = await this.findOne(id);

    const qrUser = JSON.stringify({
      nombre: usuario.nombre,
      rfc: usuario.rfc,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      email: usuario.email,
    });

    if (usuario.qr == false) {
      const url = await this.generateQR(qrUser);

      await this.prismaService.usuario.update({
        where: {
          isActive: true,
          id,
        },
        data: {
          qr: true,
          linkqr: url,
        },
      });
      await transport.sendMail(qrEmail(usuario.email, usuario.nombre, url));

      await this.firebaseService.sendNotificationToDevice(
        'eDc04R6VQiyqpMukel1W-V:APA91bE0OdyYamFxXXIGfUZwMUt9dw8fjm19lEW9s7mQNYk7J_s2LrT4f033NwMO4UT9kC794UyEKX2ZCj1YFXvCDbDtpWMg3sTAV4JTtL9zH6J5vYsXNss',
        `¡Codigo QR generado con exito  😊!`,
        'Tu codigo QR ha sido generado con exito, ahora puedes consultarlo desde la app 😎!',
        url,
      );

      console.log('NOTIFICACION PUSH ENVIADA');

      return {
        message:
          'El codigo QR fue generado con exito, se ha enviado al correo!',
      };
    } else {
      throw new BadRequestException(
        'El codigo QR ya fue solicitado y enviado al usuario',
      );
    }
  }

  private async generateQR(text: string) {
    try {
      console.log(await toDataURL(text), 'QR CODE GENERATE');

      const url = await toDataURL(text);
      return url;
    } catch (error) {
      console.log(error, 'QR ERROR');
      throw new BadRequestException('EL codigo QR no pudo ser generado');
    }
  }
}

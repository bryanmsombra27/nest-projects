import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { CreatePersonalResponse } from 'src/common/interfaces/CreateResponses';
import { compare, compareSync, genSalt, hash } from 'bcryptjs';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Personal, Prisma } from '@prisma/client';
import { GetAllPersonal } from 'src/common/interfaces/GetAllResponses';
import { FindPersonalResponse } from 'src/common/interfaces/FindOneResponses';
import { UpdatePersonalResponse } from 'src/common/interfaces/UpdateResponses';
import { DeletePersonalResponse } from 'src/common/interfaces/DeleteResponses';
import { EncodedPayloadToken } from 'src/common/interfaces/TokenUser';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ResetPasswordQueryParams,
  UpdatePersonalInternalPasswordDto,
} from './dto/passwordDto';
import { passwordEmail, qrEmail, transport } from 'src/common/helpers/qrEmail';
import { toDataURL } from 'qrcode';

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
        // isActive: true,
        rol: {
          name: {
            not: 'root',
          },
        },
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
        rol: {
          name: {
            not: 'root',
          },
        },
        // isActive: true,
      },
    };
    if (paginationDto.search) {
      const whereClause: Prisma.PersonalWhereInput = {
        OR: [
          {
            nombre: {
              contains: paginationDto.search.toLowerCase(),
            },
          },
          {
            email: { contains: paginationDto.search.toLowerCase() },
          },
          {
            telefono: { contains: paginationDto.search.toLowerCase() },
          },
        ],
        rol: {
          name: {
            not: 'root',
          },
        },
      };

      clause.where = whereClause;
      countClause.where = whereClause;
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
        nombre: updatePersonalDto.nombre ?? personal.nombre,
        telefono: updatePersonalDto.telefono ?? personal.telefono,
        rolId: updatePersonalDto.rolId ?? personal.rolId,
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
  async activate(id: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: {
        id,
      },
    });

    if (!personal) throw new NotFoundException('El personal no fue encontrado');

    await this.prismaService.personal.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });

    return {
      message: 'Personal activado con exito!',
    };
  }

  async changePassword(
    updatePersonalPassword: UpdatePersonalInternalPasswordDto,
    user: EncodedPayloadToken,
  ) {
    const personal = await this.prismaService.personal.findUnique({
      where: {
        isActive: true,
        id: user.id,
      },
    });
    if (!personal) throw new NotFoundException('Personal no encontrado');

    const { last_password, new_password, new_password_confirmation } =
      updatePersonalPassword;

    if (compareSync(last_password, personal.password)) {
      if (new_password === new_password_confirmation) {
        const newHasPassword = await hash(new_password, 10);

        await this.prismaService.personal.update({
          where: {
            isActive: true,
            id: user.id,
          },
          data: {
            password: newHasPassword,
          },
        });

        return {
          message: 'Contraseña actualizada con exito!',
        };
      } else {
        throw new BadRequestException('Las contraseñas no coinciden');
      }
    } else {
      throw new BadRequestException('No fue posible actualizar la contraseña');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const personal = await this.prismaService.personal.findUnique({
      where: {
        isActive: true,
        email,
      },
    });
    if (!personal) throw new NotFoundException('Personal no encontrado');

    const token = await this.prismaService.token.findUnique({
      where: {
        userId: personal.id,
      },
    });

    if (token) {
      await this.prismaService.token.delete({
        where: {
          userId: personal.id,
        },
      });
    }

    const resetToken = await hash('koso', 10);
    const compareHash = await hash(resetToken, 10);

    await this.prismaService.token.create({
      data: {
        userId: personal.id,
        token: compareHash,
      },
    });
    const link = `${process.env.FRONTEND_HOST}/reset-password?token=${resetToken}&id=${personal.id}`;

    console.log(link, 'LINK DEL RESET EMAIL');

    await transport.sendMail(passwordEmail(email, link));

    return {
      message: 'Correo enviado exitosamente!',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    params: ResetPasswordQueryParams,
  ) {
    const { id, token } = params;
    const { new_password, new_password_confirmation } = resetPasswordDto;

    const personal = await this.prismaService.personal.findUnique({
      where: {
        isActive: true,
        id,
      },
    });
    if (!personal) throw new NotFoundException('Personal no encontrado');

    const passwordTokenReset = await this.prismaService.token.findUnique({
      where: {
        userId: personal.id,
      },
    });

    if (!passwordTokenReset) throw new NotFoundException('Token invalido');

    const isValid = await compare(token, passwordTokenReset.token);

    if (!isValid) {
      throw new BadRequestException('Token no coincide');
    } else {
      if (new_password === new_password_confirmation) {
        const hashNewPassword = await hash(new_password, 10);
        await this.prismaService.personal.update({
          where: {
            id: personal.id,
            isActive: true,
          },
          data: {
            password: hashNewPassword,
          },
        });

        await this.prismaService.token.delete({
          where: {
            id: passwordTokenReset.id,
          },
        });

        return {
          message: 'Contraseña actualizada con exito!',
        };
      } else {
        throw new BadRequestException(
          'No fue posible actualizar la contraseña',
        );
      }
    }
  }

  async sendQRForLogin(id: string) {
    const user = await this.findOne(id);

    const url = await this.generateQR(id);

    await transport.sendMail(qrEmail(user.email, user.nombre, url));
    return {
      message: 'El codigo QR fue generado con exito, se ha enviado al correo!',
    };
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

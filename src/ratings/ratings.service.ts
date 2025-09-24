import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRatingDto: CreateRatingDto, user: any) {
    if (!user) {
      throw new UnauthorizedException(
        'Debe estar logueado para calificar esta gasolinera',
      );
    }

    const { comments, place_id, rating } = createRatingDto;

    const comment = await this.prismaService.commentRating.upsert({
      create: {
        rating,
        userId: user.id,
        comment: comments,
        gasStationId: place_id,
      },
      update: {
        rating,
        comment: comments,
      },

      where: {
        userId_gasStationId: {
          gasStationId: place_id,
          userId: user.id,
        },
      },
    });

    if (!comment) {
      throw new BadRequestException(
        'No fue posible crear la calificacion para la gasolinera',
      );
    }

    return {
      message: 'Comentarios agregados con exito!',
      comment,
    };
  }

  async findAll() {
    const stations = await this.prismaService.$queryRawUnsafe(`
 SELECT 
    p."name",
    p."place_id",
    pr."regular",
    pr."premium",
    pr."diesel",
    AVG(c."rating") AS avg_rating
  FROM "Place" p
  JOIN "CommentRating" c 
    ON p."place_id" = c."gasStationId"
  LEFT JOIN "Price" pr 
    ON p."place_id" = pr."place_id"
  GROUP BY p."id", p."name", pr."regular", pr."premium", pr."diesel"
  ORDER BY avg_rating DESC
  LIMIT 10
    `);

    return {
      stations,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }

  async getComment(gas_station_id: string, user: any) {
    const comment = await this.prismaService.commentRating.findFirst({
      where: {
        userId: user.id,
        gasStationId: gas_station_id,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        'El comentario  no existe  o no fue hecho por el usuario',
      );
    }

    return {
      comment,
    };
  }
}

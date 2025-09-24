import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
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
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }

  async findByLocation(coords: CreateLocationDto) {
    const userLat = coords.location[0]; // > 55.
    const userLng = coords.location[1]; // -99.

    // console.log(user.idLat, userLng, 'UBICACION INICIAL');

    const places = await this.prismaService.$queryRawUnsafe(`
  SELECT 
      "Place".id AS place_id,
  "Place".name,
  "Place".cre_id,
  "Place".latitude,
  "Place".longitude,
  "Price".id AS price_id,
  "Price".place_id AS price_place_id,
  "Price".regular,
  "Price".premium,
  "Price".diesel,
    (
      6371 * acos(
        cos(radians(${userLat})) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${userLng})) + 
        sin(radians(${userLat})) * sin(radians(latitude))
      )
    ) AS distance
  FROM "Place"
  LEFT JOIN "Price" ON "Place".place_id = "Price".place_id
  ORDER BY distance
  LIMIT 10;
`);

    return {
      places,
      message: 'Lugares encontrados',
    };
  }
}

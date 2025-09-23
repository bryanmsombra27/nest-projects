import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';
import {
  arregloFiltradoPorLugarAcapulco,
  unionDeArregloLugarYPrecio,
} from 'src/common/helpers/filter_place_and_price';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
const options = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
};
const parser = new XMLParser(options);

@Injectable()
export class ZonesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createZoneDto: CreateZoneDto) {
    return 'This action adds a new zone';
  }

  async findAll(paginationDto: PaginationDto) {
    const page = paginationDto?.page ?? 1;
    const limit = 10;
    const offset = (+page - 1) * limit;

    const gas_stations = await this.prismaService.place.findMany({
      include: {
        prices: true,
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prismaService.place.count();

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      gas_stations,
      count,
      totalPages,
      page,
    };
  }

  async findOne(zona: string) {
    let arregloFiltradoPorZona = [];

    let registrosEnUnaSolaFila = [];

    try {
      // const data = fs.readFileSync(path.join(__dirname, '../data/places.xml'), {
      const data = fs.readFileSync(
        path.join(__dirname, '../../data/places.xml'),
        {
          encoding: 'utf8',
        },
      );
      const data2 = fs.readFileSync(
        path.join(__dirname, '../../data/prices.xml'),
        { encoding: 'utf8' },
      );
      const lugaresXML = parser.parse(data);
      const preciosXML = parser.parse(data2);

      const lugar = arregloFiltradoPorLugarAcapulco(lugaresXML);
      const precio = arregloFiltradoPorLugarAcapulco(preciosXML);

      const arregloDefinitivo = unionDeArregloLugarYPrecio(lugar, precio);

      switch (zona) {
        //registro repetido original 6
        case 'magallanes':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 4337 ||
              gasolinera.cre_id.split('/')[1] == 3081 ||
              gasolinera.cre_id.split('/')[1] == 1162 ||
              gasolinera.cre_id.split('/')[1] == 3901 ||
              gasolinera.cre_id.split('/')[1] == 9356 ||
              gasolinera.cre_id.split('/')[1] == 23041,
          );

          //  arregloFiltradoPorZona = registrosEnUnaSolaFila;
          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        //registro repetido original 5
        case 'coyuca':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 4263 ||
              gasolinera.cre_id.split('/')[1] == 12908 ||
              gasolinera.cre_id.split('/')[1] == 6980 ||
              gasolinera.cre_id.split('/')[1] == 1180 ||
              gasolinera.cre_id.split('/')[1] == 13644,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        //registro repetido  original 7
        case 'diamante':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 9012 ||
              gasolinera.cre_id.split('/')[1] == 8699 ||
              gasolinera.cre_id.split('/')[1] == 12837 ||
              gasolinera.cre_id.split('/')[1] == 8664 ||
              gasolinera.cre_id.split('/')[1] == 9016 ||
              gasolinera.cre_id.split('/')[1] == 4328 ||
              gasolinera.cre_id.split('/')[1] == 4352,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        //registro repetido  original 6
        case 'llano':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 4289 ||
              gasolinera.cre_id.split('/')[1] == 5985 ||
              gasolinera.cre_id.split('/')[1] == 6888 ||
              gasolinera.cre_id.split('/')[1] == 4765 ||
              gasolinera.cre_id.split('/')[1] == 20920 ||
              gasolinera.cre_id.split('/')[1] == 22162,
          );

          //logica de un solo registro cuando se repite 2 veces
          //===============================================================
          arregloFiltradoPorZona = registrosEnUnaSolaFila;
          //==========================================================
          break;

        //registro repetido  original 13
        case 'chilpo':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 19736 ||
              gasolinera.cre_id.split('/')[1] == 1633 ||
              gasolinera.cre_id.split('/')[1] == 1638 ||
              gasolinera.cre_id.split('/')[1] == 8229 ||
              gasolinera.cre_id.split('/')[1] == 10726 ||
              gasolinera.cre_id.split('/')[1] == 6887 ||
              gasolinera.cre_id.split('/')[1] == 20003 ||
              gasolinera.cre_id.split('/')[1] == 22049 ||
              gasolinera.cre_id.split('/')[1] == 8327 ||
              gasolinera.cre_id.split('/')[1] == 6059 ||
              gasolinera.cre_id.split('/')[1] == 4349 ||
              gasolinera.cre_id.split('/')[1] == 4377 ||
              gasolinera.cre_id.split('/')[1] == 19221,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        //registro repetido  original 8
        case 'rena':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 4332 ||
              gasolinera.cre_id.split('/')[1] == 2942 ||
              gasolinera.cre_id.split('/')[1] == 9588 ||
              gasolinera.cre_id.split('/')[1] == 1192 ||
              gasolinera.cre_id.split('/')[1] == 1190 ||
              gasolinera.cre_id.split('/')[1] == 4326 ||
              gasolinera.cre_id.split('/')[1] == 4323 ||
              gasolinera.cre_id.split('/')[1] == 4351,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;
        //original 3
        case 'muller':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 6409 ||
              gasolinera.cre_id.split('/')[1] == 13058 ||
              gasolinera.cre_id.split('/')[1] == 4287,
          );
          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;
        //registro repetido  original 9
        case 'servifer':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 4317 ||
              gasolinera.cre_id.split('/')[1] == 4770 ||
              gasolinera.cre_id.split('/')[1] == 3644 ||
              gasolinera.cre_id.split('/')[1] == 7528 ||
              gasolinera.cre_id.split('/')[1] == 6832 ||
              gasolinera.cre_id.split('/')[1] == 7793 ||
              gasolinera.cre_id.split('/')[1] == 4311 ||
              gasolinera.cre_id.split('/')[1] == 4293 ||
              gasolinera.cre_id.split('/')[1] == 13086,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        //registro repetido  original 9
        case 'cruz-grande':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 22575 ||
              gasolinera.cre_id.split('/')[1] == 4341 ||
              gasolinera.cre_id.split('/')[1] == 21109 ||
              gasolinera.cre_id.split('/')[1] == 8438 ||
              gasolinera.cre_id.split('/')[1] == 8441 ||
              gasolinera.cre_id.split('/')[1] == 8424 ||
              gasolinera.cre_id.split('/')[1] == 4577 ||
              gasolinera.cre_id.split('/')[1] == 4574 ||
              gasolinera.cre_id.split('/')[1] == 8420,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        //registro repetido  original 11
        case 'ejido-modelo':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 11270 ||
              gasolinera.cre_id.split('/')[1] == 1206 ||
              gasolinera.cre_id.split('/')[1] == 1535 ||
              gasolinera.cre_id.split('/')[1] == 10951 ||
              gasolinera.cre_id.split('/')[1] == 22646 ||
              gasolinera.cre_id.split('/')[1] == 5537 ||
              gasolinera.cre_id.split('/')[1] == 1453 ||
              gasolinera.cre_id.split('/')[1] == 1087 ||
              gasolinera.cre_id.split('/')[1] == 4334 ||
              gasolinera.cre_id.split('/')[1] == 6355 ||
              gasolinera.cre_id.split('/')[1] == 6285,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        // original 6
        case 'costera-diana':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.cre_id.split('/')[1] == 4339 ||
              gasolinera.cre_id.split('/')[1] == 1151 ||
              gasolinera.cre_id.split('/')[1] == 10950 ||
              gasolinera.cre_id.split('/')[1] == 9019 ||
              gasolinera.cre_id.split('/')[1] == 19967 ||
              gasolinera.cre_id.split('/')[1] == 4353,
          );

          arregloFiltradoPorZona = registrosEnUnaSolaFila;

          break;

        default:
          throw new NotFoundException('La zona no existe');
      }

      return {
        status: 'success',
        precios: arregloFiltradoPorZona,
        cantidad: arregloFiltradoPorZona.length,
      };
    } catch (e) {
      console.log(e, 'ENCONTRAR ZONAS');
      throw new BadRequestException(
        'No fue posible cargar las gaseras de la zona',
      );
    }
  }

  update(id: number, updateZoneDto: UpdateZoneDto) {
    return `This action updates a #${id} zone`;
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}

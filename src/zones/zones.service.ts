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
import { reporteXML } from 'src/common/helpers/writeFileXML';
import { arregloFinal } from 'src/common/helpers/registroZona';
import { arregloFiltradoPorLugarAcapulco } from 'src/common/helpers/filter_place_and_price';
const options = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
};
const parser = new XMLParser(options);

@Injectable()
export class ZonesService {
  create(createZoneDto: CreateZoneDto) {
    return 'This action adds a new zone';
  }

  findAll() {
    return `This action returns all zones`;
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

      console.log(lugaresXML.places.place, 'LUGARES XML ');
      console.log(preciosXML.places.place, 'PRECIOS XML ');

      const lugar = arregloFiltradoPorLugarAcapulco(lugaresXML);
      const precio = arregloFiltradoPorLugarAcapulco(preciosXML);

      const precioyLugar = precio.filter((precio) => {
        const Gasolinera = lugar.find(
          (lugar) => lugar['@_place_id'] == precio['@_place_id'],
        );
        precio.lugar = Gasolinera;

        return precio;
      });

      const arregloDefinitivo = precioyLugar.filter((precio) => {
        if (
          precio['gas_price'][0] &&
          precio['gas_price'][1] &&
          precio['gas_price'][2]
        ) {
          precio.type = {
            [precio['gas_price'][0]['@_type']]: {
              name: precio['gas_price'][0]['@_type'],
              price: precio['gas_price'][0]['#text'],
            },
            [precio['gas_price'][1]['@_type']]: {
              name: precio['gas_price'][1]['@_type'],
              price: precio['gas_price'][1]['#text'],
            },
            [precio['gas_price'][2]['@_type']]: {
              name: precio['gas_price'][2]['@_type'],
              price: precio['gas_price'][2]['#text'],
            },
          };
        } else if (precio['gas_price'][0] && precio['gas_price'][1]) {
          precio.type = {
            [precio['gas_price'][0]['@_type']]: {
              name: precio['gas_price'][0]['@_type'],
              price: precio['gas_price'][0]['#text'],
            },
            [precio['gas_price'][1]['@_type']]: {
              name: precio['gas_price'][1]['@_type'],
              price: precio['gas_price'][1]['#text'],
            },
          };
        } else if (precio['gas_price'][0]) {
          precio.type = {
            [precio['gas_price'][0]['@_type']]: {
              name: precio['gas_price'][0]['@_type'],
              price: precio['gas_price'][0]['#text'],
            },
          };
        } else {
          precio.type = {
            [precio['gas_price']['@_type']]: {
              name: precio['gas_price']['@_type'],
              price: precio['gas_price']['#text'],
            },
          };
        }

        return precio;
      });

      switch (zona) {
        //registro repetido original 6
        case 'magallanes':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 4337 ||
              gasolinera.lugar.cre_id.split('/')[1] == 3081 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1162 ||
              gasolinera.lugar.cre_id.split('/')[1] == 3901 ||
              gasolinera.lugar.cre_id.split('/')[1] == 9356 ||
              gasolinera.lugar.cre_id.split('/')[1] == 23041,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        //registro repetido original 5
        case 'coyuca':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 4263 ||
              gasolinera.lugar.cre_id.split('/')[1] == 12908 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6980 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1180 ||
              gasolinera.lugar.cre_id.split('/')[1] == 13644,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        //registro repetido  original 7
        case 'diamante':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 9012 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8699 ||
              gasolinera.lugar.cre_id.split('/')[1] == 12837 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8664 ||
              gasolinera.lugar.cre_id.split('/')[1] == 9016 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4328 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4352,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        //registro repetido  original 6
        case 'llano':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 4289 ||
              gasolinera.lugar.cre_id.split('/')[1] == 5985 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6888 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4765 ||
              gasolinera.lugar.cre_id.split('/')[1] == 20920 ||
              gasolinera.lugar.cre_id.split('/')[1] == 22162,
          );

          //logica de un solo registro cuando se repite 2 veces
          //===============================================================
          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);
          //==========================================================
          break;

        //registro repetido  original 13
        case 'chilpo':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 19736 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1633 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1638 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8229 ||
              gasolinera.lugar.cre_id.split('/')[1] == 10726 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6887 ||
              gasolinera.lugar.cre_id.split('/')[1] == 20003 ||
              gasolinera.lugar.cre_id.split('/')[1] == 22049 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8327 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6059 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4349 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4377 ||
              gasolinera.lugar.cre_id.split('/')[1] == 19221,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        //registro repetido  original 8
        case 'rena':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 4332 ||
              gasolinera.lugar.cre_id.split('/')[1] == 2942 ||
              gasolinera.lugar.cre_id.split('/')[1] == 9588 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1192 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1190 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4326 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4323 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4351,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;
        //original 3
        case 'muller':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 6409 ||
              gasolinera.lugar.cre_id.split('/')[1] == 13058 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4287,
          );
          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;
        //registro repetido  original 9
        case 'servifer':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 4317 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4770 ||
              gasolinera.lugar.cre_id.split('/')[1] == 3644 ||
              gasolinera.lugar.cre_id.split('/')[1] == 7528 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6832 ||
              gasolinera.lugar.cre_id.split('/')[1] == 7793 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4311 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4293 ||
              gasolinera.lugar.cre_id.split('/')[1] == 13086,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        //registro repetido  original 9
        case 'cruz-grande':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 22575 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4341 ||
              gasolinera.lugar.cre_id.split('/')[1] == 21109 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8438 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8441 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8424 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4577 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4574 ||
              gasolinera.lugar.cre_id.split('/')[1] == 8420,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        //registro repetido  original 11
        case 'ejido-modelo':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 11270 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1206 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1535 ||
              gasolinera.lugar.cre_id.split('/')[1] == 10951 ||
              gasolinera.lugar.cre_id.split('/')[1] == 22646 ||
              gasolinera.lugar.cre_id.split('/')[1] == 5537 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1453 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1087 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4334 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6355 ||
              gasolinera.lugar.cre_id.split('/')[1] == 6285,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

          break;

        // original 6
        case 'costera-diana':
          registrosEnUnaSolaFila = arregloDefinitivo.filter(
            (gasolinera) =>
              gasolinera.lugar.cre_id.split('/')[1] == 4339 ||
              gasolinera.lugar.cre_id.split('/')[1] == 1151 ||
              gasolinera.lugar.cre_id.split('/')[1] == 10950 ||
              gasolinera.lugar.cre_id.split('/')[1] == 9019 ||
              gasolinera.lugar.cre_id.split('/')[1] == 19967 ||
              gasolinera.lugar.cre_id.split('/')[1] == 4353,
          );

          arregloFiltradoPorZona = arregloFinal(registrosEnUnaSolaFila);

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

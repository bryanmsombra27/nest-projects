import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { Place, PrismaClient } from '../../../generated/prisma';
import { XMLParser } from 'fast-xml-parser';
import * as _ from 'lodash';
import { unionDeArregloLugarYPrecio } from './filter_place_and_price';
const options = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
};
const parser = new XMLParser(options);

/**
 *
 * @param resource recurso a utilizar, solo puede haber 2, places y prices.
 * @description Helper encargado de generar el XML para su correcta lectura.
 */
const reporteXML = (resource, resource2) => {
  try {
    console.log('OBTENIENDO REPORTES');

    ensureFolderExists(path.join(__dirname, '../../../data'));

    const file = fs.createWriteStream(
      path.join(__dirname, `../../../data/${resource}.xml`),
    );
    const file2 = fs.createWriteStream(
      path.join(__dirname, `../../../data/${resource2}.xml`),
    );

    const request = https.get(
      `https://publicacionexterna.azurewebsites.net/publicaciones/${resource}`,
      (response) => {
        response.pipe(file);
      },
    );
    const request2 = https.get(
      `https://publicacionexterna.azurewebsites.net/publicaciones/${resource2}`,
      (response) => {
        response.pipe(file2);
      },
    );

    console.log('ARCHIVOS GENERADOS CON EXITO');

    saveInDB();
  } catch (error) {
    console.log(error, 'ERROR GENERANDO LOS ARCHIVOS DE CONSULTA');
  }
};

function ensureFolderExists(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // recursive: true crea subcarpetas si es necesario
    console.log(`📁 Carpeta creada en: ${folderPath}`);
  } else {
    console.log(`✅ Carpeta ya existe: ${folderPath}`);
  }
}

const saveInDB = async () => {
  console.time('TIEMPO_TOTAL');
  try {
    const prismaClient = new PrismaClient();
    await prismaClient.$connect();

    const places = await prismaClient.place.findMany({ take: 10 });

    const placesXML = fs.readFileSync(
      path.join(__dirname, '../../../data/places.xml'),
      {
        encoding: 'utf8',
      },
    );
    const placeData = parser.parse(placesXML);
    const lugares = placeData.places.place;
    // CARGANDO LUGARES A DB
    if (places.length == 0) {
      const lugaresDB = [];

      for (const lugar of placeData.places.place) {
        lugaresDB.push({
          cre_id: lugar.cre_id,
          location: [String(lugar.location.x), String(lugar.location.y)],
          name: lugar.name,
          place_id: String(lugar['@_place_id']),
        });
      }
      await prismaClient.place.createMany({
        data: lugaresDB,
      });

      console.log('LUGARES CARGADOS EN DB');
    }
    const pricesXML = fs.readFileSync(
      path.join(__dirname, '../../../data/prices.xml'),
      {
        encoding: 'utf8',
      },
    );

    const pricesData = parser.parse(pricesXML);
    const prices = pricesData.places.place;

    const groupByPlaceIdPricing = unionDeArregloLugarYPrecio(lugares, prices);

    const pricesFromDB = await prismaClient.price.findMany();

    for (const item of groupByPlaceIdPricing) {
      const priceFound = pricesFromDB.find(
        (price) => price.place_id == String(item['@_place_id']),
      );

      await prismaClient.price.upsert({
        where: {
          place_id: String(item['@_place_id']),
          id: priceFound?.id ?? '',
        },
        update: {
          diesel: item.type?.diesel ?? null,
          premium: item.type?.premium ?? null,
          regular: item.type?.regular ?? null,
        },
        create: {
          place_id: String(item['@_place_id']),
          diesel: item.type?.diesel ?? null,
          premium: item.type?.premium ?? null,
          regular: item.type?.regular ?? null,
        },
      });
    }

    await prismaClient.$disconnect();
    console.log('DATOS CARGADOS EN DB Y DESCONNECION EXITOSA ');
    console.timeEnd('TIEMPO_TOTAL');
  } catch (error) {
    console.log(error, 'ERROR AL CARGAR EN DB');
  }
};

export { reporteXML, saveInDB };

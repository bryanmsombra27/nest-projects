import * as _ from 'lodash';

/**
 *
 * @param p Es el archivo utilizado para leer el XML
 * @returns En base al archivo utilizado, retorna un arreglo de lugares.
 */
const lugaresIds = [
  6564, 11028, 2869, 7347, 10500, 26774, 5799, 14500, 8241, 3014, 20864, 9991,
  9317, 14432, 9476, 9936, 6788, 6797,
  // 5460,
  8396, 7179, 24079, 6594, 10843, 10704, 2773, 2972, 8197, 15659, 6490, 6670,
  6718, 8740, 8438, 8831, 6847, 26329, 5961, 24272, 9488, 9829, 9862, 7144,
  6643, 9539, 13411, 2876, 3305, 13090, 26416, 5358, 2669, 2798, 22451, 6820,
  8504, 25805, 6438, 3157, 13089, 10145, 22150, 3447, 3494, 9763, 12972, 8499,
  22482, 25679, 9367, 5020, 5773, 7278, 21536, 6559, 6787, 6260, 6739, 6757,
  7357, 6241, 15684, 7888,
];

const arregloFiltradoPorLugarAcapulco = (p) => {
  // console.log(
  //   p.places.place.find((e) => e['@_place_id'] == 26774),
  //   'GASOLINERA  XML ?====',
  // );

  return p.places.place.filter((place) =>
    lugaresIds.includes(place['@_place_id']),
  );
};

const unionDeArregloLugarYPrecio = (lugar, precio) => {
  let mergedArrays = [];
  const groupByPlaceIdPricing = _.groupBy(precio, '@_place_id');

  for (const item in groupByPlaceIdPricing) {
    const placeFound = lugar.find((e) => e['@_place_id'] == item);
    const priceFound = groupByPlaceIdPricing[item];
    // console.log(priceFound, 'precios de gasolina =======');

    if (placeFound && priceFound) {
      let priceFormatObject: any = {};

      priceFound.forEach((price) => {
        if (price.gas_price.length > 0) {
          price.gas_price.forEach((gasPrice) => {
            priceFormatObject.type = {
              ...priceFormatObject.type,
              [gasPrice['@_type']]: gasPrice['#text'],
            };
          });
        } else {
          priceFormatObject.type = {
            ...priceFormatObject.type,
            [price['gas_price']['@_type']]: price['gas_price']['#text'],
          };
        }
      });

      mergedArrays.push({
        ...placeFound,
        ...priceFormatObject,
      });
    }
  }

  // console.log(mergedArrays, 'MERGED ARRAYS');

  return mergedArrays;
};

export { arregloFiltradoPorLugarAcapulco, unionDeArregloLugarYPrecio };

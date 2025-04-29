/**
 *
 * @param p Es el archivo utilizado para leer el XML
 * @returns En base al archivo utilizado, retorna un arreglo de lugares.
 */
const lugaresIds = [
  6564, 11028, 2869, 7347, 10500, 26774, 5799, 14500, 8241, 3014, 20864, 9991,
  9317, 14432, 9476, 9936, 6788, 6797, 5460, 8396, 7179, 24079, 6594, 10843,
  10704, 2773, 2972, 8197, 15659, 6490, 6670, 6718, 8740, 8438, 8831, 6847,
  26329, 5961, 24272, 9488, 9829, 9862, 7144, 6643, 9539, 13411, 2876, 3305,
  13090, 26416, 5358, 2669, 2798, 22451, 6820, 8504, 25805, 6438, 3157, 13089,
  10145, 22150, 3447, 3494, 9763, 12972, 8499, 22482, 25679, 9367, 5020, 5773,
  7278, 21536, 6559, 6787, 6260, 6739, 6757, 7357, 6241, 15684, 7888,
];

const arregloFiltradoPorLugarAcapulco = (p) => {
  let arreglo = [];
  return (arreglo = p.places.place.filter(
    (place) =>
      place['@_place_id'] == 6564 ||
      place['@_place_id'] == 11028 ||
      place['@_place_id'] == 2869 ||
      place['@_place_id'] == 7347 ||
      place['@_place_id'] == 10500 ||
      place['@_place_id'] == 26774 ||
      place['@_place_id'] == 5799 ||
      place['@_place_id'] == 14500 ||
      place['@_place_id'] == 8241 ||
      place['@_place_id'] == 3014 ||
      place['@_place_id'] == 20864 ||
      place['@_place_id'] == 9991 ||
      place['@_place_id'] == 9317 ||
      place['@_place_id'] == 14432 ||
      place['@_place_id'] == 9476 ||
      place['@_place_id'] == 9936 ||
      place['@_place_id'] == 6788 ||
      place['@_place_id'] == 6797 ||
      place['@_place_id'] == 5460 ||
      place['@_place_id'] == 8396 ||
      place['@_place_id'] == 7179 ||
      place['@_place_id'] == 24079 ||
      place['@_place_id'] == 6594 ||
      place['@_place_id'] == 10843 ||
      place['@_place_id'] == 10704 ||
      place['@_place_id'] == 2773 ||
      place['@_place_id'] == 2972 ||
      place['@_place_id'] == 8197 ||
      place['@_place_id'] == 15659 ||
      place['@_place_id'] == 6490 ||
      place['@_place_id'] == 6670 ||
      place['@_place_id'] == 6718 ||
      place['@_place_id'] == 8740 ||
      place['@_place_id'] == 8438 ||
      place['@_place_id'] == 8831 ||
      place['@_place_id'] == 6847 ||
      place['@_place_id'] == 26329 ||
      place['@_place_id'] == 5961 ||
      place['@_place_id'] == 24272 ||
      place['@_place_id'] == 9488 ||
      place['@_place_id'] == 9829 ||
      place['@_place_id'] == 9862 ||
      place['@_place_id'] == 7144 ||
      place['@_place_id'] == 6643 ||
      place['@_place_id'] == 9539 ||
      place['@_place_id'] == 13411 ||
      place['@_place_id'] == 2876 ||
      place['@_place_id'] == 3305 ||
      place['@_place_id'] == 13090 ||
      place['@_place_id'] == 26416 ||
      place['@_place_id'] == 5358 ||
      place['@_place_id'] == 2669 ||
      place['@_place_id'] == 2798 ||
      place['@_place_id'] == 22451 ||
      place['@_place_id'] == 6820 ||
      place['@_place_id'] == 8504 ||
      place['@_place_id'] == 25805 ||
      place['@_place_id'] == 6438 ||
      place['@_place_id'] == 3157 ||
      place['@_place_id'] == 13089 ||
      place['@_place_id'] == 10145 ||
      place['@_place_id'] == 22150 ||
      place['@_place_id'] == 3447 ||
      place['@_place_id'] == 3494 ||
      place['@_place_id'] == 9763 ||
      place['@_place_id'] == 12972 ||
      place['@_place_id'] == 8499 ||
      place['@_place_id'] == 22482 ||
      place['@_place_id'] == 25679 ||
      place['@_place_id'] == 9367 ||
      place['@_place_id'] == 5020 ||
      place['@_place_id'] == 5773 ||
      place['@_place_id'] == 7278 ||
      place['@_place_id'] == 21536 ||
      place['@_place_id'] == 6559 ||
      place['@_place_id'] == 6787 ||
      place['@_place_id'] == 6260 ||
      place['@_place_id'] == 6739 ||
      place['@_place_id'] == 6757 ||
      place['@_place_id'] == 7357 ||
      place['@_place_id'] == 6241 ||
      place['@_place_id'] == 15684 ||
      place['@_place_id'] == 7888,
  ));
};
/**
 *
 * @param p Es el archivo utilizado para leer el XML
 * @returns En base al archivo utilizado, retorna un arreglo de Precios.
 */
const arregloFiltradoPorPrecioAcapulco = (p) => {
  let arreglo = [];

  return (arreglo = p.places.place.filter(
    (precio) =>
      precio['@_place_id'] == 6564 ||
      precio['@_place_id'] == 11028 ||
      precio['@_place_id'] == 2869 ||
      precio['@_place_id'] == 7347 ||
      precio['@_place_id'] == 10500 ||
      precio['@_place_id'] == 26774 ||
      precio['@_place_id'] == 5799 ||
      precio['@_place_id'] == 14500 ||
      precio['@_place_id'] == 8241 ||
      precio['@_place_id'] == 3014 ||
      precio['@_place_id'] == 20864 ||
      precio['@_place_id'] == 9991 ||
      precio['@_place_id'] == 9317 ||
      precio['@_place_id'] == 14432 ||
      precio['@_place_id'] == 9476 ||
      precio['@_place_id'] == 9936 ||
      precio['@_place_id'] == 6788 ||
      precio['@_place_id'] == 6797 ||
      precio['@_place_id'] == 5460 ||
      precio['@_place_id'] == 8396 ||
      precio['@_place_id'] == 7179 ||
      precio['@_place_id'] == 24079 ||
      precio['@_place_id'] == 6594 ||
      precio['@_place_id'] == 10843 ||
      precio['@_place_id'] == 10704 ||
      precio['@_place_id'] == 2773 ||
      precio['@_place_id'] == 2972 ||
      precio['@_place_id'] == 8197 ||
      precio['@_place_id'] == 15659 ||
      precio['@_place_id'] == 6490 ||
      precio['@_place_id'] == 6670 ||
      precio['@_place_id'] == 6718 ||
      precio['@_place_id'] == 8740 ||
      precio['@_place_id'] == 8438 ||
      precio['@_place_id'] == 8831 ||
      precio['@_place_id'] == 6847 ||
      precio['@_place_id'] == 26329 ||
      precio['@_place_id'] == 5961 ||
      precio['@_place_id'] == 24272 ||
      precio['@_place_id'] == 9488 ||
      precio['@_place_id'] == 9829 ||
      precio['@_place_id'] == 9862 ||
      precio['@_place_id'] == 7144 ||
      precio['@_place_id'] == 6643 ||
      precio['@_place_id'] == 9539 ||
      precio['@_place_id'] == 13411 ||
      precio['@_place_id'] == 2876 ||
      precio['@_place_id'] == 3305 ||
      precio['@_place_id'] == 13090 ||
      precio['@_place_id'] == 26416 ||
      precio['@_place_id'] == 5358 ||
      precio['@_place_id'] == 2669 ||
      precio['@_place_id'] == 2798 ||
      precio['@_place_id'] == 22451 ||
      precio['@_place_id'] == 6820 ||
      precio['@_place_id'] == 8504 ||
      precio['@_place_id'] == 25805 ||
      precio['@_place_id'] == 6438 ||
      precio['@_place_id'] == 3157 ||
      precio['@_place_id'] == 13089 ||
      precio['@_place_id'] == 10145 ||
      precio['@_place_id'] == 22150 ||
      precio['@_place_id'] == 3447 ||
      precio['@_place_id'] == 3494 ||
      precio['@_place_id'] == 9763 ||
      precio['@_place_id'] == 12972 ||
      precio['@_place_id'] == 8499 ||
      precio['@_place_id'] == 22482 ||
      precio['@_place_id'] == 25679 ||
      precio['@_place_id'] == 9367 ||
      precio['@_place_id'] == 5020 ||
      precio['@_place_id'] == 5773 ||
      precio['@_place_id'] == 7278 ||
      precio['@_place_id'] == 21536 ||
      precio['@_place_id'] == 6559 ||
      precio['@_place_id'] == 6787 ||
      precio['@_place_id'] == 6260 ||
      precio['@_place_id'] == 6739 ||
      precio['@_place_id'] == 6757 ||
      precio['@_place_id'] == 7357 ||
      precio['@_place_id'] == 6241 ||
      precio['@_place_id'] == 15684 ||
      precio['@_place_id'] == 7888,
  ));
};

export { arregloFiltradoPorLugarAcapulco, arregloFiltradoPorPrecioAcapulco };

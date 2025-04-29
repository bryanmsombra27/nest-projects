import { registroEnUnaSolaFilaDinamico } from './registroEnUnaFilaDinamico';

let arregloMapeadoConValoresNulos = [];
let eliminandoDuplicados = [];

const arregloFinal = (registrosEnUnaSolaFila) => {
  arregloMapeadoConValoresNulos = registrosEnUnaSolaFila.map(
    (gasolinera, i, arreglo) => {
      if (i < registrosEnUnaSolaFila.length - 1) {
        const registro = registroEnUnaSolaFilaDinamico(gasolinera, i, arreglo);
        return registro;
      } else {
        return gasolinera;
      }
    },
  );
  //quitando los valores nulos del arreglo
  eliminandoDuplicados = arregloMapeadoConValoresNulos
    .filter((gasolinera) => gasolinera !== undefined)
    .reverse()
    .filter((gasolinera, i, arreglo) => {
      if (i < arreglo.length - 1) {
        if (
          gasolinera.lugar.cre_id.split('/')[1] !=
          arreglo[i + 1].lugar.cre_id.split('/')[1]
        ) {
          return gasolinera;
        }
      } else {
        return gasolinera;
      }
    });
  return eliminandoDuplicados;
};

export { arregloFinal };

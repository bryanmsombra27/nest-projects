const registroEnUnaSolaFilaDinamico = (registro, i, arreglo) => {
  const arregloDeUnSoloElemento = arreglo.filter(
    (valor) =>
      valor.lugar.cre_id.split('/')[1] == registro.lugar.cre_id.split('/')[1],
  );

  if (arregloDeUnSoloElemento.length == 1) {
    return registro;
  }

  if (registro['@_place_id'] == arreglo[i + 1]['@_place_id']) {
    if (registro.type.regular) {
      const tercerRegistro = arreglo[i + 2]
        ? arreglo[i + 2]['@_place_id']
        : false;

      //validacion 3 registros
      if (
        registro['@_place_id'] == arreglo[i + 1]['@_place_id'] &&
        registro['@_place_id'] == tercerRegistro
      ) {
        if (arreglo[i + 2].type.premium && arreglo[i + 1].type.diesel) {
          registro.type.premium = {
            ...arreglo[i + 2].type.premium,
          };
          registro.type.diesel = {
            ...arreglo[i + 1].type.diesel,
          };
        } else if (arreglo[i + 2].type.premium) {
          registro.type.premium = {
            ...arreglo[i + 2].type.premium,
          };
        } else if (arreglo[i + 2].type.diesel) {
          registro.type.diesel = {
            ...arreglo[i + 2].type.diesel,
          };
        }
      }

      if (arreglo[i + 1].type.premium && arreglo[i + 1].type.diesel) {
        registro.type.premium = {
          ...arreglo[i + 1].type.premium,
        };
        registro.type.diesel = {
          ...arreglo[i + 1].type.diesel,
        };
      } else if (arreglo[i + 1].type.diesel) {
        registro.type.diesel = {
          ...arreglo[i + 1].type.diesel,
        };
      } else if (arreglo[i + 1].type.premium) {
        registro.type.premium = {
          ...arreglo[i + 1].type.premium,
        };
      }
    } else if (registro.type.diesel) {
      //validacion 3 registros repetidos
      const tercerRegistro = arreglo[i + 2]
        ? arreglo[i + 2]['@_place_id']
        : false;

      if (
        registro['@_place_id'] == arreglo[i + 1]['@_place_id'] &&
        registro['@_place_id'] == tercerRegistro
      ) {
        if (arreglo[i + 1].type.regular && arreglo[i + 2].type.premium) {
          registro.type.premium = {
            ...arreglo[i + 2].type.premium,
          };
          registro.type.regular = {
            ...arreglo[i + 1].type.regular,
          };
        } else if (arreglo[i + 1].type.premium && arreglo[i + 2].type.regular) {
          registro.type.premium = {
            ...arreglo[i + 1].type.premium,
          };
          registro.type.regular = {
            ...arreglo[i + 2].type.regular,
          };
          //   return registro
        }
      }

      //validacion 2 registros repetidos
      if (arreglo[i + 1].type.premium && arreglo[i + 1].type.regular) {
        registro.type.premium = {
          ...arreglo[i + 1].type.premium,
        };
        registro.type.regular = {
          ...arreglo[i + 1].type.regular,
        };
      } else if (arreglo[i + 1].type.regular) {
        registro.type.regular = {
          ...arreglo[i + 1].type.regular,
        };
      } else {
        registro.type.premium = {
          ...arreglo[i + 1].type.premium,
        };
      }
      //  return registro
    } else if (registro.type.premium) {
      const tercerRegistro = arreglo[i + 2]
        ? arreglo[i + 2]['@_place_id']
        : false;

      //validacion 3 registros
      if (
        registro['@_place_id'] == arreglo[i + 1]['@_place_id'] &&
        registro['@_place_id'] == tercerRegistro
      ) {
        console.log(registro['@_place_id']);
        if (arreglo[i + 1].type.diesel && arreglo[i + 2].type.regular) {
          registro.type.diesel = {
            ...arreglo[i + 1].type.diesel,
          };

          registro.type.regular = {
            ...arreglo[i + 2].type.regular,
          };
        } else if (arreglo[i + 1].type.diesel) {
          registro.type.diesel = {
            ...arreglo[i + 1].type.diesel,
          };
        } else if (arreglo[i + 2].type.regular) {
          registro.type.regular = {
            ...arreglo[i + 2].type.regular,
          };
        }

        if (arreglo[i + 1].type.regular && arreglo[i + 2].type.diesel) {
          registro.type.regular = {
            ...arreglo[i + 1].type.regular,
          };

          registro.type.diesel = {
            ...arreglo[i + 2].type.diesel,
          };
        } else if (arreglo[i + 1].type.regular) {
          registro.type.regular = {
            ...arreglo[i + 1].type.regular,
          };
        } else if (arreglo[i + 2].type.diesel) {
          registro.type.diesel = {
            ...arreglo[i + 2].type.diesel,
          };
        }
      }

      if (arreglo[i + 1].type.regular && arreglo[i + 1].type.diesel) {
        registro.type.regular = {
          ...arreglo[i + 1].type.regular,
        };
      } else if (arreglo[i + 1].type.regular) {
        registro.type.regular = {
          ...arreglo[i + 1].type.regular,
        };
      }
      //   return registro
    }

    return registro;
    // console.log(registro)
  } else if (
    registro['@_place_id'] == arreglo[i + 1]['@_place_id'] &&
    registro['@_place_id'] == arreglo[i + 2]['@_place_id']
  ) {
    if (registro.type.diesel) {
      console.log('Si entra en esta validacion');
      if (arreglo[i + 1].type.regular && arreglo[i + 2].type.premium) {
        registro.type.premium = {
          ...arreglo[i + 2].type.premium,
        };
        registro.type.regular = {
          ...arreglo[i + 1].type.regular,
        };
      } else if (arreglo[i + 1].type.premium && arreglo[i + 2].type.regular) {
        registro.type.premium = {
          ...arreglo[i + 1].type.premium,
        };
        registro.type.regular = {
          ...arreglo[i + 2].type.regular,
        };
      }

      //  return registro
    }
    if (registro.type.regular) {
      if (arreglo[i + 1].type.diesel && arreglo[i + 2].type.premium) {
        registro.type.premium = {
          ...arreglo[i + 2].type.premium,
        };
        registro.type.diesel = {
          ...arreglo[i + 1].type.diesel,
        };
      }
      //  return registro
    }

    return registro;
  }
};

export { registroEnUnaSolaFilaDinamico };

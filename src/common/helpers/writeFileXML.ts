import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';

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

export { reporteXML };

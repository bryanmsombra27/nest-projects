import nodemailer from 'nodemailer';

export const opt = {
  errorCorrectionLevel: 'H',

  // color: {
  //   // dark: '#593e73 ',  // Blue dots
  // //   light: '#ffffff' // Transparent background
  // }
};

export const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'projectos631@gmail.com',
    pass: 'awtmcbvffxlyocxw',
  },
});

export const qrEmail = (destino: string, nombre: string, url: string) => {
  const opt = {
    from: '"QRUD 👻" <qrud.app@gmail.com>', // sender address
    to: destino, // list of receivers
    subject: 'Generando QR', // Subject line
    html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Rosario:wght@300&display=swap');
                  </style>
              <section style="font-family: 'Rosario', sans-serif; text-align: center; border-radius: 20px; margin-top: 30px; display: block; margin-left: auto; margin-right: auto; background: #fff; box-shadow: 0 2px 15px rgba(64,64,64,.7); width: 500px; height: 800px;">
                  <img src="cid:logo" alt="Logo" style=" padding-top: 30px; width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
                  <h1 style="text-align: center;">Bienvenido ${nombre}</h1>
                  <img src="cid:koso@koso.com" alt="QR" style="display: block; margin-left: auto; margin-right: auto; width: 250px; height: 250px;">
                  <p style="font-size: 20px; padding-left: 30px; padding-right: 30px;"> Bienvenido a nuestro sistema de datos QRUD, escanea el codigo QR para verificar tus datos.</p>
                  <a href="#">Si hay algun error en tus datos presione Aqui.</a>
              </section>
          </body>
          </html>`, // html body
    text: 'Bienvenido usuario al sistema QR le entregamos su codigo QR que nos ha solicitado', // plain text body

    attachments: [
      {
        filename: 'qr.png',
        path: `${url}`,
        cid: 'koso@koso.com',
      },
      {
        path: 'https://i.postimg.cc/DwkPJ400/QRUD.png',
        cid: 'logo',
      },
    ],
  };
  return opt;
};

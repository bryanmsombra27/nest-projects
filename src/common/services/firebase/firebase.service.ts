import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import serviceAccount from '../../../qrud-flutter.json';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor() {
    this.initialize();
  }

  initialize() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
      this.logger.log('firebase admin SDK initialized ');
    }
  }

  async sendNotificationToDevice(
    token: string,
    title: string,
    body: string,
    qr: string,
  ) {
    console.log('ENTRA AL SERVICIO FIREBASE');
    const message = {
      notification: { title, body },
      android: {
        notification: {
          icon: 'https://i.postimg.cc/DwkPJ400/QRUD.png',
        },
      },
      data: {
        qr,
      },

      token,
    };

    try {
      const response = await admin.messaging().send(message);

      this.logger.log(`Notificación enviada: ${response}`);
      return response;
    } catch (error) {
      console.log('ERROR EN LA NOTIFICACION PUSH: ', error);
      this.logger.error('Error enviando notificación:', error);
      throw error;
    }
  }
}

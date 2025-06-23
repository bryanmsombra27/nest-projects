import { initializeApp, cert } from 'firebase-admin/app';

const serviceAccount = require('../../qrud-flutter.json');

initializeApp({
  credential: cert(serviceAccount),
});

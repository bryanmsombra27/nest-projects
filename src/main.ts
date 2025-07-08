import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { reporteXML, saveInDB } from './common/helpers/writeFileXML';
import * as cron from 'node-cron';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // reporteXML('prices', 'places');
  // saveInDB();
  app.enableCors();

  cron.schedule('0 */4 * * *', () => {
    reporteXML('prices', 'places');
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // VALIDACIONES GLOBALES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ANTE PONE PREFIJOS AL PATH DE LA API
  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

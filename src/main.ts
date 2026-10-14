import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors({
    origin: process.env.UI_URL!!,
    credentials: true,
  });

  if (process.env.API_PORT) {
    await app.listen(process.env.API_PORT);
  } else {
    console.error('API_PORT environment variable is not set. Please set it in your .env file.');
  }
}
await bootstrap();
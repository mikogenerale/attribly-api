import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.API_PORT) {
    await app.listen(process.env.API_PORT);
  } else {
    console.error('API_PORT environment variable is not set. Please set it in your .env file.');
  }
}
await bootstrap();

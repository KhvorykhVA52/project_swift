import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:9000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Настройка статических файлов
  const uploadsDir = join(__dirname, '..', 'uploads', 'avatars');
  app.use('/uploads/avatars', express.static(uploadsDir));

  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
}
bootstrap();
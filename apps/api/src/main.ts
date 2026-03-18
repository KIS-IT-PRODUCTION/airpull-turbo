import 'dotenv/config'; // Завантажуємо змінні середовища з .env файлу
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Дозволяємо нашому фронтенду робити сюди запити
  app.enableCors();

  // Налаштовуємо магію Swagger
  const config = new DocumentBuilder()
    .setTitle('Airpull API')
    .setDescription('Документація та панель керування для Airpull Vape Shop')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ЗМІНА ТУТ:
  // Якщо є порт від Render - беремо його, якщо ні (локально) - беремо 4004
  await app.listen(process.env.PORT || 4004);
}
bootstrap();
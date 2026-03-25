// backend/src/main.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. ПІДКЛЮЧАЄМО КУКИ (до CORS)
  app.use(cookieParser());

  // 3. ПРАВИЛЬНИЙ CORS (тільки один раз!)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Дозволяє отримувати куки
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const uploadDir = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('Airpull API')
    .setDescription('Документація')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 4004);
}
bootstrap();
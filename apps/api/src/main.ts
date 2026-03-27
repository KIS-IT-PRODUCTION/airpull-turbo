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

  app.use(cookieParser());

  const allowedOrigins = ['http://localhost:3000'];
  
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  app.enableShutdownHooks();

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

  const port = process.env.PORT || 4004;
  await app.listen(port);
  console.log(`🚀 БЕКЕНД ПРАЦЮЄ НА ПОРТУ ${port}`);
}
bootstrap();
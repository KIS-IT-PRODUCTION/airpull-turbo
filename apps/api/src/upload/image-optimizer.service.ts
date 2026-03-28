import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageOptimizerService {

  async optimize(file: Express.Multer.File): Promise<Buffer> {
    try {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      let pipeline = image
        .rotate()
        .webp({ quality: 80 });

      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;

      if (metadata.width && metadata.height && (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT)) {
        pipeline = pipeline.resize({
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      return await pipeline.toBuffer();
    } catch (error) {
      console.error('Помилка оптимізації зображення:', error);
      throw new BadRequestException('Не вдалося обробити зображення. Файл пошкоджений або має непідтримуваний формат.');
    }
  }
}
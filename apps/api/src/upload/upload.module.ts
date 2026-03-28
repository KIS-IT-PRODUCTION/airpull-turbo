import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageOptimizerService } from './image-optimizer.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
  providers: [ImageOptimizerService],
})
export class UploadModule {}
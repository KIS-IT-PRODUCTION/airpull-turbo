import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UploadedFiles, 
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageOptimizerService } from './image-optimizer.service';

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Можна завантажувати лише зображення!'), false);
  }
  cb(null, true);
};

@Controller('upload')
export class UploadController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageOptimizerService: ImageOptimizerService
  ) {}
  
  @Post('single')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Файл не завантажено');
    
    const optimizedBuffer = await this.imageOptimizerService.optimize(file);
    
    const optimizedFile = {
      ...file,
      buffer: optimizedBuffer,
      originalname: `${file.originalname.split('.')[0]}.webp`,
      mimetype: 'image/webp',
    };

    const result = await this.cloudinaryService.uploadFile(optimizedFile);
    
    return { 
      url: result.secure_url,
      filename: result.public_id 
    };
  }

  @Post('multiple')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new BadRequestException('Файли не завантажено');

    const uploadedFiles = await Promise.all(
      files.map(async (file, index) => {
        const optimizedBuffer = await this.imageOptimizerService.optimize(file);
        
        const optimizedFile = {
          ...file,
          buffer: optimizedBuffer,
          originalname: `${file.originalname.split('.')[0]}.webp`,
          mimetype: 'image/webp',
        };

        const result = await this.cloudinaryService.uploadFile(optimizedFile);
        
        return {
          url: result.secure_url,
          alt: file.originalname,
          order: index
        };
      })
    );

    return uploadedFiles;
  }
}
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
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

const uploadDir = join(process.cwd(), 'uploads');
const baseUrl = process.env.API_URL;
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storageConfig = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Можна завантажувати лише зображення!'), false);
  }
  cb(null, true);
};

@Controller('upload')
export class UploadController {
  
  @Post('single')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig,
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Файл не завантажено');
    
    return { 
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename 
    };
  }

  @Post('multiple')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageConfig,
      fileFilter: imageFileFilter,
    }),
  )
  uploadFiles(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) throw new BadRequestException('Файли не завантажено');

    return files.map((file, index) => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      alt: file.originalname,
      order: index
    }));
  }
}
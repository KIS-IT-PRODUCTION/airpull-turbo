import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { UploadController } from './upload/upload.controller'

@Module({
  imports: [PrismaModule, ProductsModule, AuthModule, OrdersModule],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}

// backend/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
// ВИДАЛИ імпорт JwtModule звідси!

@Module({
  imports: [PrismaModule], // Тільки Prisma
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
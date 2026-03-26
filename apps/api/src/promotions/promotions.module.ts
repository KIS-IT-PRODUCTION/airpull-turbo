// src/promotions/promotions.module.ts
import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Обов'язково

@Module({
  imports: [PrismaModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
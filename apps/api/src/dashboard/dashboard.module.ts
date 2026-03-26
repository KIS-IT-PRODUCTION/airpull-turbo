import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module'; // Імпортуємо модуль Прізми

@Module({
  imports: [PrismaModule], // Додаємо PrismaModule, щоб сервіс міг використовувати БД
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
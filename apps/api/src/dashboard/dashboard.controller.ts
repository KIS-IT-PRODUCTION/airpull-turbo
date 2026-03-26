import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

// Базовий шлях буде /admin/dashboard-stats
@Controller('admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard-stats')
  async getDashboardStats() {
    return this.dashboardService.getStats();
  }
}
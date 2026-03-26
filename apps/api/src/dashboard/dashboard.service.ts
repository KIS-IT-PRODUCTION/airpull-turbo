import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Перевір цей шлях!

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      todayStats,
      yesterdayStats,
      monthStats,
      lastMonthStats,
      totalProducts,
      lowStockProducts,
      totalUsers,
      recentUsers,
      last7DaysOrders
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { total: true },
        _count: { id: true },
        where: { createdAt: { gte: startOfToday } }
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfYesterday, lt: startOfToday } }
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfMonth } }
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
      }),
      this.prisma.product.count({ where: { stock: { gt: 0 } } }),
      this.prisma.product.count({ where: { stock: { gt: 0, lt: 5 } } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo }, status: { not: "CANCELLED" } }, // Статус налаштуй під себе
        select: { total: true, createdAt: true }
      })
    ]);

    const todayRevenue = todayStats._sum.total || 0;
    const todayOrders = todayStats._count.id || 0;
    const yesterdayRevenue = yesterdayStats._sum.total || 0;
    const monthRevenue = monthStats._sum.total || 0;
    const lastMonthRevenue = lastMonthStats._sum.total || 0;

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' });
      return { date: dateStr, revenue: 0, orders: 0, rawDate: d };
    });

    last7DaysOrders.forEach(order => {
      const orderDate = order.createdAt;
      const dayIndex = chartData.findIndex(d => 
        d.rawDate.getDate() === orderDate.getDate() && 
        d.rawDate.getMonth() === orderDate.getMonth()
      );
      
      if (dayIndex !== -1) {
        chartData[dayIndex].revenue += order.total;
        chartData[dayIndex].orders += 1;
      }
    });

    const formattedChartData = chartData.map(({ rawDate, ...rest }) => rest);

    return {
      metrics: {
        todayRevenue,
        todayOrders,
        yesterdayRevenue,
        todayGrowth: calcGrowth(todayRevenue, yesterdayRevenue),
        monthRevenue,
        lastMonthRevenue,
        monthGrowth: calcGrowth(monthRevenue, lastMonthRevenue),
        totalProducts,
        lowStockProducts,
        totalUsers,
        newUsersWeek: recentUsers
      },
      chartData: formattedChartData
    };
  }
}
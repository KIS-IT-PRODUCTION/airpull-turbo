export interface DashboardMetrics {
  todayRevenue: number;
  todayOrders: number;
  yesterdayRevenue: number;
  todayGrowth: number;
  monthRevenue: number;
  lastMonthRevenue: number;
  monthGrowth: number;
  totalProducts: number;
  lowStockProducts: number;
  totalUsers: number;
  newUsersWeek: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  chartData: ChartDataPoint[];
}
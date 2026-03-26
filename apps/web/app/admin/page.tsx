import DashboardClient from '@/components/admin/DashboardClient';
import { DashboardData } from '@/types/dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-stats`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Не вдалося отримати дані з бекенду');
    }

    const data: DashboardData = await res.json();

    return (
      <DashboardClient 
        metrics={data.metrics} 
        chartData={data.chartData} 
      />
    );
  } catch (error) {
    console.error('Помилка завантаження дашборду:', error);
    
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
        <h2 className="text-xl font-bold mb-2">Помилка мережі</h2>
        <p>Не вдалося завантажити статистику. Перевірте підключення до бекенду.</p>
      </div>
    );
  }
}
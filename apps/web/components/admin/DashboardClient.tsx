'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  metrics: {
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
  };
  chartData: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export default function DashboardClient({ metrics, chartData }: DashboardProps) {
  const formatMoney = (amount: number) => amount.toLocaleString('uk-UA') + ' ₴';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 🎩 Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Огляд системи</h1>
          <p className="text-white/50 mt-1 text-sm">Статистика вашого магазину за останні 7 днів</p>
        </div>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white/70 font-medium">
          Оновлено: {new Date().toLocaleDateString('uk-UA')}
        </div>
      </div>
      
      {/* 🃏 Картки головних метрик */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Продажі за сьогодні */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-white/60 text-sm mb-1 font-medium">Продажі за сьогодні</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-emerald-400">{formatMoney(metrics.todayRevenue)}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-md font-bold ${metrics.todayGrowth >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {metrics.todayGrowth > 0 ? '+' : ''}{metrics.todayGrowth}%
            </span>
            <span className="text-white/40">вчора: {formatMoney(metrics.yesterdayRevenue)} ({metrics.todayOrders} зам.)</span>
          </div>
        </div>
        
        {/* Прибуток за місяць */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-white/60 text-sm mb-1 font-medium">Прибуток за місяць</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-violet-400">{formatMoney(metrics.monthRevenue)}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
             <span className={`px-2 py-0.5 rounded-md font-bold ${metrics.monthGrowth >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {metrics.monthGrowth > 0 ? '+' : ''}{metrics.monthGrowth}%
            </span>
            <span className="text-white/40">минулий місяць: {formatMoney(metrics.lastMonthRevenue)}</span>
          </div>
        </div>
        
        {/* Активні товари */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-white/60 text-sm mb-1 font-medium">Товарів у наявності</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-amber-400">{metrics.totalProducts}</p>
            <p className="text-white/50 text-sm mb-1">шт.</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            {metrics.lowStockProducts > 0 ? (
              <>
                <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md font-bold">Увага</span>
                <span className="text-white/40">{metrics.lowStockProducts} товарів закінчуються (&lt;5 шт)</span>
              </>
            ) : (
               <span className="text-white/40">Всі товари в достатній кількості</span>
            )}
          </div>
        </div>

        {/* Користувачі */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-white/60 text-sm mb-1 font-medium">Активні клієнти</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-blue-400">{metrics.totalUsers}</p>
            <p className="text-white/50 text-sm mb-1">осіб</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md font-bold">+{metrics.newUsersWeek}</span>
            <span className="text-white/40">нових реєстрацій за 7 днів</span>
          </div>
        </div>

      </div>

      {/* 📈 Графік динаміки продажів */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Динаміка прибутку (7 днів)</h2>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} ₴`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                formatter={(value: number) => [formatMoney(value), 'Прибуток']}
                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Area type="monotone" dataKey="revenue" name="Прибуток" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
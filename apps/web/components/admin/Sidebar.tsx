'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Додаємо опис пропсів
interface SidebarProps {
  pendingOrdersCount?: number;
}

export default function Sidebar({ pendingOrdersCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Дашборд', path: '/admin', icon: '📊' },
    { name: 'Замовлення', path: '/admin/orders', icon: '📦' },
    { name: 'Товари', path: '/admin/products', icon: '🛍️' },
    { name: 'Акції', path: '/admin/promotions', icon: '🏷️' }, // Додай цей рядок
    { name: 'Налаштування', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#1a1a1a] border-r border-white/10 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-4 py-2">
        <h2 className="text-xl font-bold text-white tracking-wider">ADMIN PANEL</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-violet-600 text-white font-medium' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.name}</span>
              
              {item.path === '/admin/orders' && pendingOrdersCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span>⬅️</span>
          <span>На сайт</span>
        </Link>
      </div>
    </aside>
  );
}
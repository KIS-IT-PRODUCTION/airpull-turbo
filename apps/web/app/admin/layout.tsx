import Sidebar from '@/components/admin/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export const metadata = {
  title: 'Admin Panel | Управління магазином',
};

// 🔴 Додаємо функцію для отримання кількості нових замовлень
async function getPendingOrdersCount(token: string) {
  try {
    const res = await fetch('http://localhost:4004/orders', {
      cache: 'no-store', // щоб дані завжди були свіжі
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return 0;

    const orders = await res.json();
    // Рахуємо тільки ті, що мають статус "Очікує" (PENDING)
    const pendingCount = orders.filter((order: any) => order.status === 'PENDING').length;
    
    return pendingCount;
  } catch (error) {
    console.error('Помилка завантаження індикатора замовлень:', error);
    return 0;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  // 1. Перевіряємо, чи є токен
  if (!token) {
    redirect('/login');
  }

  // 2. Перевіряємо права доступу (твій існуючий код)
  try {
    const decoded: any = jwtDecode(token);
    console.log('--- DEBUG ADMIN CHECK ---');
    console.log('Decoded Token:', decoded);
    console.log('Role found:', decoded.role);
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'admin') {
      console.log('Access Denied: Role mismatch');
      redirect('/');
    }
  } catch (error) {
    console.error('JWT Decode Error:', error);
    redirect('/login');
  }

  // 3. Отримуємо кількість замовлень ПІСЛЯ перевірки прав
  // Передаємо токен, щоб бекенд пустив нас до даних
  const pendingOrdersCount = await getPendingOrdersCount(token);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* 4. Передаємо пропс у Sidebar */}
      <Sidebar pendingOrdersCount={pendingOrdersCount} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
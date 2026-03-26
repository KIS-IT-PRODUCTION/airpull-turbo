import Sidebar from '@/components/admin/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin Panel | Управління магазином',
};

async function getPendingOrdersCount(token: string) {
  try {
    // 🚀 ВИПРАВЛЕНО: Використовуємо змінну Vercel замість localhost
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/orders`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return 0;

    const orders = await res.json();
    return orders.filter((order: any) => order.status === 'PENDING').length;
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
  
  // 🚀 УНІФІКАЦІЯ: Той самий пошук, що і в middleware
  const token = cookieStore.get('token')?.value || cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded: any = jwtDecode(token);
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'admin') {
      redirect('/');
    }
  } catch (error) {
    console.error('JWT Decode Error:', error);
    redirect('/login');
  }

  const pendingOrdersCount = await getPendingOrdersCount(token);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar pendingOrdersCount={pendingOrdersCount} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
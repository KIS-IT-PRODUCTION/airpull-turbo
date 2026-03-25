import Link from 'next/link';
import { cookies } from 'next/headers';

// 1. Описуємо типи даних, які ми очікуємо отримати від бекенду
interface UserInfo {
  id: string;
  name: string | null;
  phone: string;
}

interface ProductInfo {
  name: string;
  price: number;
  imageUrl?: string | null;
}

interface OrderItemInfo {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: ProductInfo; // Додали товар, щоб бачити назви (якщо бекенд їх віддає)
}

interface Order {
  id: string;
  status: string;
  total: number;
  deliveryCity?: string | null;
  deliveryWarehouse?: string | null;
  createdAt: string; 
  user?: UserInfo; // Ось тут лежать дані користувача
  items: OrderItemInfo[];
}

async function getOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('auth-token')?.value;

    const res = await fetch('http://localhost:4004/orders', {
      cache: 'no-store', // Відключаємо кеш, щоб бачити нові замовлення одразу
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error('Помилка завантаження замовлень. Статус:', res.status);
      return [];
    }

    const data = await res.json();
    
    // ТИМЧАСОВИЙ CONSOLE.LOG ДЛЯ ДЕБАГУ
    // Він виведе в термінал Next.js перше замовлення, щоб ви побачили, чи приходить user
    if (data && data.length > 0) {
      console.log("Перше замовлення з API:", JSON.stringify(data[0], null, 2));
    }

    return data;
  } catch (error) {
    console.error('Помилка мережі (Бекенд не відповідає):', error);
    return [];
  }
}

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PROCESSING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    SHIPPED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const labels: Record<string, string> = {
    PENDING: 'Очікує',
    PROCESSING: 'В обробці',
    SHIPPED: 'Відправлено',
    COMPLETED: 'Виконано',
    CANCELLED: 'Скасовано',
  };

  const style = styles[status] || styles.PENDING;
  const label = labels[status] || status;

  return (
    <span className={`px-3 py-1 inline-flex rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
  );
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Замовлення</h1>
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Дата / ID</th>
                <th className="px-6 py-4">Клієнт (Контакти)</th>
                <th className="px-6 py-4">Сума / Товари</th>
                <th className="px-6 py-4">Доставка</th>
                <th className="px-6 py-4 whitespace-nowrap">Статус</th>
                <th className="px-6 py-4 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span>Замовлень поки немає</span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  // Форматуємо дату в читабельний вигляд (з часом)
                  const orderDate = new Date(order.createdAt);
                  const formattedDate = orderDate.toLocaleDateString('uk-UA');
                  const formattedTime = orderDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{formattedDate}</div>
                        <div className="text-xs text-white/50">{formattedTime}</div>
                        <div className="font-mono text-[10px] text-white/30 mt-1 uppercase" title={order.id}>
                          {order.id.split('-')[0]}
                        </div>
                      </td>
                      
                      {/* КОЛОНКА КЛІЄНТА */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {order.user?.name ? order.user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="font-medium text-white truncate max-w-[150px]" title={order.user?.name || 'Без імені'}>
                              {order.user?.name || 'Без імені'}
                            </div>
                            <div className="text-white/60 text-xs mt-0.5">
                              {order.user?.phone || 'Телефон не вказано'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-400">{order.total} ₴</div>
                        <div className="text-xs text-white/50 mt-0.5">
                          {order.items?.length || 0} {order.items?.length === 1 ? 'позиція' : 'позиції'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {order.deliveryCity || order.deliveryWarehouse ? (
                          <>
                            <div className="text-white text-sm font-medium">{order.deliveryCity || 'Місто не вказано'}</div>
                            <div className="text-xs text-white/50 truncate max-w-[200px] mt-0.5" title={order.deliveryWarehouse || ''}>
                              {order.deliveryWarehouse || 'Відділення не вказано'}
                            </div>
                          </>
                        ) : (
                          <span className="text-white/30 text-xs italic">Дані відсутні</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-colors border border-white/5 group-hover:border-white/10"
                        >
                          Деталі
                          <svg className="w-3 h-3 ml-1.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
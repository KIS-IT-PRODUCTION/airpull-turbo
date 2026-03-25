'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserOrdersRequest } from '@/app/actions/orders';

// 💡 Орієнтовні типи для замовлення. Можливо, твій бекенд віддає трохи інші назви полів (наприклад, не createdAt, а date)
interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    name: string;
    price: number;
    imageUrl?: string;
  };
}

interface Order {
  id: string | number;
  createdAt?: string;
  status?: string;
  totalPrice?: number;
  items?: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Викликаємо серверний екшн БЕЗ передачі токена (він сам його візьме з кук)
      const data = await getUserOrdersRequest();
      
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      // Якщо помилка "Не авторизовано", просимо увійти
      if (err.message === 'Не авторизовано') {
        setError('Будь ласка, увійдіть в акаунт, щоб переглянути замовлення');
      } else {
        setError('Не вдалося завантажити замовлення');
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchOrders();
}, []);

  // Функція для красивого форматування дати
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Дата невідома';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Переклад статусів замовлення
  const translateStatus = (status?: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      'PENDING': { label: 'В обробці', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
      'PROCESSING': { label: 'Готується', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
      'SHIPPED': { label: 'Відправлено', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
      'DELIVERED': { label: 'Доставлено', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
      'CANCELLED': { label: 'Скасовано', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    };
    
    const key = status?.toUpperCase() || 'PENDING';
    return statuses[key] || { label: status || 'Невідомо', color: 'text-white/60 bg-white/5 border-white/10' };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 mt-20 mb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Мої замовлення</h1>
        <Link 
          href="/catalog"
          className="px-5 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
        >
          В каталог
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-violet-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white/50">Завантажуємо історію...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-red-400 mb-4">⚠️ {error}</p>
          {error.includes('увійдіть') && (
            <Link href="/login" className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors font-medium">
              Увійти
            </Link>
          )}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-white mb-2">У вас ще немає замовлень</h2>
          <p className="text-white/50 mb-6">Час зробити свою першу покупку!</p>
          <Link href="/catalog" className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white rounded-xl transition-all font-bold shadow-lg shadow-violet-500/25">
            Перейти до товарів
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = translateStatus(order.status);
            
            return (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors">
                {/* Шапка замовлення */}
                <div className="p-5 md:p-6 border-b border-white/10 bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">Замовлення #{order.id}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-white/50">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-white/50 mb-1">Сума замовлення:</p>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                      {order.totalPrice ? `${order.totalPrice} ₴` : 'Сума уточнюється'}
                    </p>
                  </div>
                </div>

                {/* Товари в замовленні */}
                {order.items && order.items.length > 0 && (
                  <div className="p-5 md:p-6">
                    <h4 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Товари:</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {item.product?.imageUrl ? (
                              <img src={item.product.imageUrl} alt="Товар" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-white/30">Фото</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium line-clamp-1">
                              {item.product?.name || `Товар ID: ${item.productId}`}
                            </p>
                            <div className="flex gap-3 mt-1 text-sm">
                              <span className="text-white/50">{item.quantity} шт.</span>
                              {item.product?.price && (
                                <span className="text-violet-400">× {item.product.price} ₴</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
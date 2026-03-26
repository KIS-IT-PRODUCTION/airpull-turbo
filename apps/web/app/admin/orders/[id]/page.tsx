import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatusUpdater from './StatusUpdater'; // Імпортуємо клієнтський компонент

// Залишаємо getOrder як є, вона працює правильно
async function getOrder(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value || cookieStore.get('token')?.value; // Додав перевірку і на 'token' про всяк випадок
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Помилка завантаження замовлення:', error);
    return null;
  }
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  // 🚀 ДОДАЄМО ВИКЛИК cookies() ТУТ
  // Ми повинні дістати cookies в самому компоненті, щоб мати до них доступ нижче
  const cookieStore = await cookies();

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 text-white">
      {/* Шапка з навігацією */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/orders" 
          className="text-white/50 hover:text-white flex items-center gap-2 transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад до списку
        </Link>
        <div className="text-right">
            <p className="text-sm text-white/40 uppercase tracking-wider font-bold">Деталі замовлення</p>
            <p className="font-mono text-[10px] text-white/20">{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ліва колонка: Товари */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
               Товари у замовленні
            </h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    {item.product?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-xs text-white/20">Ні фото</div>
                    )}
                    <div>
                      <p className="font-medium text-white/90">{item.product?.name || 'Товар видалено'}</p>
                      <p className="text-sm text-white/40">{item.quantity} шт. × {item.price} ₴</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">{item.quantity * item.price} ₴</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-white/40 font-medium">Підсумок до сплати:</span>
                <span className="text-3xl font-black text-emerald-400 tracking-tight">{order.total} ₴</span>
            </div>
          </div>
        </div>

        {/* Права колонка: Інфо про клієнта та Доставка */}
        <div className="space-y-6">
          {/* Клієнт */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-lg">
            <h3 className="text-xs font-bold uppercase text-white/30 mb-4 tracking-widest">Клієнт</h3>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                  {order.user?.name?.charAt(0) || '?'}
               </div>
               <div>
                  <p className="font-semibold text-white">{order.user?.name || 'Без імені'}</p>
                  <p className="text-sm text-white/40">Покупець</p>
               </div>
            </div>
            <p className="text-violet-400 font-medium text-sm py-2 px-3 bg-violet-500/5 rounded-lg border border-violet-500/10 inline-block w-full text-center">
               {order.user?.phone}
            </p>
          </div>

          {/* Доставка */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-lg">
            <h3 className="text-xs font-bold uppercase text-white/30 mb-4 tracking-widest">Доставка</h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-white/20 mb-1">Місто</p>
                <p className="font-medium text-sm">{order.deliveryCity || 'Не вказано'}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-white/20 mb-1">Відділення</p>
                <p className="text-xs leading-relaxed text-white/70">{order.deliveryWarehouse || 'Не вказано'}</p>
              </div>
            </div>
          </div>

         {/* 🚀 ТЕПЕР cookieStore ДОСТУПНИЙ ТУТ */}
        <StatusUpdater 
          orderId={order.id} 
          initialStatus={order.status} 
          token={cookieStore.get('token')?.value || cookieStore.get('auth-token')?.value} 
        />
        </div>
      </div>
    </div>
  );
}
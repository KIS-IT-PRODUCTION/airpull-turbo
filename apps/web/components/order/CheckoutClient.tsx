'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/app/store/cartStore';
import { getUser } from '@/app/actions/auth';
import { createOrderRequest } from '@/app/actions/orders';
import NovaPoshtaForm from './NovaPoshtaForm'; // Імпортуємо наш новий компонент

export default function CheckoutClient() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Дані користувача
  const [formData, setFormData] = useState({ name: '', phone: '' });
  
  // Дані доставки, які ми отримаємо від компонента NovaPoshtaForm
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryWarehouse, setDeliveryWarehouse] = useState('');

  useEffect(() => {
    setIsMounted(true);
    getUser().then(userData => {
      if (userData) {
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
        });
      }
    });
  }, []);

  if (!isMounted) return null;

const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryCity || !deliveryWarehouse) {
      setError("Будь ласка, оберіть місто та відділення Нової Пошти");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // 🚀 ВИПРАВЛЕНО: Винесли поля доставки на верхній рівень
      const orderData = {
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
        },
        deliveryCity: deliveryCity,             // Тепер бекенд це побачить!
        deliveryWarehouse: deliveryWarehouse    // І це теж!
      };

      await createOrderRequest(orderData);
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/5 border border-white/10 rounded-3xl text-center mt-10">
        <h2 className="text-3xl font-bold text-white mb-4">Замовлення прийнято!</h2>
        <p className="text-white/70 mb-8">Дякуємо, {formData.name}! Очікуйте дзвінка для підтвердження.</p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl">До каталогу</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
      <div className="lg:col-span-2 space-y-8">
         <h1 className="text-2xl font-bold">Оформлення замовлення</h1>
         
         {/* Контейнер оформлення */}
         <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
            <h2 className="text-xl font-bold">Доставка Нова Пошта</h2>
            
            {/* Використовуємо наш ізольований компонент */}
            <NovaPoshtaForm 
              onCitySelect={setDeliveryCity} 
              onWarehouseSelect={setDeliveryWarehouse} 
            />

            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
               <div>
                  <label className="text-white/60 text-sm">Ім'я</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-1 outline-none text-white" />
               </div>
               <div>
                  <label className="text-white/60 text-sm">Телефон</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-1 outline-none text-white" />
               </div>
            </form>
         </div>
      </div>

      {/* Сайдбар підсумку */}
      <div className="lg:col-span-1">
         <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-24 text-center">
            <p className="text-white/60 mb-2">До сплати</p>
            <p className="text-3xl font-black mb-6">{getTotalPrice()} ₴</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button 
              form="checkout-form"
              type="submit"
              disabled={isLoading || !deliveryWarehouse}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold hover:scale-[1.02] transition-transform disabled:opacity-30"
            >
              {isLoading ? 'Оформлюємо...' : 'Підтвердити'}
            </button>
         </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useCartStore, CartItem } from '../../app/store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      {/* Затемнення фону (Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Сама бічна панель */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Шапка кошика */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Мій кошик</h2>
          <button 
            onClick={closeCart}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Список товарів */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/50 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p>Ваш кошик порожній</p>
            </div>
          ) : (
            // 🚀 ОСЬ ТУТ ДОДАЛИ : CartItem
            items.map((item: CartItem) => (
              <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                {/* Заглушка для фото (можеш замінити на next/image) */}
                <div className="w-20 h-20 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-white/30">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : 'Фото'}
                </div>
                
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-white line-clamp-2">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-white/30 hover:text-red-400 transition-colors ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3 bg-black/50 rounded-lg p-1 border border-white/10">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                      <span className="text-sm text-white font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white">+</button>
                    </div>
                    <span className="text-sm font-bold text-violet-400">{item.price * item.quantity} ₴</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Футер кошика (Сума та Оформлення) */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/70 font-medium">Разом:</span>
              <span className="text-2xl font-bold text-white">{getTotalPrice()} ₴</span>
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98]">
              Оформити замовлення
            </button>
          </div>
        )}
      </div>
    </>
  );
}
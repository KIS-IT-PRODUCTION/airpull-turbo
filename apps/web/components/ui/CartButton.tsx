'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../../app/store/cartStore';

export default function CartButton() {
  // Дістаємо дані зі стору ось так (це безпечніше для Zustand):
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Якщо ми ще на сервері - повертаємо порожній блок такого ж розміру, 
  // щоб хедер не "стрибав" при завантаженні
  if (!isMounted) {
    return <div className="w-10 h-10"></div>;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center"
      aria-label="Відкрити кошик"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-md border-2 border-black">
          {totalItems}
        </span>
      )}
    </button>
  );
}
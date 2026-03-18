'use client';

import { useState } from 'react';
import { useCartStore } from '@/app/store/cartStore';
// 🚀 1. ІМПОРТУЄМО ФУНКЦІЮ TOAST
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
  inStock: boolean;
}

export default function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
  // openCart більше не дістаємо зі стору, бо ми його не відкриваємо
  const { addItem } = useCartStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    // 1. Додаємо в кошик
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || undefined,
      quantity: 1,
    });

    // 2. Анімація самої кнопки
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // 3. 🚀 ПОКАЗУЄМО TOAST ЗАМІСТЬ ВІДКРИТТЯ КОШИКА
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-sm">Додано в кошик!</span>
        <span className="text-xs text-white/60 line-clamp-1">{product.name}</span>
      </div>,
      {
        duration: 3000, // Сховається через 3 секунди
      }
    );
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock}
      className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
        inStock 
          ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-violet-500/30' 
          : 'bg-white/10 text-white/30 cursor-not-allowed'
      } ${isAnimating ? 'scale-95 opacity-80' : 'scale-100'}`}
    >
      {inStock ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          Додати в кошик
        </>
      ) : (
        'Немає в наявності'
      )}
    </button>
  );
}
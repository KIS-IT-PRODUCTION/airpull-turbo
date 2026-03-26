'use client';

import { useState } from 'react';
import { useCartStore } from '@/app/store/cartStore';
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
  const { addItem } = useCartStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    // 🚀 ВИПРАВЛЕННЯ ПОМИЛКИ TS: Видалили quantity, бо стор додає його сам
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || undefined,
    });

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-sm text-white">Додано в кошик!</span>
        <span className="text-[11px] text-white/60 line-clamp-1">{product.name}</span>
      </div>,
      {
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px'
        }
      }
    );
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock}
      className={`w-full h-full min-h-[56px] px-4 rounded-2xl font-black text-base uppercase tracking-tight transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap ${
        inStock 
          ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] active:scale-95' 
          : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
      } ${isAnimating ? 'scale-95' : 'scale-100'}`}
    >
      {inStock ? (
        <>
          <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <span>Купити</span>
        </>
      ) : (
        <span className="text-sm">Немає в наявності</span>
      )}
    </button>
  );
}
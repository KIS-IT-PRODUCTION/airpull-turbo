'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { useCartStore } from '@/app/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  // --- ЛОГІКА ЦІН ТА ЗНИЖОК ---
  const currentPrice = Number(product.price);
  const oldPriceValue = product.oldPrice ? Number(product.oldPrice) : 0;
  const hasDiscount = oldPriceValue > currentPrice;
  
  const discountPercent = hasDiscount 
    ? Math.round(((oldPriceValue - currentPrice) / oldPriceValue) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      imageUrl: product.imageUrl,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article className="group relative bg-[#0A0A0A] border border-white/10 rounded-[24px] overflow-hidden hover:border-violet-500/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] flex flex-col">
      
      {/* Зображення та бейджі */}
      <Link href={`/products/${product.slug || product.id}`} className="block relative h-56 overflow-hidden bg-[#111]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">💨</div>
        )}

        {/* Шар з градієнтом для кращої читаємості бейджів */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Статус наявності */}
        <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider z-10 backdrop-blur-md shadow-2xl ${
          inStock ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
        }`}>
          {inStock ? 'В наявності' : 'Sold Out'}
        </div>

        {/* Яскравий бейдж знижки */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500 blur-md opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-pink-500 to-violet-500 text-white text-[12px] font-black px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1">
                <span className="text-[14px]">🔥</span> -{discountPercent}%
              </div>
            </div>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1 relative">
        <Link href={`/products/${product.slug || product.id}`}>
          <h2 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-violet-400 transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-white/40 text-xs mb-5 line-clamp-2 flex-1 leading-relaxed font-medium">
          {product.description ?? 'Опис відсутній'}
        </p>

        <div className="flex items-end justify-between gap-4 mt-auto">
          <div className="flex flex-col">
            {/* Стара ціна (виразніша) */}
            {hasDiscount && (
              <span className="text-white/20 text-sm font-bold line-through decoration-pink-500/60 mb-[-2px] ml-1">
                {oldPriceValue.toLocaleString('uk-UA')} ₴
              </span>
            )}
            
            <div className="flex items-baseline gap-1 relative">
              {/* Ефект світіння для акційної ціни */}
              {hasDiscount && <div className="absolute -inset-2 bg-violet-500/10 blur-xl rounded-full" />}
              
              <span className="text-2xl font-black text-white relative">
                {currentPrice.toLocaleString('uk-UA')}
                <span className="text-violet-400 ml-1 text-lg font-bold">₴</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdded}
            className={`group/btn relative flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all duration-300 overflow-hidden ${
              isAdded 
                ? 'bg-emerald-500 text-white' 
                : inStock
                  ? 'bg-white text-black hover:bg-violet-500 hover:text-white shadow-xl active:scale-95'
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
            {isAdded ? (
              <span className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                Додано <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </span>
            ) : inStock ? (
              <>
                <span className="relative z-10 uppercase tracking-tight">В кошик</span>
                <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </>
            ) : (
              'Немає'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
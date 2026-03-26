'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavoritesStore } from '@/lib/useFavoritesStore';
import FavoriteButton from '@/components/ui/FavoriteButton';

export default function FavoritesList() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useFavoritesStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/[0.05] rounded-[32px] border-dashed">
        <div className="text-7xl mb-6 grayscale opacity-50">💨</div>
        <h2 className="text-2xl text-white font-black mb-3 uppercase tracking-tight">Список порожній</h2>
        <p className="text-white/40 mb-8 text-center max-w-xs text-sm leading-relaxed">
          Ваші улюблені девайси з'являться тут, як тільки ви натиснете на серце.
        </p>
        <Link 
          href="/catalog" 
          className="px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all uppercase text-xs tracking-widest"
        >
          Відкрити каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((product) => {
        // --- РОЗРАХУНОК АКТУАЛЬНОЇ ЦІНИ ТА ЗНИЖКИ ---
        const currentPrice = Number(product.price);
        const oldPriceValue = (product as any).oldPrice ? Number((product as any).oldPrice) : 0;
        const hasDiscount = oldPriceValue > currentPrice;
        const discountPercent = hasDiscount 
          ? Math.round(((oldPriceValue - currentPrice) / oldPriceValue) * 100) 
          : 0;

        return (
          <div 
            key={product.id} 
            className="group relative flex flex-col bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300"
          >
            {/* Кнопка видалення (серце) */}
            <div className="absolute top-3 right-3 z-30">
              <FavoriteButton product={product} />
            </div>

            {/* Бейдж знижки */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 z-30 bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg animate-pulse">
                -{discountPercent}%
              </div>
            )}

            <Link 
              href={`/products/${product.slug || product.id}`} 
              className="flex flex-col h-full"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#151515]">
                <img
                  src={product.imageUrl || '/placeholder.png'} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-violet-400 transition-colors leading-snug">
                  {product.name}
                </h3>
                
                <div className="mt-auto flex flex-col gap-1">
                  {/* Відображення старої ціни, якщо є знижка */}
                  {hasDiscount && (
                    <span className="text-[11px] text-white/20 line-through font-bold decoration-pink-500/40">
                      {oldPriceValue.toLocaleString('uk-UA')} ₴
                    </span>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                        {currentPrice.toLocaleString('uk-UA')}
                      </span>
                      <span className="text-violet-400 text-[10px] font-bold">₴</span>
                    </div>

                    <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-md border ${
                      product.stock > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {product.stock > 0 ? 'В наявності' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
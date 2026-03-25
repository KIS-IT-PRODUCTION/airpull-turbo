'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
        <div className="text-6xl mb-4 opacity-50">💔</div>
        <h2 className="text-xl text-white font-bold mb-2">Ваш список порожній</h2>
        <p className="text-white/50 mb-6 text-center max-w-sm">
          Ви ще не додали жодного товару до улюблених. Перейдіть до каталогу, щоб знайти щось цікаве.
        </p>
        <Link 
          href="/catalog" 
          className="px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-white/90 transition-all"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((product) => (
        <div 
          key={product.id} 
          className="group relative flex flex-col bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-white/20 transition-all"
        >
          <div className="absolute top-3 right-3 z-20">
            <FavoriteButton product={product} />
          </div>

          <Link 
            href={`/products/${product.slug || product.id}`} 
            className="flex flex-col h-full z-10"
          >
          <div className="relative aspect-square w-full overflow-hidden">
            <img
              src={product.imageUrl || '/placeholder.png'} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
            
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-white/70 transition-colors">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-white font-black">
                  {product.price.toLocaleString('uk-UA')} ₴
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                  product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {product.stock > 0 ? 'Є' : 'Немає'}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
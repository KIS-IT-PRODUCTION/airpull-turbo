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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col">
      <Link href={`/products/${product.slug || product.id}`} className="block relative h-52 overflow-hidden bg-gradient-to-br from-violet-900/30 to-pink-900/30">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name} — купити в Airpull`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-300">💨</span>
          </div>
        )}

        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg ${
          inStock ? 'bg-green-500/90 text-white shadow-green-500/20' : 'bg-red-500/90 text-white shadow-red-500/20'
        }`}>
          {inStock ? 'В наявності' : 'Немає'}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.slug || product.id}`}>
          <h2 className="text-white font-bold text-base mb-1 line-clamp-2 hover:text-violet-300 transition-colors leading-snug">
            {product.name}
          </h2>
        </Link>
        <p className="text-white/40 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.description ?? 'Опис відсутній'}
        </p>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              {product.price.toLocaleString('uk-UA')}
            </span>
            <span className="text-white/50 text-sm font-medium">₴</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdded}
            className={`group/btn relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : inStock
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-[0_0_15px_rgba(167,139,250,0.5)] hover:-translate-y-0.5 active:scale-95'
                  : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
            }`}
          >
            {isAdded ? (
              'Додано ✓'
            ) : inStock ? (
              <>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>У кошик</span>
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
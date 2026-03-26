'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';

interface CatalogSectionProps {
  products: Product[];
}

export default function CatalogSection({ products }: CatalogSectionProps) {
  // 1. Захист від порожніх даних та сортування за найбільшою знижкою
  const sortedProducts = (Array.isArray(products) ? [...products] : [])
    .filter(p => p !== null)
    .sort((a, b) => {
      // Розраховуємо відсоток знижки для сортування
      const getDiscount = (p: Product) => {
        const cur = Number(p.price);
        const old = p.oldPrice ? Number(p.oldPrice) : 0;
        return old > cur ? ((old - cur) / old) : 0;
      };
      return getDiscount(b) - getDiscount(a); // Спочатку найбільші знижки
    })
    .slice(0, 8); // Показуємо топ-8 товарів

  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Гарячі пропозиції</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Кращі{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                знижки
              </span>
            </h2>
          </div>
          <Link href="/catalog" className="hidden md:inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium">
            Всі товари →
          </Link>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-3xl">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-white/50 text-lg">Товарів поки немає</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const currentPrice = Number(product.price);
              const oldPriceValue = product.oldPrice ? Number(product.oldPrice) : 0;
              const hasDiscount = oldPriceValue > currentPrice;
              const discountPercent = hasDiscount 
                ? Math.round(((oldPriceValue - currentPrice) / oldPriceValue) * 100) 
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  className="group relative bg-[#0D0D0D] border border-white/10 rounded-[24px] overflow-hidden hover:border-violet-500/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-500/10 block"
                >
                  {/* Зображення + Бейдж знижки */}
                  <div className="h-56 bg-[#111] flex items-center justify-center overflow-hidden relative">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <span className="text-6xl opacity-20">💨</span>
                    )}

                    {hasDiscount && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[12px] font-black px-2.5 py-1 rounded-lg shadow-xl animate-pulse">
                          -{discountPercent}%
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-violet-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-white/40 text-xs mb-5 line-clamp-2 min-h-[32px]">
                      {product.description}
                    </p>

                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-white/20 text-xs font-bold line-through decoration-pink-500/50 mb-[-2px] ml-1">
                            {oldPriceValue.toLocaleString('uk-UA')} ₴
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                            {currentPrice.toLocaleString('uk-UA')}
                          </span>
                          <span className="text-violet-400/60 text-sm font-bold ml-1">₴</span>
                        </div>
                      </div>

                      {/* Статус (просто кольорова точка для мінімалізму) */}
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                         <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400'}`} />
                         <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                            {product.stock > 0 ? 'В наявності' : 'Немає в наявності'}
                         </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link href="/catalog" className="inline-flex px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-violet-500 hover:text-white transition-all">
            Всі товари →
          </Link>
        </div>
      </div>
    </section>
  );
}
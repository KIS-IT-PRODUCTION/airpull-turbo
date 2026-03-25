import Link from 'next/link';
import type { Product } from '@/types/product';

interface CatalogSectionProps {
  products: Product[];
}

export default function CatalogSection({ products }: CatalogSectionProps) {
  // Перевірка на випадок, якщо бекенд лежить і products = undefined
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Каталог</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Топові{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                новинки
              </span>
            </h2>
          </div>
          <Link href="/catalog" className="hidden md:inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium">
            Всі товари →
          </Link>
        </div>

        {safeProducts.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-3xl">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-white/50 text-lg">Товарів поки немає</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeProducts.map((product) => {
              // Захист від битих даних
              if (!product) return null; 

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 block"
                >
                  <div className="h-52 bg-gradient-to-br from-violet-900/40 to-pink-900/40 flex items-center justify-center overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">💨</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-white/40 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">{product.price}</span>
                        <span className="text-white/50 text-sm">₴</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} шт` : 'Немає'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link href="/catalog" className="inline-flex px-6 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all font-medium">
            Всі товари →
          </Link>
        </div>
      </div>
    </section>
  );
}
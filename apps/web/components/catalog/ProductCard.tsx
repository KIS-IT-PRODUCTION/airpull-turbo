import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <article className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col">

      {/* Фото */}
      <Link href={`/products/${product.id}`} className="block relative h-52 overflow-hidden bg-gradient-to-br from-violet-900/30 to-pink-900/30">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name} — купити в Airpull`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-300">💨</span>
          </div>
        )}

        {/* Бейдж наявності */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
          inStock ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
        }`}>
          {inStock ? 'В наявності' : 'Немає'}
        </div>
      </Link>

      {/* Інфо */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.id}`}>
          <h2 className="text-white font-bold text-base mb-1 line-clamp-2 hover:text-violet-300 transition-colors leading-snug">
            {product.name}
          </h2>
        </Link>
        <p className="text-white/40 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.description ?? 'Опис відсутній'}
        </p>

        {/* Ціна + Кнопка */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              {product.price.toLocaleString('uk-UA')}
            </span>
            <span className="text-white/50 text-sm font-medium">₴</span>
          </div>

          <button
            aria-label={`Купити ${product.name} за ${product.price} грн`}
            disabled={!inStock}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              inStock
                ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 hover:scale-105 active:scale-95'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {inStock ? 'Купити' : 'Немає'}
          </button>
        </div>
      </div>
    </article>
  );
}
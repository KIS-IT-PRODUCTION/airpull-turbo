import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/api';
import ProductGallery from '@/components/ui/ProductGallery';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'Товар не знайдено | Airpull' };
  }

  const title = `${product.name} — купити в Україні | Airpull`;
  const description = product.description
    ? `${product.description.slice(0, 120)}. Ціна ${product.price} ₴. Швидка доставка по Україні.`
    : `Купити ${product.name} за ціною ${product.price} ₴ в магазині Airpull.`;

  return {
    title,
    description,
    alternates: { canonical: `https://airpull.com.ua/products/${id}` },
    openGraph: {
      title,
      description,
      url: `https://airpull.com.ua/products/${id}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const inStock = product.stock > 0;

  // 💡 ЗБІР ЗОБРАЖЕНЬ З БЕКЕНДУ
  const productImages: string[] = [];
  
  // Додаємо головне зображення
  if (product.imageUrl) {
    productImages.push(product.imageUrl);
  }

  // Додаємо додаткові зображення з масиву images (якщо вони є в БД)
  // Використовуємо optional chaining та перевірку на дублікати
  const extraImages = (product as any).images;
  if (Array.isArray(extraImages)) {
    extraImages.forEach((img: string) => {
      if (img && img !== product.imageUrl) {
        productImages.push(img);
      }
    });
  }

  // Якщо в базі тільки одне фото, для тесту галереї можна залишити дублювання, 
  // але для продакшну краще просто передати одне фото:
  const finalImages = productImages.length > 0 ? productImages : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? `${product.name} — Airpull`,
    image: product.imageUrl ?? 'https://airpull.com.ua/og-default.jpg',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'UAH',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-black min-h-screen pt-24 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Хлібні крихти" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/40">
              <li><Link href="/" className="hover:text-white transition-colors">Головна</Link></li>
              <li className="text-white/20">/</li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li className="text-white/20">/</li>
              <li className="text-white/70 line-clamp-1">{product.name}</li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* ГАЛЕРЕЯ */}
            <ProductGallery 
              images={finalImages} 
              productName={product.name} 
              inStock={inStock} 
            />

            {/* Інформація */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                  {product.price.toLocaleString('uk-UA')}
                </span>
                <span className="text-2xl text-white/50 font-semibold">₴</span>
              </div>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  inStock ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  {inStock ? `В наявності: ${product.stock} шт` : 'Немає в наявності'}
                </span>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Опис товару</h2>
                  <p className="text-white/70 leading-relaxed">{product.description}</p>
                </div>
              )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {/* 🚀 ВИКОРИСТОВУЄМО НАШУ НОВУ КНОПКУ */}
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  }} 
                  inStock={inStock} 
                />
                
                <button className="px-5 py-4 rounded-2xl font-bold text-white/60 border border-white/10 hover:border-white/30 transition-all">
                  ♡
                </button>
              </div>

              <ul className="space-y-3">
                {['🚀 Доставка 1–2 дні', '✅ 100% оригінал', '🔄 Повернення 14 днів', '💳 Оплата при отриманні'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Характеристики */}
          <section className="mt-16 pt-16 border-t border-white/10">
            <h2 className="text-2xl font-black text-white mb-6">Характеристики</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Артикул', value: product.id.slice(0, 8).toUpperCase() },
                { label: 'Ціна', value: `${product.price.toLocaleString('uk-UA')} ₴` },
                { label: 'Наявність', value: inStock ? 'Так' : 'Ні' },
                { label: 'Доставка', value: 'Нова Пошта' },
              ].map((row) => (
                <div key={row.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{row.label}</p>
                  <p className="text-white font-semibold">{row.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Шукаєш щось інше?</h2>
              <p className="text-white/50 text-sm">Переглянь весь каталог — понад 500 товарів</p>
            </div>
            <Link href="/catalog" className="shrink-0 px-6 py-3 rounded-full font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all">
              ← До каталогу
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
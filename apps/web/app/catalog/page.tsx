import type { Metadata } from 'next';
import { getProducts } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'Каталог вейпів та рідин — Airpull',
  description: 'Великий вибір вейпів, електронних сигарет та рідин. Фільтри за ціною та наявністю. Швидка доставка по Україні.',
  alternates: {
    canonical: 'https://airpull.com.ua/catalog',
  },
  openGraph: {
    title: 'Каталог вейпів та рідин — Airpull',
    description: 'Великий вибір вейпів, електронних сигарет та рідин з доставкою по Україні.',
    url: 'https://airpull.com.ua/catalog',
    images: [{ url: '/og-catalog.jpg', width: 1200, height: 630, alt: 'Каталог Airpull' }],
  },
};

export default async function CatalogPage() {
  const products = await getProducts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Каталог вейпів та рідин Airpull',
    description: 'Великий вибір вейпів та електронних сигарет',
    url: 'https://airpull.com.ua/catalog',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `https://airpull.com.ua/products/${product.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-black pt-8 pb-24 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Заголовок сторінки */}
          <header className="mb-10">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">
              Магазин
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Каталог{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                товарів
              </span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl">
              {products.length > 0
                ? `${products.length} товарів у наявності. Обери свій ідеальний вейп.`
                : 'Незабаром тут зʼявляться товари.'}
            </p>
          </header>

          {/* Каталог з фільтрами */}
          <CatalogClient products={products} />
        </div>
      </main>
    </>
  );
}
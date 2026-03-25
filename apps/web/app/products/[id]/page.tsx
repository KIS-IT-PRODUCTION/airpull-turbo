import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/api';
import ProductGallery from '@/components/ui/ProductGallery';
import AddToCartButton from '@/components/ui/AddToCartButton';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.flatMap((p) => [
    { id: p.id },
    ...(p.slug ? [{ id: p.slug }] : []),
  ]);
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

  const canonicalUrl = `https://airpull.com.ua/product/${product.slug || product.id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const inStock = product.stock > 0;

  // --- ЛОГІКА ЗБОРУ ЗОБРАЖЕНЬ ---
  const productImages: string[] = [];
  
  if (product.imageUrl) {
    productImages.push(product.imageUrl);
  }

  const extraImages = (product as any).images;
  if (Array.isArray(extraImages)) {
    extraImages.forEach((img: any) => {
      const url = typeof img === 'string' ? img : img?.url;
      if (url && url !== product.imageUrl) {
        productImages.push(url);
      }
    });
  }
  const finalImages = productImages.length > 0 ? productImages : [];

  // --- ЛОГІКА ХАРАКТЕРИСТИК ---
  const dbSpecs = (product as any).specifications || [];

  // --- ВИТОНЧЕНИЙ КОМПОНЕНТ ШКАЛИ СМАКУ ---
  const hasTasteProfile = product.ice != null || product.sweet != null || product.sour != null;

  const renderTasteBar = (value: number, label: string, emoji: string, colorClass: string) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 w-24 shrink-0">
        <span className="text-sm leading-none">{emoji}</span>
        <span className="text-white/40 text-[10px] font-medium uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div 
            key={level} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              level <= value ? colorClass : 'bg-white/[0.04]'
            }`} 
          />
        ))}
      </div>
    </div>
  );

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
            {/* 1. ГАЛЕРЕЯ (Ліва колонка) */}
            <ProductGallery 
              images={finalImages} 
              productName={product.name} 
              inStock={inStock} 
            />

            {/* 2. ІНФОРМАЦІЯ ПРО ТОВАР (Права колонка) */}
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

              {/* === ОНОВЛЕНИЙ, ВИТОНЧЕНИЙ БЛОК: ПРОФІЛЬ СМАКУ === */}
              {hasTasteProfile && (
                <div className="mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Профіль смаку</h2>
                  </div>
                  {product.ice != null && renderTasteBar(product.ice, 'Холод', '❄️', 'bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.3)]')}
                  {product.sweet != null && renderTasteBar(product.sweet, 'Солодкість', '🍬', 'bg-pink-400/80 shadow-[0_0_8px_rgba(244,114,182,0.3)]')}
                  {product.sour != null && renderTasteBar(product.sour, 'Кислинка', '🍋', 'bg-lime-400/80 shadow-[0_0_8px_rgba(163,230,53,0.3)]')}
                </div>
              )}

              {/* Кнопки покупки та улюблених */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  }} 
                  inStock={inStock} 
                />
                
                {/* ЗМІНЕНО: Замість статичної кнопки використовуємо FavoriteButton */}
                <FavoriteButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    slug: product.slug,
                    stock: product.stock,
                  }} 
                />
              </div>

              {/* Переваги */}
              <ul className="space-y-3">
                {['🚀 Доставка 1–2 дні', '✅ 100% оригінал', '🔄 Повернення 14 днів', '💳 Оплата при отриманні'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">{item}</li>
                ))}
              </ul>
            </div>
          </div> 

          {/* 3. ХАРАКТЕРИСТИКИ */}
          <section className="mt-16 pt-16 border-t border-white/10">
            <h2 className="text-2xl font-black text-white mb-6">Характеристики</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Артикул</p>
                <p className="text-white font-semibold">{product.id.slice(0, 8).toUpperCase()}</p>
              </div>

              {Array.isArray(dbSpecs) && dbSpecs.map((spec: any, index: number) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    {spec.key || 'Характеристика'}
                  </p>
                  <p className="text-white font-semibold">{spec.value || '-'}</p>
                </div>
              ))}

              {(!dbSpecs || dbSpecs.length === 0) && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Наявність</p>
                    <p className="text-white font-semibold">{inStock ? 'Так' : 'Ні'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Доставка</p>
                    <p className="text-white font-semibold">Нова Пошта</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 4. CTA */}
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
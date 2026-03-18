import type { Metadata } from 'next';
import { getFeaturedProducts } from '@/lib/api';
import HeroSection from '@/components/sections/HeroSection';
import CatalogSection from '@/components/sections/CatalogSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ReviewsSection from '@/components/sections/ReviewsSection';

export const metadata: Metadata = {
  title: 'Airpull — Вейпи та електронні сигарети в Україні',
  description: 'Купити вейпи та електронні сигарети з доставкою по Україні. Великий вибір, оригінальна продукція, ціни від виробника. Замовляй зараз!',
  alternates: {
    canonical: 'https://airpull.com.ua',
  },
  openGraph: {
    title: 'Airpull — Вейпи та електронні сигарети в Україні',
    description: 'Великий вибір вейпів та рідин. Оригінальна продукція, швидка доставка по Україні.',
    url: 'https://airpull.com.ua',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Airpull — магазин вейпів' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Airpull',
  url: 'https://airpull.com.ua',
  description: 'Інтернет-магазин вейпів та електронних сигарет в Україні',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://airpull.com.ua/catalog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default async function HomePage() {
  const products = await getFeaturedProducts(4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <CatalogSection products={products} />
      <FeaturesSection />
      <ReviewsSection />
    </>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  metadataBase: new URL('https://airpull-turbo-web.vercel.app'),
  title: {
    default: 'Airpull — Вейпи, Pod-системи та рідини в Україні',
    template: '%s | Airpull', // %s буде замінено на назву сторінки
  },
  description: 'Інтернет-магазин вейпінгу Airpull. Купити електронні сигарети, рідини, картриджі та аксесуари. Оригінальні товари, швидка доставка по всій Україні.',
  keywords: ['вейп', 'купити вейп', 'електронні сигарети', 'pod системи', 'рідина для вейпу', 'сольова рідина', 'одноразки', 'Airpull', 'Україна'],
  openGraph: {
    siteName: 'Airpull',
    locale: 'uk_UA',
    type: 'website',
    url: 'https://airpull-turbo-web.vercel.app',
    images: [
      {
        url: '/og-home.jpg', // Зроби красиву картинку 1200x630px і поклади в папку public
        width: 1200,
        height: 630,
        alt: 'Airpull Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Airpull — Вейпи та рідини',
    description: 'Оригінальні товари для вейпінгу зі швидкою доставкою.',
    images: ['/og-home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo_0.svg',
    shortcut: '/logo_0.svg',
    apple: '/logo_0.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-black text-white antialiased">
        <Header />
        <CartDrawer />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
            },
            success: {
              iconTheme: {
                primary: '#a855f7',
                secondary: '#fff',
              },
            },
          }} 
        />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
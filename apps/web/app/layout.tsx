import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  metadataBase: new URL('https://airpull.com.ua'),
  title: {
    default: 'Airpull — Вейпи та рідини з доставкою по Україні',
    template: '%s | Airpull',
  },
  description: 'Купити вейпи, електронні сигарети та рідини в Україні. Оригінальні товари, швидка доставка, ціни від виробника.',
  openGraph: {
    siteName: 'Airpull',
    locale: 'uk_UA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
    icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
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
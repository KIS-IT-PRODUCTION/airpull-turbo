import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PromotionsClient from './PromotionsClient';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Акції та Знижки | Admin Panel',
};

// Функція завантаження акцій
async function getPromotions(token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promotions`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Помилка завантаження акцій:', error);
    return [];
  }
}

// Функція завантаження всіх товарів
async function getAllProducts(token: string) {
  try {
    const res = await fetch('http://localhost:4004/products', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Помилка завантаження товарів:', error);
    return [];
  }
}

export default async function PromotionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  // Завантажуємо дані паралельно, щоб сторінка відкривалася швидше
  const [initialPromotions, allProducts] = await Promise.all([
    getPromotions(token),
    getAllProducts(token)
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Акції та Знижки
          </h1>
          <p className="text-white/50 font-medium">
            Управління масовими розпродажами та спецпропозиціями
          </p>
        </div>
        
        <Link 
          href="/admin/promotions/create"
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-600/20 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Створити акцію
        </Link>
      </div>

      {/* Головний клієнтський компонент з таблицею та модалкою */}
      <PromotionsClient 
        initialPromotions={initialPromotions} 
        allProducts={allProducts} 
        token={token} 
      />
    </div>
  );
}
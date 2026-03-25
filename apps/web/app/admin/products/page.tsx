import Link from 'next/link';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types/product';
import AdminProductList from '@/components/admin/AdminProductList'; 

export default async function AdminProductsPage() {
  // Отримуємо товари на сервері
  const products: Product[] = await getProducts();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Шапка (залишається незмінною) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1a1a1a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Керування товарами</h1>
          <p className="text-white/40 mt-1 text-sm">Всього товарів: {products.length}</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Додати товар
        </Link>
      </div>

      {/* Клієнтський компонент з фільтрами та списком */}
      <AdminProductList initialProducts={products} />
      
    </div>
  );
}
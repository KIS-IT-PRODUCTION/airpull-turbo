import Link from 'next/link';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types/product';

export default async function AdminProductsPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Шапка */}
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

      {/* Список товарів */}
      <div className="grid grid-cols-1 gap-3">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-white/10 border-dashed">
            <p className="text-white/50 mb-4">У вас ще немає жодного товару</p>
            <Link href="/admin/products/new" className="text-emerald-500 hover:text-emerald-400 font-medium">
              Створити перший товар →
            </Link>
          </div>
        ) : (
          products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-[#1a1a1a] border border-white/5 hover:border-white/20 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:bg-white/[0.03]"
            >
              
              {/* Інформація про товар */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <img 
                    src={product.imageUrl || '/placeholder.png'} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={product.name} 
                  />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="px-2.5 py-1 bg-white/10 text-white/90 rounded-lg text-xs font-medium tracking-wide">
                      {product.price} ₴
                    </span>
                    
                    {/* Динамічний бейдж для складу */}
                    {product.stock > 10 ? (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                        Склад: {product.stock}
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium">
                        Залишилось: {product.stock}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium">
                        Немає в наявності
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Кнопки дій */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <Link 
                  href={`/admin/products/edit/${product.id}`}
                  className="p-2.5 text-white/40 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 rounded-xl transition-colors"
                  title="Редагувати"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </Link>
                <DeleteProductButton id={product.id} />
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
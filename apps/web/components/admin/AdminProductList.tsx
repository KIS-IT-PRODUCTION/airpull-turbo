'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import type { Product } from '@/types/product';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'newest';

export interface Filters {
  category: string;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  sort: SortOption;
}

const CATEGORIES = [
  { id: 'all', label: 'Всі товари' },
  {
    id: 'liquid', label: 'Рідини',
    sub: [
      { id: 'chaser', label: 'Chaser' }, { id: 'elfliq', label: 'Elfliq' },
      { id: 'nova', label: 'Nova' }, { id: 'flavorlab', label: 'Flavorlab' },
      { id: 'octobar', label: 'Octobar' }, { id: 'inked', label: 'Inked' },
    ],
  },
  {
    id: 'pod', label: 'POD Системи',
    sub: [
      { id: 'vaporesso', label: 'Vaporesso' }, { id: 'voopoo', label: 'Voopoo' },
      { id: 'elf_bar', label: 'Elf Bar' }, { id: 'smok', label: 'Smok' },
    ],
  },
  {
    id: 'cartridge', label: 'Картриджі',
    sub: [
      { id: 'cartridge_vaporesso', label: 'Для Vaporesso' }, { id: 'cartridge_voopoo', label: 'Для Voopoo' },
      { id: 'cartridge_xros', label: 'Серія XROS' }, { id: 'coil', label: 'Випарники' },
    ],
  },
  {
    id: 'accessories', label: 'Аксесуари',
    sub: [
      { id: 'battery', label: 'Акумулятори' }, { id: 'charger', label: 'Зарядні пристрої' },
      { id: 'case', label: 'Чохли та шнурки' },
    ],
  },
];

interface AdminProductListProps {
  initialProducts: Product[];
}

export default function AdminProductList({ initialProducts }: AdminProductListProps) {
  // Визначаємо максимальну ціну
  const absoluteMaxPrice = useMemo(() => {
    if (!initialProducts.length) return 1000;
    // Округлюємо до сотень, як у твоєму коді на фронті
    return Math.ceil(Math.max(...initialProducts.map((p) => p.price)) / 100) * 100;
  }, [initialProducts]);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priceMin: 0,
    priceMax: absoluteMaxPrice,
    inStockOnly: false,
    sort: 'newest',
  });

  const updateFilters = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = () => {
    setSearch('');
    setFilters({ category: 'all', priceMin: 0, priceMax: absoluteMaxPrice, inStockOnly: false, sort: 'newest' });
  };

  // РОЗУМНА ФІЛЬТРАЦІЯ (Адаптована під твою логіку)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Пошук
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) || 
        (p.description?.toLowerCase() || '').includes(lowerSearch)
      );
    }

    // 2. Категорія (Точно як у тебе на фронті)
    if (filters.category !== 'all') {
      const catId = filters.category;
      const isMainCategory = ['liquid', 'pod', 'cartridge', 'accessories'].includes(catId);

      result = result.filter((p) => {
        if (isMainCategory) {
          // Якщо це головна категорія (liquid, pod...)
          return (p as any).category?.toLowerCase() === catId;
        } else {
          // Якщо це підкатегорія (chaser, vaporesso...) шукаємо в бренді або назві
          const brandMatch = (p as any).brand?.toLowerCase() === catId;
          const nameMatch = p.name.toLowerCase().includes(catId.replace('_', ' '));
          return brandMatch || nameMatch;
        }
      });
    }

    // 3. Ціна
    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

    // 4. Наявність
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // 5. Сортування
    result.sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price;
      if (filters.sort === 'price_desc') return b.price - a.price;
      if (filters.sort === 'newest') {
        return (a.createdAt && b.createdAt) ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0;
      }
      return 0;
    });

    return result;
  }, [initialProducts, search, filters]);

  const hasActiveFilters = filters.category !== 'all' || filters.inStockOnly || filters.priceMin > 0 || filters.priceMax < absoluteMaxPrice || filters.sort !== 'newest';

  return (
    <div className="space-y-4">
      
      {/* 🔍 ПАНЕЛЬ ПОШУКУ ТА КНОПКА ФІЛЬТРІВ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Пошук товару за назвою..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-[#1a1a1a] text-white/70 border border-white/10 hover:bg-white/5'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Фільтри
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span>}
        </button>
      </div>

      {/* 🎛 КОМПАКТНА ПАНЕЛЬ ФІЛЬТРІВ */}
      {showFilters && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider pl-1">Категорія</label>
            <select 
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none [&>optgroup]:bg-[#1a1a1a] [&>option]:bg-[#1a1a1a]"
            >
              <option value="all">Всі товари</option>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                cat.sub ? (
                  <optgroup key={cat.id} label={cat.label}>
                    <option value={cat.id}>Всі {cat.label.toLowerCase()}</option>
                    {cat.sub.map(sub => (
                      <option key={sub.id} value={sub.id}>— {sub.label}</option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                )
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider pl-1">Сортування</label>
            <select 
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none [&>option]:bg-[#1a1a1a]"
            >
              <option value="newest">Новинки</option>
              <option value="price_asc">Найдешевші</option>
              <option value="price_desc">Найдорожчі</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider pl-1">Ціна (₴)</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" min="0" placeholder="Від" value={filters.priceMin || ''}
                onChange={(e) => updateFilters({ priceMin: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-white/30">-</span>
              <input 
                type="number" min="0" placeholder="До" value={filters.priceMax === absoluteMaxPrice ? '' : filters.priceMax}
                onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : absoluteMaxPrice })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 pb-0.5">
          <label 
            onClick={(e) => {
              e.preventDefault(); 
              updateFilters({ inStockOnly: !filters.inStockOnly });
            }}
            className="flex items-center justify-between cursor-pointer group bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
          >
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">В наявності</span>
            <div className={`w-9 h-5 rounded-full transition-colors duration-300 relative ${filters.inStockOnly ? 'bg-emerald-500' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${filters.inStockOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </label>
            
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-sm text-red-400 hover:text-red-300 font-medium text-right w-full">
                Скинути фільтри
              </button>
            )}
          </div>

        </div>
      )}

      {/* 📦 СПИСОК ТОВАРІВ */}
      <div className="mt-6 flex justify-between items-center px-1">
        <p className="text-sm text-white/50">Знайдено: <span className="text-white font-medium">{filteredProducts.length}</span></p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-white/10 border-dashed">
            <p className="text-white/50 mb-4">За вашим запитом нічого не знайдено</p>
            <button onClick={resetFilters} className="text-emerald-500 hover:text-emerald-400 font-medium">Очистити фільтри</button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="group bg-[#1a1a1a] border border-white/5 hover:border-white/20 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:bg-white/[0.03]">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <img src={product.imageUrl || '/placeholder.png'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="px-2.5 py-1 bg-white/10 text-white/90 rounded-lg text-xs font-medium">{product.price} ₴</span>
                    
                    {product.stock > 10 ? (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">Склад: {product.stock}</span>
                    ) : product.stock > 0 ? (
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium">Залишилось: {product.stock}</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium">Немає в наявності</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <Link href={`/admin/products/edit/${product.id}`} className="p-2.5 text-white/40 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 rounded-xl transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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
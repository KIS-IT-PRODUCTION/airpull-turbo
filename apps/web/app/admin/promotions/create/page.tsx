'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import type { Product } from '@/types/product';

// Твій каталог категорій
const CATEGORIES = [
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

export default function CreatePromotionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [error, setError] = useState('');

  // Стейт форми
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'PERCENTAGE',
    value: '',
    scope: 'all' as 'all' | 'categories' | 'specific', // Нове поле для логіки інтерфейсу
    selectedCategories: [] as string[],
    selectedProductIds: [] as string[],
  });

  // Завантажуємо товари для вибору
  useEffect(() => {
    const fetchProducts = async () => {
      const token = getCookie('auth-token');
      try {
        const res = await fetch('http://localhost:4004/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Помилка завантаження товарів", err);
      }
    };
    fetchProducts();
  }, []);

  // Фільтрація товарів для списку вибору
  const searchedProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    const s = productSearch.toLowerCase();
    return allProducts.filter(p => p.name.toLowerCase().includes(s)).slice(0, 8);
  }, [allProducts, productSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = getCookie('auth-token');

    try {
      const res = await fetch('http://localhost:4004/admin/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          discountType: formData.discountType,
          value: Number(formData.value),
          applyToAll: formData.scope === 'all',
          categories: formData.scope === 'categories' ? formData.selectedCategories : [],
          productIds: formData.scope === 'specific' ? formData.selectedProductIds : [],
        }),
      });

      if (!res.ok) throw new Error('Помилка при створенні');
      router.push('/admin/promotions');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id]
    }));
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(id)
        ? prev.selectedProductIds.filter(p => p !== id)
        : [...prev.selectedProductIds, id]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/promotions" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 transition-all">← Назад</Link>
        <h1 className="text-2xl font-bold text-white">Нова акція</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ЛІВА КОЛОНКА: Основні дані */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-white/40 uppercase">Основне</h3>
            <div>
              <label className="text-xs text-white/50 block mb-1.5 pl-1">Назва акції</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-violet-500 transition-all" placeholder="Чорна п'ятниця" />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1.5 pl-1">Тип знижки</label>
              <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none">
                <option value="PERCENTAGE">Відсоток (%)</option>
                <option value="FIXED">Фіксована (₴)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1.5 pl-1">Значення</label>
              <input type="number" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-violet-500 transition-all" placeholder="15" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-lg shadow-violet-600/20 transition-all">
            {isLoading ? 'Зачекайте...' : 'Створити акцію'}
          </button>
        </div>

        {/* ПРАВА КОЛОНКА: Вибір товарів */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-lg font-medium text-white">На які товари діє?</h3>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Всі товари', icon: '🌍' },
                { id: 'categories', label: 'Категорії', icon: '📂' },
                { id: 'specific', label: 'Обрані товари', icon: '🎯' }
              ].map(opt => (
                <button key={opt.id} type="button" onClick={() => setFormData({ ...formData, scope: opt.id as any })} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${formData.scope === opt.id ? 'bg-violet-600 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'}`}>
                  <span>{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>

            {/* Группи категорій (твій каталог) */}
            {formData.scope === 'categories' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                {CATEGORIES.map(group => (
                  <div key={group.id} className="space-y-2">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">{group.label}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {group.sub.map(sub => (
                        <button key={sub.id} type="button" onClick={() => toggleCategory(sub.id)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.selectedCategories.includes(sub.id) ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10'}`}>
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Вибір конкретних товарів */}
            {formData.scope === 'specific' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="text" 
                  placeholder="Шукати товар за назвою..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500"
                />
                
                {searchedProducts.length > 0 && (
                  <div className="bg-black/20 border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
                    {searchedProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 hover:bg-white/5">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} className="w-8 h-8 rounded object-cover" />
                          <span className="text-sm text-white/80">{p.name}</span>
                        </div>
                        <button type="button" onClick={() => toggleProduct(p.id)} className={`px-3 py-1 rounded-lg text-xs ${formData.selectedProductIds.includes(p.id) ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {formData.selectedProductIds.includes(p.id) ? 'Прибрати' : 'Додати'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-white/30 w-full mb-1 uppercase font-bold tracking-widest">Обрано ({formData.selectedProductIds.length}):</p>
                  {formData.selectedProductIds.map(id => {
                    const p = allProducts.find(item => item.id === id);
                    return (
                      <div key={id} className="flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 px-2 py-1 rounded-lg text-xs">
                        {p?.name}
                        <button type="button" onClick={() => toggleProduct(id)} className="hover:text-white">✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
'use client';

import { useCallback } from 'react';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'newest';
export type CategoryOption = 'all' | 'vape' | 'liquid' | 'accessories';

export interface Filters {
  category: CategoryOption;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  sort: SortOption;
}

interface CatalogFiltersProps {
  filters: Filters;
  maxPrice: number;
  onChange: (filters: Filters) => void;
}

const CATEGORIES: { value: CategoryOption; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'vape', label: 'Вейпи' },
  { value: 'liquid', label: 'Рідини' },
  { value: 'accessories', label: 'Аксесуари' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'За замовчуванням' },
  { value: 'price_asc', label: 'Ціна: дешевше' },
  { value: 'price_desc', label: 'Ціна: дорожче' },
  { value: 'newest', label: 'Новинки' },
];

export default function CatalogFilters({ filters, maxPrice, onChange }: CatalogFiltersProps) {
  const set = useCallback(
    (patch: Partial<Filters>) => onChange({ ...filters, ...patch }),
    [filters, onChange],
  );

  return (
    <aside aria-label="Фільтри каталогу" className="w-full lg:w-64 shrink-0">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-6 sticky top-20">

        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Фільтри</h2>
          <button
            onClick={() =>
              onChange({ category: 'all', priceMin: 0, priceMax: maxPrice, inStockOnly: false, sort: 'default' })
            }
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            Скинути
          </button>
        </div>

        {/* Категорія */}
        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Категорія</legend>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => set({ category: cat.value })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === cat.value
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Ціновий діапазон */}
        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Ціна, ₴</legend>
          <div className="flex items-center justify-between text-sm text-white/70 mb-3">
            <span>{filters.priceMin.toLocaleString('uk-UA')} ₴</span>
            <span>{filters.priceMax.toLocaleString('uk-UA')} ₴</span>
          </div>

          {/* Min slider */}
          <div className="relative mb-2">
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={filters.priceMin}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < filters.priceMax) set({ priceMin: val });
              }}
              aria-label="Мінімальна ціна"
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-violet-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-track]:bg-white/10
                [&::-webkit-slider-track]:rounded-full"
              style={{
                background: `linear-gradient(to right, #7c3aed ${(filters.priceMin / maxPrice) * 100}%, rgba(255,255,255,0.1) ${(filters.priceMin / maxPrice) * 100}%)`,
              }}
            />
          </div>

          {/* Max slider */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={filters.priceMax}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > filters.priceMin) set({ priceMax: val });
              }}
              aria-label="Максимальна ціна"
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-pink-500
                [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.1) ${(filters.priceMax / maxPrice) * 100}%, #ec4899 ${(filters.priceMax / maxPrice) * 100}%)`,
              }}
            />
          </div>
        </fieldset>

        {/* Наявність */}
        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Наявність</legend>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set({ inStockOnly: !filters.inStockOnly })}
              className={`w-10 h-5 rounded-full transition-all duration-200 relative cursor-pointer ${
                filters.inStockOnly ? 'bg-violet-500' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                  filters.inStockOnly ? 'left-5' : 'left-0.5'
                }`}
              />
            </div>
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">
              Тільки в наявності
            </span>
          </label>
        </fieldset>

        {/* Сортування */}
        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Сортування</legend>
          <div className="flex flex-col gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set({ sort: opt.value })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.sort === opt.value
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
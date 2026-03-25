'use client';

import { useCallback, useState } from 'react';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'newest';

export interface Filters {
  category: string;
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

const CATEGORIES = [
  { id: 'all', label: 'Всі товари' },
  {
    id: 'liquid',
    label: 'Рідини',
    sub: [
      { id: 'chaser', label: 'Chaser' },
      { id: 'elfliq', label: 'Elfliq' },
      { id: 'nova', label: 'Nova' },
      { id: 'flavorlab', label: 'Flavorlab' },
      { id: 'octobar', label: 'Octobar' },
      { id: 'inked', label: 'Inked' },
    ],
  },
  {
    id: 'pod',
    label: 'POD Системи',
    sub: [
      { id: 'vaporesso', label: 'Vaporesso' },
      { id: 'voopoo', label: 'Voopoo' },
      { id: 'elf_bar', label: 'Elf Bar' },
      { id: 'smok', label: 'Smok' },
    ],
  },
  {
    id: 'cartridge',
    label: 'Картриджі',
    sub: [
      { id: 'cartridge_vaporesso', label: 'Для Vaporesso' },
      { id: 'cartridge_voopoo', label: 'Для Voopoo' },
      { id: 'cartridge_xros', label: 'Серія XROS' },
      { id: 'coil', label: 'Випарники' },
    ],
  },
  {
    id: 'accessories',
    label: 'Аксесуари',
    sub: [
      { id: 'battery', label: 'Акумулятори' },
      { id: 'charger', label: 'Зарядні пристрої' },
      { id: 'case', label: 'Чохли та шнурки' },
    ],
  },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'За замовчуванням' },
  { value: 'price_asc', label: 'Ціна: дешевше' },
  { value: 'price_desc', label: 'Ціна: дорожче' },
  { value: 'newest', label: 'Новинки' },
];

export default function CatalogFilters({ filters, maxPrice, onChange }: CatalogFiltersProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const set = useCallback(
    (patch: Partial<Filters>) => onChange({ ...filters, ...patch }),
    [filters, onChange],
  );

  const toggleCategory = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <aside aria-label="Фільтри каталогу" className="w-full lg:w-64 shrink-0">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-6 sticky top-20">
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

        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Категорія</legend>
          <div className="flex flex-col gap-1.5">
            {CATEGORIES.map((cat) => {
              const hasSub = cat.sub && cat.sub.length > 0;
              const isExpanded = expanded[cat.id];
              const isActive = filters.category === cat.id || cat.sub?.some((s) => s.id === filters.category);

              if (!hasSub) {
                return (
                  <button
                    key={cat.id}
                    onClick={() => set({ category: cat.id })}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      filters.category === cat.id
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              }

              return (
                <div key={cat.id} className="flex flex-col">
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {cat.label}
                    <svg
                      className={`w-4 h-4 text-white/40 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="flex flex-col gap-1 pl-3 pr-1 py-1 border-l border-white/10 ml-4">
                      <button
                        onClick={() => set({ category: cat.id })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.category === cat.id
                            ? 'text-violet-400 font-semibold bg-violet-500/10'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Всі {cat.label.toLowerCase()}
                      </button>
                      
                      {cat.sub?.map((subCat) => (
                        <button
                          key={subCat.id}
                          onClick={() => set({ category: subCat.id })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            filters.category === subCat.id
                              ? 'text-violet-400 font-semibold bg-violet-500/10'
                              : 'text-white/50 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {subCat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Ціна, ₴</legend>
          <div className="flex items-center justify-between text-sm text-white/70 mb-4 font-medium">
            <span className="bg-white/5 px-2 py-1 rounded-md">{formatPrice(filters.priceMin)}</span>
            <span className="bg-white/5 px-2 py-1 rounded-md">{formatPrice(filters.priceMax)}</span>
          </div>

          <div className="relative mb-3">
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={filters.priceMin}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < filters.priceMax) set({ priceMin: val });
              }}
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-violet-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-track]:bg-white/10"
              style={{
                background: `linear-gradient(to right, #7c3aed ${(filters.priceMin / maxPrice) * 100}%, rgba(255,255,255,0.1) ${(filters.priceMin / maxPrice) * 100}%)`,
              }}
            />
          </div>

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

        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Наявність</legend>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set({ inStockOnly: !filters.inStockOnly })}
              className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                filters.inStockOnly ? 'bg-gradient-to-r from-violet-500 to-pink-500' : 'bg-white/10 group-hover:bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  filters.inStockOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              Тільки в наявності
            </span>
          </label>
        </fieldset>

        <fieldset>
          <legend className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Сортування</legend>
          <div className="flex flex-col gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set({ sort: opt.value })}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filters.sort === opt.value
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 shadow-sm shadow-pink-500/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
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
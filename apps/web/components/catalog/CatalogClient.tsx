'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/types/product';
import CatalogFilters, { type Filters } from './CatalogFilters';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const PAGE_SIZE = 24;

interface CatalogClientProps {
  products: Product[];
}

export default function CatalogClient({ products }: CatalogClientProps) {
  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price), 1000) / 100) * 100,
    [products],
  );

  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priceMin: 0,
    priceMax: maxPrice,
    inStockOnly: false,
    sort: 'default',
  });

  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Фільтрація та сортування
  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.category !== 'all') {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.category) ||
        p.description?.toLowerCase().includes(filters.category),
      );
    }

    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax,
    );

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // скидаємо на першу сторінку при зміні фільтрів
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">

      {/* Мобільна кнопка фільтрів */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          aria-expanded={mobileFiltersOpen}
          aria-label="Відкрити фільтри"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          Фільтри
          {(filters.category !== 'all' || filters.inStockOnly || filters.sort !== 'default') && (
            <span className="w-2 h-2 bg-violet-400 rounded-full" />
          )}
        </button>

        {mobileFiltersOpen && (
          <div className="mt-4">
            <CatalogFilters filters={filters} maxPrice={maxPrice} onChange={handleFilterChange} />
          </div>
        )}
      </div>

      {/* Десктоп фільтри */}
      <div className="hidden lg:block">
        <CatalogFilters filters={filters} maxPrice={maxPrice} onChange={handleFilterChange} />
      </div>

      {/* Основний контент */}
      <div className="flex-1 min-w-0">

        {/* Рядок результатів */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/50 text-sm">
            Знайдено:{' '}
            <span className="text-white font-semibold">{filtered.length}</span> товарів
          </p>
          <p className="text-white/30 text-xs">
            Сторінка {page} з {totalPages || 1}
          </p>
        </div>

        {/* Сітка товарів */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-white/10 rounded-2xl">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-white/50 text-lg font-medium">Товарів не знайдено</p>
            <p className="text-white/30 text-sm mt-1">Спробуй змінити фільтри</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Пагінація */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
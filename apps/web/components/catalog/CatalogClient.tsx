'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Product } from '@/types/product';
import CatalogFilters, { type Filters } from './CatalogFilters';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const PAGE_SIZE = 24;

interface CatalogClientProps {
  products: Product[];
}

export default function CatalogClient({ products }: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...(products.length ? products.map((p) => p.price) : [1000])) / 100) * 100,
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedFilters = sessionStorage.getItem('catalog-filters');
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (e) {}
    }

    const savedPage = sessionStorage.getItem('catalog-page');
    if (savedPage) {
      setPage(Number(savedPage));
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem('catalog-filters', JSON.stringify(filters));
    }
  }, [filters, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem('catalog-page', page.toString());
    }
  }, [page, isHydrated]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery)
      );
    }

    if (filters.category !== 'all') {
      const catId = filters.category;
      
      const isMainCategory = ['liquid', 'pod', 'cartridge', 'accessories'].includes(catId);

      result = result.filter((p) => {
        if (isMainCategory) {
          return p.category?.toLowerCase() === catId;
        } else {
          return (
            p.brand?.toLowerCase() === catId || 
            p.name.toLowerCase().includes(catId.replace('_', ' '))
          );
        }
      });
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
  }, [products, filters, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); 
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          aria-expanded={mobileFiltersOpen}
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

      <div className="hidden lg:block">
        <CatalogFilters filters={filters} maxPrice={maxPrice} onChange={handleFilterChange} />
      </div>

      <div className="flex-1 min-w-0">
        {searchQuery && (
          <div className="mb-6 flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 px-4 py-3 rounded-xl inline-flex">
            <span className="text-violet-300 text-sm font-medium">
              Результати для: <span className="text-white font-bold">&quot;{searchQuery}&quot;</span>
            </span>
            <button 
              onClick={clearSearch}
              className="text-violet-400 hover:text-white transition-colors bg-violet-500/20 hover:bg-violet-500/40 rounded-full p-1"
              aria-label="Скинути пошук"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-white/50 text-sm">
            Знайдено: <span className="text-white font-semibold">{filtered.length}</span> товарів
          </p>
          <p className="text-white/30 text-xs">
            Сторінка {page} з {totalPages || 1}
          </p>
        </div>

        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-white/10 rounded-2xl">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-white/50 text-lg font-medium">
              {searchQuery ? 'За вашим запитом нічого не знайдено' : 'Товарів не знайдено'}
            </p>
            <p className="text-white/30 text-sm mt-1">Спробуйте змінити фільтри або пошуковий запит</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
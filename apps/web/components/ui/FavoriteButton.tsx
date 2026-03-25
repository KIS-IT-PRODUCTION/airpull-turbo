'use client';

import { useEffect, useState } from 'react';
import { useFavoritesStore, FavoriteItem } from '@/lib/useFavoritesStore'; // Перевір шлях

export default function FavoriteButton({ product }: { product: FavoriteItem }) {
  // Запобігаємо помилці Hydration Mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Скелетон кнопки до завантаження клієнтського стейту
    return (
      <button className="px-5 py-4 rounded-2xl font-bold text-white/60 border border-white/10 transition-all">
        ♡
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleFavorite(product)}
      className={`px-5 py-4 rounded-2xl font-bold transition-all border ${
        isFavorite 
          ? 'text-pink-500 border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.2)]' 
          : 'text-white/60 border-white/10 hover:border-white/30 hover:text-white'
      }`}
      aria-label={isFavorite ? "Видалити з улюблених" : "Додати в улюблені"}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  );
}
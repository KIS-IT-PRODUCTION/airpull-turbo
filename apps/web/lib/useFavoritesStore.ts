import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  slug?: string;
  stock: number;
}

interface FavoritesStore {
  items: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleFavorite: (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((i) => i.id === item.id);
        
        if (exists) {
          set({ items: currentItems.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      
      isFavorite: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'airpull-favorites',
    }
  )
);
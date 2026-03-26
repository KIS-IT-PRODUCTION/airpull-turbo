export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  slug?: string;
  stock: number;
}

 export interface FavoritesStore {
  items: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
}

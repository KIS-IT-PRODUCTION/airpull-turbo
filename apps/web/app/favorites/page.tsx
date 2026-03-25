import { Metadata } from 'next';
import FavoritesList from './FavoritesList';

export const metadata: Metadata = {
  title: 'Улюблені товари | Airpull',
  description: 'Список ваших улюблених товарів в магазині Airpull.',
};

export default function FavoritesPage() {
  return (
    <main className="bg-black min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Улюблені</h1>
        <p className="text-white/50 text-sm mb-10">Товари, які ви зберегли для себе</p>
        
        <FavoritesList />
      </div>
    </main>
  );
}
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💨</span>
          <span className="text-xl font-black text-white">
            Air<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">pull</span>
          </span>
        </div>
        <p className="text-white/40 text-sm">© 2026 Airpull. Всі права захищені.</p>
        <div className="flex gap-6">
          <Link href="/catalog" className="text-sm text-white/50 hover:text-white transition-colors">Каталог</Link>
          <Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">Про нас</Link>
        </div>
      </div>
    </footer>
  );
}

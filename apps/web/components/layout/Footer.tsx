import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Декоративне світіння на фоні */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Блок з Логотипом та описом */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <Image src="/logo.svg" alt="AirPull" width={300} height={100} className="h-10 sm:h-12 w-auto object-contain" priority />

            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Твій преміальний простір вейпінгу. Оригінальна продукція, кращі смаки та швидка доставка по всій Україні.
            </p>
          </div>

          {/* Навігація 1 */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Каталог</h3>
            <ul className="space-y-3">
              <li><Link href="/catalog?category=pods" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Pod-системи</Link></li>
              <li><Link href="/catalog?category=liquids" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Рідини</Link></li>
              <li><Link href="/catalog?category=disposables" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Одноразові</Link></li>
              <li><Link href="/catalog?category=sale" className="text-white/50 hover:text-pink-400 text-sm transition-colors">Акції</Link></li>
            </ul>
          </div>

          {/* Навігація 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Клієнтам</h3>
            <ul className="space-y-3">
              <li><Link href="/delivery" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Оплата і доставка</Link></li>
              <li><Link href="/about" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Про нас</Link></li>
              <li><Link href="/contacts" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Контакти</Link></li>
              <li><Link href="/faq" className="text-white/50 hover:text-violet-400 text-sm transition-colors">Часті питання</Link></li>
            </ul>
          </div>

          {/* Підписка / Соцмережі */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Будь в курсі</h3>
            <p className="text-white/50 text-sm mb-4">Отримуй знижки та новинки першим.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Твій email" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 w-full transition-colors"
              />
              <button className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Нижній рядок */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Airpull. Всі права захищені.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <Link href="/terms" className="hover:text-white transition-colors">Умови використання</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Політика конфіденційності</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
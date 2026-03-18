'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { getUser, removeAuthCookie } from '@/app/actions/auth';
import CartButton from '@/components/ui/CartButton';

const navLinks = [
  { href: '/', label: 'Головна' },
  { href: '/about', label: 'Про нас' },
];

interface UserData {
  sub: string;
  phone: string;
  name?: string; 
  role: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, [pathname]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await removeAuthCookie();
    setUser(null);
    setProfileMenuOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🚀 Змінено: relative для абсолютного позиціонування центру */}
        <div className="flex items-center justify-between h-16 relative">
          
          {/* 1. ЛІВА ЧАСТИНА: Логотип + Навігація */}
          <div className="flex items-center gap-6 flex-1">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.svg"
                alt="AirPull"
                width={300}
                height={100}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* Головна навігація (Десктоп) */}
            <nav aria-label="Головна навігація" className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 2. ЦЕНТРАЛЬНА ЧАСТИНА: Кнопка "Каталог" (тільки Десктоп) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 justify-center">
            <Link
              href="/catalog"
              aria-label="Перейти до каталогу товарів"
              className="px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Каталог
            </Link>
          </div>

          {/* 3. ПРАВА ЧАСТИНА: Кошик + Профіль/Бургер */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
            
            {/* КНОПКА КОШИКА (Завжди видима) */}
            <CartButton />

            {/* Профіль (Десктоп) */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 p-[2px] hover:scale-105 transition-transform focus:outline-none shadow-lg shadow-pink-500/20"
                    aria-label="Меню профілю"
                  >
                    <div className="w-full h-full bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                  </button>

                  {/* Випадаюче меню профілю */}
                  {profileMenuOpen && (
                    <div className="absolute top-full mt-3 right-0 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col py-2">
                      <div className="px-4 py-3 border-b border-white/10 mb-1">
                        <p className="text-xs text-violet-400 uppercase tracking-wider font-semibold">Мій акаунт</p>
                        <p className="text-base text-white font-bold mt-1 truncate">{user.name || 'Користувач'}</p>
                        <p className="text-xs text-white/50 font-medium truncate mt-0.5">{user.phone}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">⚙️</span> Налаштування
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setProfileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">📦</span> Мої замовлення
                      </Link>
                      
                      <div className="h-px bg-white/10 my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">🚪</span> Вийти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Увійти
                </Link>
              )}
            </div>

            {/* Бургер для мобілки */}
            <button
              aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню (залишається без змін) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-black/95 backdrop-blur-xl border-b border-white/10 ${
          menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <nav aria-label="Мобільна навігація" className="px-4 pb-6 pt-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            href="/catalog"
            onClick={() => setMenuOpen(false)}
            className="mt-2 mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/20"
          >
            Каталог товарів
          </Link>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-1">
            {user ? (
              <>
                <div className="px-4 py-3 mb-2 border-b border-white/5">
                  <p className="text-xs text-violet-400 uppercase tracking-wider font-semibold">Мій акаунт</p>
                  <p className="text-base text-white font-bold mt-1">{user.name || 'Користувач'}</p>
                  <p className="text-xs text-white/50 font-medium mt-0.5">{user.phone}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <span className="text-lg">⚙️</span> Налаштування
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <span className="text-lg">📦</span> Мої замовлення
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left flex items-center gap-3"
                >
                  <span className="text-lg">🚪</span> Вийти
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
              >
                <span className="text-lg">👤</span> Увійти в акаунт
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
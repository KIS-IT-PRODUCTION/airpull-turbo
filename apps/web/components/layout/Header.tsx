'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { getUser, removeAuthCookie } from '@/app/actions/auth';
import { getSearchResults } from '@/app/actions/products';
import CartButton from '@/components/ui/CartButton';
import { useFavoritesStore } from '@/lib/useFavoritesStore';

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

interface SearchResult {
  id: string;
  name: string;
  price: number;
  slug?: string;
  images?: any[];
  imageUrl?: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const favoritesCount = useFavoritesStore((state) => state.items.length);

  // Перевірка, чи є користувач адміном (перевіряємо і великі, і маленькі літери)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    getUser().then(setUser);
  }, [pathname]);

  useEffect(() => {
    setIsCatalogLoading(false);
    setMenuOpen(false);
    setShowSearchOverlay(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowSearchOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearchOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showSearchOverlay]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      
      try {
        const results = await getSearchResults(searchQuery);
        setSearchResults(results || []);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = async () => {
    await removeAuthCookie();
    setUser(null);
    setProfileMenuOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchOverlay(false);
      setMenuOpen(false);
    }
  };

  const SearchOverlayContent = () => (
    <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl z-40 max-h-[85vh] flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 overflow-y-auto hide-scrollbar">
        {isSearching ? (
          <div className="py-12 flex flex-col justify-center items-center text-white/50">
            <svg className="animate-spin h-8 w-8 text-violet-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p>Шукаємо...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-4 font-semibold">Результати пошуку ({searchResults.length})</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item) => {
                const imgUrl = 
                  item.imageUrl || 
                  item.images?.[0]?.url || 
                  (typeof item.images?.[0] === 'string' ? item.images[0] : null);

                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug || item.id}`} 
                    onClick={() => { setShowSearchOverlay(false); setMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-violet-500/30 group"
                  >
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-white/30 overflow-hidden relative">
                      {imgUrl ? (
                         <img src={imgUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                         <span className="text-[10px] uppercase tracking-wider">Фото</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate group-hover:text-violet-300 transition-colors">{item.name}</h4>
                      <p className="text-sm text-violet-400 font-bold mt-1">{item.price} ₴</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleSearchSubmit} 
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
              >
                Показати всі результати
              </button>
            </div>
          </>
        ) : searchQuery.length >= 2 ? (
          <div className="py-12 text-center text-white/50">
            <p className="text-xl mb-2">😔</p>
            <p>За запитом &quot;{searchQuery}&quot; нічого не знайдено.</p>
            <p className="text-sm mt-2 text-white/30">Спробуйте змінити слова або пошукайте в каталозі.</p>
          </div>
        ) : (
           <div className="py-12 text-center text-white/40">
              <p>Введіть назву товару для пошуку...</p>
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={searchContainerRef} className="relative z-50">
      
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowSearchOverlay(false)} />
      )}

      {/* ЗМІНА: Зміна фону та рамки хедера, якщо це адмін */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors duration-500 border-b ${isAdmin ? 'bg-amber-950/90 border-amber-500/30' : 'bg-black/70 border-white/10'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 relative">
            
            <div className="flex items-center gap-4 xl:gap-6 shrink-0">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Image src="/logo.svg" alt="AirPull" width={300} height={100} className="h-10 sm:h-12 w-auto object-contain" priority />
                {/* ЗМІНА: Бейдж адміна біля логотипу */}
                {isAdmin && (
                  <span className="hidden sm:flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    Admin
                  </span>
                )}
              </Link>
              
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${pathname === link.href ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                    {link.label}
                  </Link>
                ))}
                
                <Link
                  href="/catalog"
                  onClick={(e) => { if (pathname === '/catalog') e.preventDefault(); else setIsCatalogLoading(true); }}
                  className={`ml-2 flex items-center justify-center min-w-[100px] px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isCatalogLoading ? 'bg-white/10 text-white/40 cursor-wait shadow-none' : 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-violet-500/20 active:scale-95'}`}
                >
                  {isCatalogLoading ? 'Чекаємо...' : 'Каталог'}
                </Link>
              </nav>
            </div>

            <div className="flex-1 flex justify-end lg:justify-center max-w-2xl px-1 sm:px-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[220px] sm:max-w-md group z-50">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 transition-colors ${isAdmin ? 'text-amber-500/40 group-focus-within:text-amber-400' : 'text-white/40 group-focus-within:text-violet-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length > 0) setShowSearchOverlay(true);
                  }}
                  onFocus={() => setShowSearchOverlay(true)}
                  placeholder="Пошук..."
                  className={`w-full transition-all duration-300 ease-in-out bg-white/5 border rounded-full py-2 pl-9 sm:pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/10 ${showSearchOverlay ? (isAdmin ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-violet-500/50 shadow-lg shadow-violet-500/10') : 'border-white/10'}`}
                />
              </form>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              <Link href="/favorites" className="relative p-2 text-white/70 hover:text-pink-400 transition-colors group hidden sm:flex">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isMounted && favoritesCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1 shadow-lg shadow-pink-500/30">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              
              <CartButton />

              <div className="hidden lg:block">
                {user ? (
                  <div className="relative" ref={profileMenuRef}>
                    {/* ЗМІНА: Аватарка має інші кольори для адміна */}
                    <button onClick={() => setProfileMenuOpen((prev) => !prev)} className={`w-10 h-10 rounded-full p-[2px] hover:scale-105 transition-transform shadow-lg ${isAdmin ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/20' : 'bg-gradient-to-tr from-violet-500 to-pink-500 shadow-pink-500/20'}`}>
                      <div className="w-full h-full bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-bold relative">
                        {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                      </div>
                    </button>
                    {profileMenuOpen && (
                      <div className={`absolute top-full mt-3 right-0 w-64 bg-black/95 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col py-2 z-50 ${isAdmin ? 'border-amber-500/30' : 'border-white/10'}`}>
                        <div className="px-4 py-3 border-b border-white/10 mb-1">
                          {/* ЗМІНА: Текст ролі */}
                          <p className={`text-xs uppercase font-semibold ${isAdmin ? 'text-amber-400' : 'text-violet-400'}`}>{isAdmin ? 'Адміністратор' : 'Мій акаунт'}</p>
                          <p className="text-base text-white font-bold mt-1 truncate">{user.name || 'Користувач'}</p>
                        </div>
                        
                        {/* ЗМІНА: Кнопка переходу в панель для адміна */}
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setProfileMenuOpen(false)} className="px-4 py-2.5 text-sm text-amber-400 font-medium hover:text-amber-300 hover:bg-amber-500/10 transition-colors">🛡️ Панель адміністратора</Link>
                        )}
                        
                        <Link href="/orders" onClick={() => setProfileMenuOpen(false)} className="px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">📦 Мої замовлення</Link>
                        
                        <Link href="/profile" onClick={() => setProfileMenuOpen(false)} className="px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">⚙️ Налаштування</Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1 border-t border-white/10 pt-3">🚪 Вийти</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Увійти</Link>
                )}
              </div>

              {/* Бургер меню для мобілки (іконка) */}
              <div className="lg:hidden flex items-center gap-2">
                 <button onClick={() => setMenuOpen((v) => !v)} className={`flex flex-col gap-1.5 p-2 rounded-lg transition-colors ${isAdmin ? 'hover:bg-amber-500/10' : 'hover:bg-white/10'}`}>
                  <span className={`block w-5 h-0.5 transition-all ${isAdmin ? 'bg-amber-400' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-5 h-0.5 transition-all ${isAdmin ? 'bg-amber-400' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 transition-all ${isAdmin ? 'bg-amber-400' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showSearchOverlay && <SearchOverlayContent />}

        {/* Мобільне меню розгорнуте */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-black/95 backdrop-blur-xl border-b ${menuOpen ? 'max-h-[800px] opacity-100 border-white/10' : 'max-h-0 opacity-0 border-transparent'}`}>
          <div className="px-4 pb-6 pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">{link.label}</Link>
            ))}

            <Link href="/favorites" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>♡</span>
                <span>Улюблені</span>
              </div>
              {isMounted && favoritesCount > 0 && (
                <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>
            
            <Link href="/catalog" onClick={() => { setIsCatalogLoading(true); setMenuOpen(false); }} className="mt-2 mb-4 flex justify-center items-center px-4 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/20">
              {isCatalogLoading ? 'Завантаження...' : 'Каталог товарів'}
            </Link>
            
            {user ? (
              <div className="mt-2 border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 px-4 mb-3">
                  {/* ЗМІНА: Мобільна аватарка адміна */}
                  <div className={`w-10 h-10 rounded-full p-[2px] ${isAdmin ? 'bg-gradient-to-tr from-amber-500 to-orange-500' : 'bg-gradient-to-tr from-violet-500 to-pink-500'}`}>
                    <div className="w-full h-full bg-black/80 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                  </div>
                  <div>
                    {/* ЗМІНА: Ім'я та бейдж */}
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      {user.name || 'Користувач'}
                      {isAdmin && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase tracking-widest">Admin</span>}
                    </p>
                    <p className="text-xs text-white/50">{user.phone}</p>
                  </div>
                </div>

                {/* ЗМІНА: Панель адміна в мобільному меню */}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl">🛡️ Панель адміністратора</Link>
                )}

                <Link href="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl">📦 Мої замовлення</Link>
                
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl">⚙️ Налаштування профілю</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl">Вийти з акаунта</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2 flex justify-center items-center px-4 py-3 rounded-xl text-sm font-medium text-white border border-white/10 hover:bg-white/5">
                Увійти в акаунт
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
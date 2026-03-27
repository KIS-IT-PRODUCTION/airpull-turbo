import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Фонові ефекти залишаємо без змін, вони круті */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* SEO оптимізований контент */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-8 backdrop-blur-md">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
          Вейп шоп №1 в Україні
        </div>

        {/* H1 максимально насичений ключовими словами, але звучить гарно */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-6">
         Відчуй{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400">
            різницю
          </span>
          <br />
          з Airpull 💨
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Купуй оригінальні <strong className="font-semibold text-white/80">електронні сигарети, Pod-системи, картриджі та рідини</strong>. Найкращі ціни, топові бренди (Elf Bar, Vaporesso, Voopoo) та швидка доставка по Києву і всій Україні.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/catalog"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            Відкрити каталог
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Чому обирають нас
          </Link>
        </div>

        {/* Статистика для довіри */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-20 pt-12 border-t border-white/5">
          {[
            { value: '1000+', label: 'Вейпів та рідин' },
            { value: '100%', label: 'Оригінальна якість' },
            { value: '24 год', label: 'Швидкість відправки' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-white/40 text-xs md:text-sm mt-2 font-medium uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
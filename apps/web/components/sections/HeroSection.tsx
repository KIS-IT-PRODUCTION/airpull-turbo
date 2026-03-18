import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Фонові градієнти */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Сітка фону */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Контент */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Доставка по всій Україні
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none mb-6">
          Відчуй{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400">
            різницю
          </span>
          <br />
          з Airpull 💨
        </h1>

        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
          Преміальні вейпи та електронні сигарети. Найкращі смаки, топова якість, швидка доставка.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-violet-500/30"
          >
            Переглянути каталог →
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 rounded-full font-bold text-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            Дізнатись більше
          </Link>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10">
          {[
            { value: '500+', label: 'Товарів' },
            { value: '10k+', label: 'Клієнтів' },
            { value: '4.9★', label: 'Рейтинг' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
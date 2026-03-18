import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Про нас — Airpull | Вейп магазин в Україні',
  description: 'Airpull — офіційний магазин вейпів та електронних сигарет. Працюємо з 2021 року, понад 10 000 задоволених клієнтів по всій Україні.',
  alternates: {
    canonical: 'https://airpull.com.ua/about',
  },
  openGraph: {
    title: 'Про нас — Airpull',
    description: 'Дізнайся більше про команду Airpull та нашу місію.',
    url: 'https://airpull.com.ua/about',
    images: [{ url: '/og-about.jpg', width: 1200, height: 630, alt: 'Команда Airpull' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Airpull',
  url: 'https://airpull.com.ua',
  logo: 'https://airpull.com.ua/logo.svg',
  description: 'Офіційний магазин вейпів та електронних сигарет в Україні',
  foundingDate: '2021',
  areaServed: 'UA',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Ukrainian',
  },
};

const stats = [
  { value: '10 000+', label: 'Задоволених клієнтів', icon: '👥' },
  { value: '500+', label: 'Товарів у каталозі', icon: '📦' },
  { value: '4', label: 'Роки на ринку', icon: '🏆' },
  { value: '24 / 7', label: 'Підтримка клієнтів', icon: '🎧' },
];

const reasons = [
  {
    icon: '✅',
    title: 'Тільки оригінали',
    description: 'Кожен товар має сертифікат якості. Ми працюємо виключно з офіційними дистриб\'юторами провідних брендів — ніякого контрафакту.',
  },
  {
    icon: '🚀',
    title: 'Доставка по всій Україні',
    description: 'Відправляємо Новою Поштою та УкрПоштою в будь-яке місто. Середній термін доставки — 1–2 дні після оплати.',
  },
  {
    icon: '💰',
    title: 'Ціни від виробника',
    description: 'Завдяки прямим договорам з постачальниками ми можемо пропонувати найкращі ціни на ринку без переплат.',
  },
  {
    icon: '🔄',
    title: 'Легке повернення',
      description: 'Якщо товар не підійшов — повернемо кошти або замінимо протягом 14 днів без зайвих запитань.',
  },
  {
    icon: '🎁',
    title: 'Програма лояльності',
    description: 'Накопичуй бонуси з кожної покупки та обмінюй їх на знижки. Постійні клієнти отримують до 15% кешбеку.',
  },
  {
    icon: '📱',
    title: 'Зручне замовлення',
    description: 'Замовляй через сайт, Instagram або Telegram. Менеджери завжди онлайн і допоможуть з вибором.',
  },
];

const team = [
  {
    name: 'Олексій Коваль',
    role: 'Засновник & CEO',
    emoji: '👨‍💼',
    description: 'Понад 5 років у vape-індустрії. Особисто тестує кожен новий продукт перед додаванням до каталогу.',
  },
  {
    name: 'Марина Сидоренко',
    role: 'Head of Sales',
    emoji: '👩‍💼',
    description: 'Відповідає за клієнтський сервіс та навчання команди. Завжди знає відповідь на твоє питання.',
  },
  {
    name: 'Дмитро Петренко',
    role: 'Logistics Manager',
    emoji: '🧑‍💼',
    description: 'Гарантує що твоє замовлення приїде вчасно і в ідеальному стані. Щодня обробляє сотні відправок.',
  },
];

const regions = [
  'Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро',
  'Запоріжжя', 'Вінниця', 'Полтава', 'Чернівці', 'Івано-Франківськ',
  'Тернопіль', 'Хмельницький', 'Житомир', 'Суми', 'Черкаси',
  'Кропивницький', 'Херсон', 'Миколаїв', 'Луцьк', 'Рівне',
  'Ужгород', 'Чернігів', 'Переяслав', 'Біла Церква', 'Бровари',
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-black min-h-screen">

        {/* ─── HERO ─── */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          {/* Фонові кулі */}
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">
              Про нас
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6">
              Ми —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400">
                Airpull
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              З 2021 року ми допомагаємо тисячам українців знайти свій ідеальний вейп.
              Якість, оригінальність і турбота про клієнта — це не просто слова, це наш щоденний стандарт.
            </p>
          </div>
        </section>

        {/* ─── МІСІЯ ─── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
                Наша місія
              </p>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                Зробити якісний вейп доступним для кожного
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                Airpull народився з простої ідеї: люди заслуговують на якісну продукцію за чесною ціною.
                Ринок був переповнений підробками та завищеними цінами — ми вирішили це змінити.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Сьогодні ми — один із найбільших онлайн-магазинів вейпів в Україні з власною командою
                експертів, які допоможуть тобі знайти саме те, що шукаєш.
              </p>
              <Link
                href="/catalog"
                aria-label="Перейти до каталогу товарів Airpull"
                className="inline-flex px-6 py-3 rounded-full font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
              >
                Переглянути каталог →
              </Link>
            </div>

            {/* Декоративний блок */}
            <div className="relative">
              <div className="bg-gradient-to-br from-violet-900/40 to-pink-900/30 border border-white/10 rounded-3xl p-8 space-y-4">
                {['🎯 Понад 500 перевірених товарів', '🛡️ 100% оригінальна продукція', '⚡ Доставка за 1–2 дні', '💬 Підтримка 24/7 в Telegram'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/80 font-medium">
                    <span>{item}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/40 text-sm">Заснована у 2021 · Україна</p>
                </div>
              </div>
              {/* Декор */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-500/20 rounded-2xl blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-2xl blur-xl" />
            </div>
          </div>
        </section>

        {/* ─── ЦИФРИ ─── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Airpull у цифрах</p>
              <h2 className="text-4xl font-black text-white">Результати, якими пишаємось</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-violet-500/30 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ЧОМУ МИ ─── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Переваги</p>
              <h2 className="text-4xl font-black text-white">
                Чому обирають{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                  Airpull
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reasons.map((reason) => (
                <article
                  key={reason.title}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 group"
                >
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {reason.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{reason.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{reason.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── КОМАНДА ─── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Люди</p>
              <h2 className="text-4xl font-black text-white">
                Наша{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                  команда
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member) => (
                <article
                  key={member.name}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all duration-300 text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 border border-white/10 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                    {member.emoji}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-violet-400 text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{member.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ГЕОГРАФІЯ ─── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Доставка</p>
              <h2 className="text-4xl font-black text-white">
                Доставляємо по{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                  всій Україні
                </span>
              </h2>
              <p className="text-white/50 mt-3 max-w-xl mx-auto">
                Нова Пошта та УкрПошта — відправляємо щодня в понад 25 міст та тисячі відділень по всій країні.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {regions.map((region) => (
                <span
                  key={region}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:border-violet-500/40 hover:text-white hover:bg-violet-500/10 transition-all duration-200 cursor-default"
                >
                  📍 {region}
                </span>
              ))}
            </div>

            <p className="text-center text-white/30 text-sm mt-8">
              Немає твого міста? — Доставляємо у будь-яке відділення Нової Пошти по всій Україні
            </p>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Готовий зробити{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                перше замовлення?
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Переглянь каталог і знайди свій ідеальний вейп серед 500+ товарів.
            </p>
            <Link
              href="/catalog"
              aria-label="Перейти до каталогу вейпів Airpull"
              className="inline-flex px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-violet-500/30"
            >
              Перейти до каталогу →
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
const features = [
  {
    icon: '🚀',
    title: 'Швидка доставка',
    description: 'Доставляємо по всій Україні протягом 1-3 днів. Є кур\'єрська доставка у великих містах.',
  },
  {
    icon: '✅',
    title: 'Тільки оригінали',
    description: 'Всі товари сертифіковані та куплені у офіційних дистриб\'юторів. Жодного контрафакту.',
  },
  {
    icon: '💳',
    title: 'Зручна оплата',
    description: 'Оплата карткою, готівкою або при отриманні. Працюємо з усіма банками України.',
  },
  {
    icon: '🎧',
    title: 'Підтримка 24/7',
    description: 'Наша команда завжди на зв\'язку. Допоможемо з вибором та відповімо на всі питання.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-black py-24 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Чому ми</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Переваги{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Airpull
            </span>
          </h2>
        </div>

        {/* Картки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// FeaturesSection.tsx
const features = [
  {
    icon: '⚡',
    title: 'Швидка доставка вейпів',
    description: 'Відправляємо замовлення Новою Поштою щодня. Доставка Pod-систем та рідин по Україні за 1-2 дні.',
  },
  {
    icon: '🛡️',
    title: '100% Оригінальна продукція',
    description: 'Ми продаємо лише сертифіковані електронні сигарети від офіційних виробників з гарантією якості.',
  },
  {
    icon: '💎',
    title: 'Величезний асортимент',
    description: 'Понад 500+ смаків рідин (сольові та органічні), одноразки, картриджі та комплектуючі завжди в наявності.',
  },
  {
    icon: '🤝',
    title: 'Професійна консультація',
    description: 'Не знаєте який вейп купити? Наші менеджери підберуть ідеальну Pod-систему саме під ваші потреби.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" aria-label="Переваги нашого вейп-шопу" className="bg-[#050505] py-24 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-violet-400 font-bold text-sm uppercase tracking-[0.2em] mb-4">Твій надійний вейп-шоп</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            Чому обирають{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Airpull
            </span>
          </h3>
          <p className="text-white/50 text-lg">Ми прагнемо зробити культуру паріння доступною, якісною та безпечною для кожного клієнта в Україні.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/30 hover:bg-gradient-to-b hover:from-violet-500/5 hover:to-transparent transition-all duration-500 hover:-translate-y-1">
              <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-300">
                {feature.icon}
              </div>
              <h4 className="text-white font-bold text-lg mb-3">{feature.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

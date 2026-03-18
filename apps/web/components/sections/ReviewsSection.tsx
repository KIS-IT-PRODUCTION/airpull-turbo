const reviews = [
  {
    name: 'Олексій К.',
    city: 'Київ',
    rating: 5,
    text: 'Замовляю вже третій раз, завжди все чудово. Доставка швидка, якість на висоті. Рекомендую!',
    avatar: 'О',
  },
  {
    name: 'Марина Д.',
    city: 'Львів',
    rating: 5,
    text: 'Нарешті знайшла магазин де є все що треба. Ціни адекватні, менеджери дуже допомогли з вибором.',
    avatar: 'М',
  },
  {
    name: 'Дмитро Л.',
    city: 'Харків',
    rating: 5,
    text: 'Відмінний сервіс! Товар прийшов в ідеальному стані, все запаковано акуратно. Буду замовляти ще.',
    avatar: 'Д',
  },
];

export default function ReviewsSection() {
  return (
    <section className="bg-black py-24 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-2">Відгуки</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Що кажуть{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              клієнти
            </span>
          </h2>
        </div>

        {/* Картки відгуків */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all duration-300"
            >
              {/* Зірки */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              <p className="text-white/70 text-sm leading-relaxed mb-6">"{review.text}"</p>

              {/* Автор */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-white/40 text-xs">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
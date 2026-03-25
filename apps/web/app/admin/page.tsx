export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Огляд (Дашборд)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Картки статистики (поки статичні) */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
          <p className="text-white/60 text-sm mb-2">Нових замовлень</p>
          <p className="text-3xl font-bold text-violet-400">12</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
          <p className="text-white/60 text-sm mb-2">Прибуток за місяць</p>
          <p className="text-3xl font-bold text-green-400">45,200 ₴</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
          <p className="text-white/60 text-sm mb-2">Всього товарів</p>
          <p className="text-3xl font-bold text-white">128</p>
        </div>
      </div>
    </div>
  );
}
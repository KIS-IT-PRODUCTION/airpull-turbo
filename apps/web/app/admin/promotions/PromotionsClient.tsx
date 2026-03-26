'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';

interface Promotion {
  id: string;
  name: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  applyToAll: boolean;
  categories: string[];
  productIds: string[];
  isActive: boolean;
  createdAt: string;
}

export default function PromotionsClient({ 
  initialPromotions,
  allProducts, 
  token 
}: { 
  initialPromotions: Promotion[];
  allProducts: Product[];
  token: string;
}) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const getPromoProducts = (promo: Promotion) => {
    return allProducts.filter(p => {
      if (promo.applyToAll) return true;
      if (promo.productIds.includes(p.id)) return true;
      if (promo.categories && promo.categories.length > 0) {
        const productCategory = p.category?.toLowerCase();
        const productBrand = (p as any).brand?.toLowerCase();
        return promo.categories.some(catId => {
          const searchId = catId.toLowerCase();
          return productCategory === searchId || productBrand === searchId;
        });
      }
      return false;
    });
  };

  const togglePromotion = async (id: string, currentStatus: boolean) => {
    setIsLoading(id);
    try {
      const res = await fetch(`http://localhost:4004/admin/promotions/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        setPromotions(prev => prev.map(promo => 
          promo.id === id ? { ...promo, isActive: !currentStatus } : promo
        ));
      }
    } finally {
      setIsLoading(null);
    }
  };

  const deletePromotion = async (id: string) => {
    if (!confirm('Видалити цю акцію? Всі ціни повернуться до норми.')) return;
    try {
      const res = await fetch(`http://localhost:4004/admin/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="relative">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm">
              <th className="p-4 font-medium">Назва акції</th>
              <th className="p-4 font-medium">Знижка</th>
              <th className="p-4 font-medium">Охоплення</th>
              <th className="p-4 font-medium">Статус</th>
              <th className="p-4 font-medium text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {promotions.map((promo) => (
              <tr key={promo.id} className="hover:bg-white/[0.02] transition-colors group">
                <td 
                  className="p-4 text-white font-medium cursor-pointer hover:text-violet-400 transition-colors"
                  onClick={() => setSelectedPromo(promo)}
                >
                  <div className="flex items-center gap-2">
                    {promo.name}
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">Деталі 🔍</span>
                  </div>
                </td>
                <td className="p-4 text-emerald-400 font-bold">
                  {promo.discountType === 'PERCENTAGE' ? `-${promo.value}%` : `-${promo.value} ₴`}
                </td>
                <td className="p-4 text-white/70 text-sm">
                  {promo.applyToAll ? "Всі товари" : `${promo.categories.length + promo.productIds.length} позицій`}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => togglePromotion(promo.id, promo.isActive)}
                    disabled={isLoading === promo.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      promo.isActive ? 'bg-emerald-500' : 'bg-white/20'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${promo.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deletePromotion(promo.id)} className="text-white/20 hover:text-red-400 transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedPromo(null)} />
          
          <div className="relative bg-[#111111] border border-white/10 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedPromo.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-lg">
                    {selectedPromo.discountType === 'PERCENTAGE' ? `-${selectedPromo.value}%` : `-${selectedPromo.value} ₴`}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${selectedPromo.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/10 text-white/40'}`}>
                    {selectedPromo.isActive ? 'Активна' : 'Вимкнена'}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPromo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-colors">✕</button>
            </div>

            <div className="p-8 pt-2 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">На що діє знижка:</h3>
                
                <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                  {selectedPromo.applyToAll ? (
                    <div className="flex items-center gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">🌍</div>
                      <div>
                        <p className="text-emerald-400 font-bold">Весь асортимент</p>
                        <p className="text-emerald-400/60 text-xs font-medium">Знижка діє на кожен товар у магазині</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {selectedPromo.categories.map((cat) => (
                        <div key={cat} className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-lg text-blue-400">📦</div>
                          <div>
                            <p className="text-blue-300 font-bold text-sm">{cat}</p>
                            <p className="text-blue-300/40 text-[10px] uppercase font-bold tracking-tighter">Бренд / Категорія</p>
                          </div>
                        </div>
                      ))}

                      {getPromoProducts(selectedPromo).map((product) => {
                        // КЛЮЧОВЕ ВИПРАВЛЕННЯ:
                        // Якщо акція вже активна, то в базі product.price — це вже ціна зі знижкою.
                        // Справжня базова ціна лежить в oldPrice.
                        const basePrice = (selectedPromo.isActive && product.oldPrice) 
                            ? product.oldPrice 
                            : product.price;
                        
                      let discountedPrice = 0;
                        const numericBasePrice = Number(basePrice);
                        const promoValue = Number(selectedPromo.value);

                        if (selectedPromo.discountType === 'PERCENTAGE') {
                        discountedPrice = numericBasePrice * (1 - promoValue / 100);
                        } else {
                        discountedPrice = numericBasePrice - promoValue;
                        }

                        return (
                        <div key={product.id} className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/5 rounded-2xl group/item transition-colors hover:bg-white/10">
                            <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/10">
                            <img 
                                src={product.imageUrl || '/placeholder.png'} 
                                className="w-full h-full object-cover" 
                                alt={product.name} 
                            />
                            </div>
                            <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                            {/* Виводимо базову ціну без помилок */}
                            <p className="text-white/40 text-[11px]">{numericBasePrice} ₴ (базова ціна)</p>
                            </div>
                            <div className="text-right pr-2">
                            <div className="text-emerald-400 font-bold text-xs whitespace-nowrap">
                                {Math.round(discountedPrice)} ₴
                            </div>
                            </div>
                        </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button 
                  onClick={() => setSelectedPromo(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl transition-all font-bold"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
}
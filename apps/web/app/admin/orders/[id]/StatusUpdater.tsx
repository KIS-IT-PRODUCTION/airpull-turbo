'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/lib/api';

interface StatusUpdaterProps {
  orderId: string;
  initialStatus: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  PROCESSING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  SHIPPED: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  COMPLETED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function StatusUpdater({ orderId, initialStatus }: StatusUpdaterProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsLoading(true);
    
    const isSuccess = await updateOrderStatus(orderId, status);

    if (isSuccess) {
      alert('Статус оновлено ✅');
      router.refresh(); 
    } else {
      alert('Помилка оновлення. Можливо, ви не авторизовані як адмін або сервер недоступний.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-xl">
      <h3 className="text-[10px] font-black uppercase text-white/30 mb-4 tracking-[0.2em]">Керування статусом</h3>
      
      <div className={`mb-4 px-3 py-2 rounded-xl border text-xs font-bold text-center transition-colors ${STATUS_COLORS[status] || 'text-white bg-white/5 border-white/10'}`}>
        {status}
      </div>

      <select 
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={isLoading}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition-all mb-4 text-white text-sm cursor-pointer hover:bg-black/60"
      >
        <option value="PENDING">🕒 Очікує</option>
        <option value="PROCESSING">⚙️ В обробці</option>
        <option value="SHIPPED">📦 Відправлено</option>
        <option value="COMPLETED">✅ Виконано</option>
        <option value="CANCELLED">❌ Скасовано</option>
      </select>

      <button 
        onClick={handleUpdate}
        disabled={isLoading || status === initialStatus}
        className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 shadow-lg"
      >
        {isLoading ? 'Оновлення...' : 'Зберегти зміни'}
      </button>
    </div>
  );
}
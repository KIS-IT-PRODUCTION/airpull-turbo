'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateProfileData } from '@/app/actions/auth';
import { UserData } from '@/types/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getUser().then((data) => {
      if (!data) {
        router.push('/login');
        return;
      }
      setUser(data);
      setName(data.name || '');
      setIsLoading(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfileData(name);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Профіль успішно оновлено!' });
      // Оновлюємо сторінку, щоб хедер відразу підтягнув нове ім'я
      router.refresh();
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">Налаштування профілю</h1>
          <p className="text-white/50 text-sm mb-8">
            Тут ви можете змінити свої особисті дані.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Номер телефону
              </label>
              <input
                type="text"
                value={user?.phone || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed"
              />
              <p className="text-xs text-white/30 mt-1.5">
                Номер телефону змінити неможливо, оскільки він є вашим логіном.
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                Ваше ім'я
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім'я"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'error' 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving || name.trim() === (user?.name || '')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-[52px]"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Зберегти зміни'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
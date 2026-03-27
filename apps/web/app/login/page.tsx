"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { setAuthCookie } from "../../lib/auth";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("+380");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      // Обробка ситуації, коли користувач ще не підключив бота
      if (data.message === 'TELEGRAM_NOT_LINKED') {
        setError("Бот не знає цей номер. Будь ласка, перейдіть у нашого Telegram-бота та натисніть «Поділитися контактом».");
        toast.error('Номер не знайдено в базі бота!', { duration: 4000 });
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        setStep(2);
        toast.success('Код успішно відправлено в Telegram!');
      } else {
        setError(data.message || 'Помилка відправки коду. Перевірте номер.');
      }
    } catch (err) {
      console.error(err);
      setError("Сталася помилка з'єднання з сервером. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await authApi.verifyCode(phone, code, name);
      
      if (data.token) {
        await setAuthCookie(data.token);
      }
      
      toast.success('Успішний вхід!');
      router.push("/"); 
      
    } catch (err: any) {
      setError(err.message || "Невірний код. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center relative px-4 overflow-hidden py-12">
      {/* Декоративний фон */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Логотип */}
        <Link href="/" className="group mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/10 group-hover:border-violet-500/30 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-pink-400 font-black">
              A
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Airpull
          </h1>
        </Link>

        {/* Основна картка */}
        <div className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {/* Світлий блік зверху картки */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {step === 1 ? "Вхід у систему" : "Перевірка коду"}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed px-2">
              {step === 1 
                ? "Увійди або зареєструйся через номер телефону" 
                : `Ми відправили 4-значний код у Telegram на номер `}
              {step === 2 && <span className="font-bold text-white block mt-1">{phone}</span>}
            </p>
          </div>

          {/* Вивід помилок */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {/* ІНФОРМАЦІЙНИЙ БЛОК ПРО БОТА */}
              <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">Вперше у нас?</h3>
                    <p className="text-white/60 text-xs leading-relaxed mb-3">
                      Щоб отримувати коди авторизації та сповіщення про замовлення, потрібно підключити нашого Telegram-бота.
                    </p>
                    <a 
                      href="https://t.me/AirPullBot" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors"
                    >
                      <span>Відкрити бота</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendCode} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-white/40 font-bold text-[10px] uppercase tracking-widest pl-1">
                    Твоє ім'я (для нових клієнтів)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                    placeholder="Як до тебе звертатися?"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 font-bold text-[10px] uppercase tracking-widest pl-1 flex justify-between items-center">
                    <span>Номер телефону</span>
                    <span className="text-red-400 text-[10px]">* Обов'язково</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all font-medium text-lg tracking-wide"
                    placeholder="+380"
                    required
                  />
                </div>
                
                {/* 🚀 ВІДНОВЛЕНО ГРАДІЄНТ ТА СТИЛІ КНОПКИ */}
                <button
                  type="submit"
                  disabled={isLoading || phone.length < 12} // +380 + 9 цифр
                  className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-500/20 flex justify-center items-center gap-2 group"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Відправка...
                    </span>
                  ) : (
                    <>
                      Отримати код у Telegram
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-1.5">
                <label className="text-white/40 font-bold text-[10px] uppercase tracking-widest text-center block w-full">
                  Код підтвердження
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Тільки цифри
                    if (val.length <= 4) setCode(val);
                  }}
                  className="w-full px-5 py-5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/10 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all text-center text-4xl tracking-[0.7em] font-black font-mono pl-[calc(1.25rem+0.7em)]"
                  placeholder="••••"
                  maxLength={4}
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                {/* 🚀 ВІДНОВЛЕНО ГРАДІЄНТ ТА СТИЛІ КНОПКИ */}
                <button
                  type="submit"
                  disabled={isLoading || code.length < 4}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-500/20"
                >
                  {isLoading ? "Перевіряємо..." : "Увійти"}
                </button>
                
                {/* 🚀 ВІДНОВЛЕНО СТИЛЬ КНОПКИ "НАЗАД" */}
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setCode("");
                    setError("");
                  }}
                  className="w-full py-3 text-sm text-white/50 hover:text-white transition-colors"
                >
                  ← Назад до вводу даних
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-white/30 text-[11px] mt-8 max-w-xs leading-relaxed">
          Продовжуючи, ти погоджуєшся з нашими{' '}
          <Link href="/terms" className="text-white/50 hover:text-white underline decoration-white/20 hover:decoration-white transition-all">
            Умовами використання
          </Link>{' '}
          та{' '}
          <Link href="/privacy" className="text-white/50 hover:text-white underline decoration-white/20 hover:decoration-white transition-all">
            Політикою конфіденційності
          </Link>.
        </p>
      </div>
    </main>
  );
}
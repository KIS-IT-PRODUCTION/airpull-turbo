"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuthCookie } from "../actions/auth";
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
      // ЗМІНА ТУТ: Зберігаємо результат запиту в змінну response
      const response = (await authApi.sendCode(phone)) as any;
      
      // Показуємо тестовий код у спливаючому вікні
      if (response && response.testCode) {
        alert(`🔑 ТЕСТОВИЙ КОД: ${response.testCode}`);
      } else {
        // Якщо раптом authApi не повертає testCode, просто попереджаємо
        console.log("Відповідь від сервера:", response);
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message || "Сталася помилка");
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
      
      router.push("/"); 
      
    } catch (err: any) {
      setError(err.message || "Сталася помилка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center relative px-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400">
              Airpull
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">
            Вхід у систему
          </h2>
          <p className="text-white/50 text-sm">
            {step === 1 ? "Введи номер телефону та ім'я" : `Код відправлено на ${phone}`}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-violet-400 font-semibold text-xs uppercase tracking-widest mb-2">
                  Ім'я (Необов'язково)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                  placeholder="Твоє ім'я"
                />
              </div>

              <div>
                <label className="block text-violet-400 font-semibold text-xs uppercase tracking-widest mb-2">
                  Номер телефону
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                  placeholder="+380991234567"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-500/20"
              >
                {isLoading ? "Відправка..." : "Отримати код →"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-violet-400 font-semibold text-xs uppercase tracking-widest mb-2 text-center">
                  Код з SMS
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-center text-2xl tracking-[0.5em] font-bold"
                  placeholder="••••"
                  maxLength={4}
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || code.length < 4}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-500/20"
                >
                  {isLoading ? "Перевірка..." : "Увійти"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 text-sm text-white/50 hover:text-white transition-colors"
                >
                  ← Назад до вводу даних
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-8">
          Продовжуючи, ти погоджуєшся з нашими{' '}
          <Link href="/terms" className="underline hover:text-white/60 transition-colors">
            правилами користування
          </Link>
        </p>
      </div>
    </main>
  );
}
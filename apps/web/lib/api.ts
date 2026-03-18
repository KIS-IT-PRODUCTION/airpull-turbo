import type { Product } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4004';

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, limit);
}

export const authApi = {
  // Відправка коду
  sendCode: async (phone: string) => {
    const res = await fetch(`${API_URL}/auth/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      throw new Error("Помилка відправки коду. Спробуй ще раз.");
    }
    
    // Якщо бекенд нічого не повертає на цей запит (наприклад, статусу 201 вистачає),
    // можна просто повернути true. Але якщо повертає JSON, робимо res.json()
    return true; 
  },

  // Перевірка коду та логін
  verifyCode: async (phone: string, code: string, name?: string) => {
    const res = await fetch(`${API_URL}/auth/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        phone, 
        code, 
        name: name?.trim() || undefined 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Невірний код або він прострочений");
    }

    return data; // Повертає { token: "..." }
  }
};
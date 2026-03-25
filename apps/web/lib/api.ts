import type { Product } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://airpull-api.onrender.com';

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
  sendCode: async (phone: string) => {
    const res = await fetch(`${API_URL}/auth/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      throw new Error("Помилка відправки коду. Спробуй ще раз.");
    }
    
    const data = await res.json();
    return data; 
  },

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

    return data;
  }
};

// --- ОНОВЛЕНА ФУНКЦІЯ ВИДАЛЕННЯ ---
export async function deleteProduct(id: string, token?: string): Promise<boolean> {
  try {
    let finalToken: string | null | undefined = token;

    // Спробуємо дістати токен (якщо він раптом не HttpOnly або є в localStorage)
    if (!finalToken && typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )auth-token=([^;]+)'));
      const cookieToken = match ? match[2] : null;
      const localToken = localStorage.getItem('auth-token');
      finalToken = cookieToken || localToken;
    }

    const headers: Record<string, string> = {};

    // Якщо ми ЗМОГЛИ прочитати токен, додаємо його в заголовок Authorization
    // Ми також перевіряємо, щоб це не був рядок "undefined" (який ламав бекенд)
    if (finalToken && finalToken !== 'undefined' && finalToken !== 'null') {
      finalToken = finalToken.replace(/^"|"$/g, '');
      headers['Authorization'] = `Bearer ${finalToken}`;
    }

    // Відправляємо запит
    const res = await fetch(`${API_URL}/products/${id}`, { 
      method: 'DELETE',
      headers,
      credentials: 'include' // 🚀 МАГІЯ: браузер сам відправить HttpOnly куку на бекенд!
    });

    if (res.status === 401 || res.status === 403) {
      console.error("Помилка 401/403: Сервер відхилив токен при видаленні.");
      alert('Помилка доступу: Ви не авторизовані або не маєте прав.');
      return false;
    }

    return res.ok;
  } catch (error) {
    console.error('Помилка видалення:', error);
    return false;
  }
}

// --- ОНОВЛЕНА ФУНКЦІЯ СТАТУСУ ---
export async function updateOrderStatus(orderId: string, status: string, token?: string): Promise<boolean> {
  try {
    let finalToken: string | null | undefined = token;

    if (!finalToken && typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )auth-token=([^;]+)'));
      const cookieToken = match ? match[2] : null;
      const localToken = localStorage.getItem('auth-token');
      finalToken = cookieToken || localToken;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (finalToken && finalToken !== 'undefined' && finalToken !== 'null') {
      finalToken = finalToken.replace(/^"|"$/g, '');
      headers['Authorization'] = `Bearer ${finalToken}`;
    }

    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers,
      credentials: 'include', // 🚀 МАГІЯ ДЛЯ ОНОВЛЕННЯ СТАТУСУ
      body: JSON.stringify({ status }),
    });

    if (res.status === 401 || res.status === 403) {
      console.error("Помилка прав доступу.");
      alert('Помилка доступу: У вас немає прав адміністратора.');
      return false;
    }

    return res.ok;
  } catch (error) {
    console.error('Помилка оновлення:', error);
    return false;
  }
}
'use server';

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 днів
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;

  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Помилка декодування токена:', error);
    return null;
  }
}

// Функція для оновлення імені профілю
export async function updateProfileData(name: string) {
  const user = await getUser();
  if (!user) {
    return { error: 'Не авторизовано' };
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4004";
    
    const res = await fetch(`${API_URL}/auth/update-profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.sub, 
        name 
      }),
    });

    if (!res.ok) {
      throw new Error('Не вдалося оновити профіль');
    }

    const data = await res.json();

    if (data.token) {
      await setAuthCookie(data.token);
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Сталася помилка під час оновлення профілю' };
  }
}
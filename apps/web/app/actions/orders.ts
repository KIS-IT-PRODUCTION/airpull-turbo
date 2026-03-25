'use server';

import { cookies } from 'next/headers';

// Виправлено: Беремо URL з .env, а якщо його немає — ставимо робочий бекенд
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://airpull-api.onrender.com';

// 1. Створення замовлення
export async function createOrderRequest(orderData: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Помилка при оформленні замовлення');
  }

  return response.json();
}

// 2. Отримання історії замовлень
export async function getUserOrdersRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    throw new Error('Не авторизовано');
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Не вдалося завантажити історію замовлень');
  }

  return response.json();
}
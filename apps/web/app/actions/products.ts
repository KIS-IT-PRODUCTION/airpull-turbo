'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getSearchResults(query: string) {
  if (!query || query.length < 2) return [];

  console.log(`🔍 Шукаємо: "${query}" за адресою: ${API_URL}/products/search?q=${encodeURIComponent(query)}`);

  try {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Обов'язково, щоб Next.js не кешував пусті відповіді
    });

    const textData = await response.text();
    console.log(`📦 Відповідь від NestJS:`, textData); // Дивимось, що реально прийшло

    if (!textData) return []; 

    return JSON.parse(textData);
    
  } catch (error) {
    console.error('❌ Помилка при пошуку:', error);
    return []; 
  }
}
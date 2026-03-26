import { cookies } from 'next/headers';
import OrdersTableClient from './OrdersTableClient';

interface UserInfo {
  id: string;
  name: string | null;
  phone: string;
}

interface ProductInfo {
  name: string;
  price: number;
  imageUrl?: string | null;
}

interface OrderItemInfo {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: ProductInfo;
}

interface Order {
  id: string;
  status: string;
  total: number;
  deliveryCity?: string | null;
  deliveryWarehouse?: string | null;
  createdAt: string; 
  user?: UserInfo;
  items: OrderItemInfo[];
}
export const dynamic = 'force-dynamic';

async function getOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('auth-token')?.value;

    const res = await fetch('http://localhost:4004/orders', {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error('Помилка завантаження замовлень. Статус:', res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Помилка мережі (Бекенд не відповідає):', error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Замовлення</h1>
      </div>

      <OrdersTableClient initialOrders={orders} />
    </div>
  );
}
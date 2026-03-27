import { cookies } from 'next/headers';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value || cookieStore.get('token')?.value;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Новий товар</h1>

      <ProductForm token={token} />
    </div>
  );
}
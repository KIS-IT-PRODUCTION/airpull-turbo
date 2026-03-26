import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/api';
import { cookies } from 'next/headers';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value || cookieStore.get('token')?.value;
  const product = await getProductById(id); 

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Редагування товару</h1>
        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/40 font-mono">
          {id.substring(0, 8)}...
        </span>
      </div>
      
      <ProductForm initialData={product} token={token} />
    </div>
  );
}
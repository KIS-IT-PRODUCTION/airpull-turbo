'use client';

import ProductForm from '@/components/admin/ProductForm';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/products');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Новий товар</h1>
      
      {/* 🚀 ТЕПЕР ПРАЦЮЄ: onSuccess додано в інтерфейс компонента */}
      <ProductForm onSuccess={handleSuccess} />
    </div>
  );
}
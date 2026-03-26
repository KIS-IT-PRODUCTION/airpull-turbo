'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Spec {
  key: string;
  value: string;
}

interface ProductImage {
  url: string;
  alt: string;
}

const CATEGORIES_DATA = [
  // ... твої категорії залишаються без змін ...
  {
    id: 'liquid',
    label: 'Рідини',
    brands: [
      { id: 'chaser', label: 'Chaser' },
      { id: 'elfliq', label: 'Elfliq' },
      { id: 'nova', label: 'Nova' },
      { id: 'flavorlab', label: 'Flavorlab' },
      { id: 'octobar', label: 'Octobar' },
      { id: 'inked', label: 'Inked' },
    ],
  },
  {
    id: 'pod',
    label: 'POD Системи',
    brands: [
      { id: 'vaporesso', label: 'Vaporesso' },
      { id: 'voopoo', label: 'Voopoo' },
      { id: 'elf_bar', label: 'Elf Bar' },
      { id: 'smok', label: 'Smok' },
    ],
  },
  {
    id: 'cartridge',
    label: 'Картриджі',
    brands: [
      { id: 'cartridge_vaporesso', label: 'Для Vaporesso' },
      { id: 'cartridge_voopoo', label: 'Для Voopoo' },
      { id: 'cartridge_xros', label: 'Серія XROS' },
      { id: 'coil', label: 'Випарники' },
    ],
  },
  {
    id: 'accessories',
    label: 'Аксесуари',
    brands: [
      { id: 'battery', label: 'Акумулятори' },
      { id: 'charger', label: 'Зарядні пристрої' },
      { id: 'case', label: 'Чохли та шнурки' },
    ],
  },
];

// 🚀 1. ДОДАЛИ token В ПРОПСИ
export default function ProductForm({ initialData, token }: { initialData?: any, token?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    ice: initialData?.ice || 1,
    sweet: initialData?.sweet || 1,
    sour: initialData?.sour || 1,
    images: (initialData?.images || []) as ProductImage[],
    specifications: (initialData?.specifications || []) as Spec[],
  });

  const availableBrands = CATEGORIES_DATA.find(c => c.id === formData.category)?.brands || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumeric = type === 'number' || type === 'range';
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, category: e.target.value, brand: '' }));
  };

  // --- ЛОГІКА СПЕЦИФІКАЦІЙ ---
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const updateSpecification = (index: number, field: keyof Spec, val: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = val;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // --- ЛОГІКА ЗОБРАЖЕНЬ ---
  const uploadFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004';
    
    // 🚀 2. ДОДАЛИ ТОКЕН ПРИ ЗАВАНТАЖЕННІ ФОТО
    const res = await fetch(`${API_URL}/upload/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` 
      },
      body: uploadData,
    });
    
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url; 
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingState(prev => ({ ...prev, main: true }));
    try {
      const url = await uploadFile(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      alert('Помилка завантаження фотографії. Перевірте авторизацію.');
    } finally {
      setUploadingState(prev => ({ ...prev, main: false }));
    }
  };

  const addImageSlot = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { url: '', alt: '' }] }));
  };

  const handleGalleryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingState(prev => ({ ...prev, [`gallery-${index}`]: true }));
    try {
      const url = await uploadFile(file);
      const newImages = [...formData.images];
      newImages[index] = { url, alt: formData.name };
      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (err) {
      alert('Помилка завантаження');
    } finally {
      setUploadingState(prev => ({ ...prev, [`gallery-${index}`]: false }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004';
    const productId = initialData?.id || initialData?._id;
    
    const slug = formData.name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const payload = {
      ...formData,
      slug: initialData?.slug || slug,
      price: Number(formData.price),
      stock: Number(formData.stock),
      imageAlt: formData.name, // Авто-альт
      images: formData.images.filter(img => img.url !== ''),
    };

    try {
      // 🚀 3. ДОДАЛИ ТОКЕН ПРИ СТВОРЕННІ/ОНОВЛЕННІ ТОВАРУ
      const res = await fetch(isEditing ? `${API_URL}/products/${productId}` : `${API_URL}/products`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Успішно збережено!');
        router.push('/admin/products');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Помилка: ${errorData.message || res.status}`);
      }
    } catch (error) {
      alert('Помилка мережі');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20 px-4">
      {/* 1. ОСНОВНЕ */}
      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm">1</span>
          Основна інформація
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Назва товару" className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Ціна (₴)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" required />
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Склад" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. КАТЕГОРІЯ */}
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm">2</span>
                Категорія
            </h2>
            <select value={formData.category} onChange={handleCategoryChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" required>
                <option value="" disabled>Виберіть категорію</option>
                {CATEGORIES_DATA.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>
            <select value={formData.brand} onChange={(e) => setFormData(p => ({ ...p, brand: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" disabled={!formData.category}>
                <option value="">Виберіть бренд</option>
                {availableBrands.map(brand => <option key={brand.id} value={brand.id}>{brand.label}</option>)}
            </select>
        </div>

        {/* 3. СМАКИ */}
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">3</span>
                Смаки
            </h2>
            {['ice', 'sweet', 'sour'].map(f => (
                <div key={f} className="flex items-center gap-4">
                    <span className="w-20 text-xs text-white/50 uppercase">{f === 'ice' ? 'Холод' : f === 'sweet' ? 'Солод' : 'Кислинка'}</span>
                    <input type="range" name={f} min="1" max="5" value={formData[f as 'ice'|'sweet'|'sour']} onChange={handleChange} className="flex-1 accent-emerald-500" />
                    <span className="text-white font-bold">{formData[f as 'ice'|'sweet'|'sour']}</span>
                </div>
            ))}
        </div>
      </div>

      {/* 4. МЕДІА */}
      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">4</span>
          Медіа
        </h2>

        {/* Main Image */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-24 h-24 bg-black rounded-xl border border-white/10 overflow-hidden flex-shrink-0 relative">
                {formData.imageUrl && <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />}
                {uploadingState.main && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px]">...</div>}
            </div>
            <label className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                {formData.imageUrl ? 'ЗМІНИТИ ГОЛОВНЕ ФОТО' : 'ЗАВАНТАЖИТИ ГОЛОВНЕ ФОТО'}
                <input type="file" className="hidden" onChange={handleMainImageUpload} accept="image/*" />
            </label>
        </div>

        {/* Gallery */}
        <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/70">Додаткові фото</span>
                <button type="button" onClick={addImageSlot} className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">+ Додати</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-black rounded-xl border border-white/10 overflow-hidden group">
                        {img.url ? (
                            <>
                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </>
                        ) : (
                            <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-white/5">
                                <span className="text-white/20 text-xl">+</span>
                                <input type="file" className="hidden" onChange={(e) => handleGalleryImageUpload(idx, e)} />
                            </label>
                        )}
                        {uploadingState[`gallery-${idx}`] && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px]">...</div>}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 5. ОПИС ТА ХАРАКТЕРИСТИКИ */}
      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">5</span>
          Опис та Характеристики
        </h2>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Опис товару..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 resize-none" />
        
        <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center">
                <span className="text-sm text-white/50 font-bold uppercase tracking-wider">Технічні дані</span>
                <button type="button" onClick={addSpecification} className="text-xs text-amber-400 hover:underline">+ Додати рядок</button>
            </div>
            {formData.specifications.map((spec, i) => (
                <div key={i} className="flex gap-2 group">
                    <input type="text" placeholder="Назва" value={spec.key} onChange={(e) => updateSpecification(i, 'key', e.target.value)} className="w-1/3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
                    <input type="text" placeholder="Значення" value={spec.value} onChange={(e) => updateSpecification(i, 'value', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
                    <button type="button" onClick={() => removeSpecification(i)} className="text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
            ))}
        </div>
      </div>

      {/* BUTTON */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || Object.values(uploadingState).some(v => v)}
          className="px-12 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
        >
          {isSubmitting ? 'ЗБЕРЕЖЕННЯ...' : isEditing ? 'ОНОВИТИ ТОВАР' : 'СТВОРИТИ ТОВАР'}
        </button>
      </div>
    </form>
  );
}
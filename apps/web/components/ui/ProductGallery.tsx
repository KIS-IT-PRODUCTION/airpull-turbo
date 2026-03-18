'use client';

import { useState, TouchEvent } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: (ProductImage | string)[];
  productName: string;
  inStock: boolean;
}

export default function ProductGallery({ images, productName, inStock }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const validImages: string[] = images
    .map((img) => (typeof img === 'string' ? img : img.url))
    .filter((url) => !!url && url.trim() !== '');

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/40 to-pink-900/30 border border-white/10 flex items-center justify-center">
        <span className="text-9xl opacity-30">💨</span>
        <StockBadge inStock={inStock} />
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    setTouchStart(null);
  };

  return (
    <div className="relative w-full group">
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-600/20 rounded-full blur-2xl pointer-events-none" />

      <div 
        className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/40 to-pink-900/30 border border-white/10 mb-4 shadow-xl z-10 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={validImages[currentIndex] as string}
          alt={`${productName} — ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-500 ease-in-out"
          priority
        />
        
        <StockBadge inStock={inStock} />

        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
            >
              →
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {validImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide z-10 relative">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === idx
                  ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-105'
                  : 'border-white/10 opacity-50 hover:opacity-100'
              }`}
            >
              <Image
                src={img as string}
                alt={`Мініатюра ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StockBadge({ inStock }: { inStock: boolean }) {
  return (
    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md z-20 ${
      inStock ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
    }`}>
      {inStock ? '✓ В наявності' : '✗ Немає в наявності'}
    </div>
  );
}
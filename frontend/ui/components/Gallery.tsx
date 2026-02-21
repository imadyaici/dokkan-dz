'use client';

import Image from 'next/image';
import { useState } from 'react';

export function Gallery({
  images = [],
}: {
  images: { asset: { _id: string; url: string | null } | null }[];
}) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-square w-full max-w-[300px] sm:max-w-xl bg-white border border-blue-600 rounded-lg overflow-hidden flex items-center justify-center">
        <Image
          src={images[selected].asset?.url || ''}
          alt={'Product image'}
          fill
          className="object-contain"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 sm:grid-cols-4 gap-2 w-full max-w-[300px] sm:max-w-xl">
          {images.map((img, idx) => (
            <button
              key={img.asset?._id}
              onClick={() => setSelected(idx)}
              className={`border border-blue-600 rounded-lg overflow-hidden focus:outline-none ${selected === idx ? 'ring-2 ring-blue-500' : ''}`}
              aria-label={`Show image ${idx + 1}`}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={img.asset?.url || ''}
                  alt={'Product image'}
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

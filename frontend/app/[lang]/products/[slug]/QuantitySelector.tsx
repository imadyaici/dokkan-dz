'use client';

import { useEffect, useRef, useState } from 'react';

import { useCurrentLang } from '@/hooks/useCurrentLang';
import { type ProductQueryResult } from '@/sanity.types';
import { OrderFormModal } from '@/ui/components/OrderFormModal';
import { TrustBadges } from '@/ui/components/TrustBadges';
import * as fpixel from '@/utils/fpixel';

type Props = {
  product: ProductQueryResult;
  translations: {
    addToCart: string;
    orderNow: string;
    payOnDelivery: string;
    orderForm: {
      [key: string]: string;
    };
    messages: {
      loading: string;
      selectWilayaFirst: string;
      [key: string]: string;
    };
    trust: {
      cod: string;
      fastShipping: string;
      returns: string;
    };
  };
};

export function QuantitySelector({ product, translations }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const lang = useCurrentLang();

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  const handleAddClick = () => {
    fpixel.event('AddToCart', {
      content_ids: [product?._id],
      content_name:
        product?.name?.[Object.keys(product?.name || {})[0] as keyof typeof product.name] ||
        'Product',
      content_type: 'product',
      value: product?.price,
      currency: 'DZD',
    });
    setShowModal(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (mainButtonRef.current) {
      observer.observe(mainButtonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <div className="flex h-12 w-32 items-center justify-between rounded-full border border-neutral-300 bg-white text-neutral-900">
          <button
            type="button"
            onClick={decrement}
            className="flex h-full w-1/3 items-center justify-center text-2xl font-light"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="w-1/3 select-none text-center text-lg font-medium">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            className="flex h-full w-1/3 items-center justify-center text-2xl font-light"
            aria-label="Increase quantity"
          >
            &#43;
          </button>
        </div>
      </div>
      <button
        ref={mainButtonRef}
        type="button"
        onClick={handleAddClick}
        className="mt-1 flex w-full flex-col items-center justify-center rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 shadow-lg"
      >
        <span className="text-lg">{translations.orderNow}</span>
        <span className="text-xs font-normal opacity-90">{translations.payOnDelivery}</span>
      </button>

      {/* Sticky Mobile CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] transition-transform duration-300 sm:hidden ${isStickyVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <button
          type="button"
          onClick={handleAddClick}
          className="flex w-full flex-col items-center justify-center rounded bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg active:scale-95 transition-all"
        >
          <span className="text-lg">{translations.orderNow}</span>
          <span className="text-xs font-normal opacity-90">{translations.payOnDelivery}</span>
        </button>
      </div>

      <TrustBadges lang={lang} translations={translations.trust} />

      {showModal && (
        <OrderFormModal
          onClose={() => setShowModal(false)}
          product={product}
          quantity={quantity}
          translations={translations.orderForm}
          messages={translations.messages}
        />
      )}
    </div>
  );
}

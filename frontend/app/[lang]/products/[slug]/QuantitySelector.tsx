"use client";

import { useState } from "react";
import { OrderFormModal } from "@/ui/components/OrderFormModal";
import { ProductQueryResult } from "@/sanity.types";

type Props = {
  product: ProductQueryResult;
  translations: {
    addToCart: string;
    orderForm: {
      [key: string]: string;
    };
    messages: {
      loading: string;
      selectWilayaFirst: string;
      [key: string]: string;
    };
  };
};

export function QuantitySelector({ product, translations }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);
  const handleAddClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product?._id],
        content_name: product?.name?.[Object.keys(product?.name || {})[0] as keyof typeof product.name] || 'Product',
        content_type: 'product',
        value: product?.price,
        currency: 'DZD',
      });
    }
    setShowModal(true);
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
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
          <span className="w-1/3 select-none text-center text-lg font-medium">
            {quantity}
          </span>
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
        type="button"
        onClick={handleAddClick}
        className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
      >
        {translations.addToCart}
      </button>
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

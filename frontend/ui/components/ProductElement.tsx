'use client';

import Link from 'next/link';

import { useCurrentLang } from '@/hooks/useCurrentLang';
import { type ProductQueryResult } from '@/sanity.types';
import { ProductImageWrapper } from '@/ui/atoms/ProductImageWrapper';
import { formatMoney } from '@/utils/utils';

export function ProductElement({
  product,
  loading,
  priority,
}: {
  product: ProductQueryResult;
  loading: 'eager' | 'lazy';
  priority?: boolean;
}) {
  const currentLang = useCurrentLang();
  const thumbnail = product?.images?.[0];
  const isRTL = currentLang === 'ar';

  if (!product) {
    return null;
  }

  return (
    <li data-testid="ProductElement">
      <Link href={`/${currentLang}/products/${product.slug}`} key={product._id}>
        <div className="hover:border border-neutral-300 transition-border rounded-md p-2">
          {thumbnail?.asset?.url && (
            <ProductImageWrapper
              loading={loading}
              src={thumbnail.asset.url}
              alt={product.name[currentLang as keyof typeof product.name]}
              width={512}
              height={512}
              sizes={'512px'}
              priority={priority}
            />
          )}
          <div
            className={`mt-2 flex justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            <div>
              <h3 className="mt-1 font-semibold text-neutral-900">
                {product.name[currentLang as keyof typeof product.name]}
              </h3>
              <p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
                {/* {product.category?.name} */}
              </p>
            </div>
            <p
              className="mt-1 font-medium text-neutral-900"
              data-testid="ProductElement_PriceRange"
            >
              {formatMoney(product.price, currentLang)}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}

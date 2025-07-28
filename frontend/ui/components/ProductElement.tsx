import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { formatMoney } from "@/utils/utils";
import { ProductQueryResult } from "@/sanity.types";

export function ProductElement({
  product,
  loading,
  priority,
}: { product: ProductQueryResult } & {
  loading: "eager" | "lazy";
  priority?: boolean;
}) {
  const thumbnail = product?.images?.[0];

  if (!product) {
    return null;
  }

  return (
    <li data-testid="ProductElement">
      <Link href={`/products/${product.slug}`} key={product._id}>
        <div>
          {thumbnail?.asset?.url && (
            <ProductImageWrapper
              loading={loading}
              src={thumbnail.asset.url}
              alt={thumbnail.alt ?? ""}
              width={512}
              height={512}
              sizes={"512px"}
              priority={priority}
            />
          )}
          <div className="mt-2 flex justify-between">
            <div>
              <h3 className="mt-1 text-sm font-semibold text-neutral-900">
                {product.name}
              </h3>
              <p
                className="mt-1 text-sm text-neutral-500"
                data-testid="ProductElement_Category"
              >
                {/* {product.category?.name} */}
              </p>
            </div>
            <p
              className="mt-1 text-sm font-medium text-neutral-900"
              data-testid="ProductElement_PriceRange"
            >
              {formatMoney(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}

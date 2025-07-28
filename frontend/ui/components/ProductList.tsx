import { AllProductsQueryResult } from "@/sanity.types";
import { ProductElement } from "./ProductElement";

export const ProductList = ({
  products,
}: {
  products: AllProductsQueryResult;
}) => {
  return (
    <ul
      role="list"
      data-testid="ProductList"
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product, index) => (
        <ProductElement
          key={product._id}
          product={product}
          priority={index < 2}
          loading={index < 3 ? "eager" : "lazy"}
        />
      ))}
    </ul>
  );
};

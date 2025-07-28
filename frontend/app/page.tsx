import { sanityFetch } from "@/sanity/lib/live";
import { allProductsQuery } from "@/sanity/lib/queries";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
  title: "ACME Storefront, powered by Saleor & Next.js",
  description:
    "Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

export default async function Page() {
  const { data: products } = await sanityFetch({
    query: allProductsQuery,
  });

  return (
    <section className="mx-auto max-w-7xl p-8 pb-16">
      <h2 className="sr-only">Product list</h2>
      <ProductList products={products} />
    </section>
  );
}

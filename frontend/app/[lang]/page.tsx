import { sanityFetch } from "@/sanity/lib/live";
import { allProductsQuery } from "@/sanity/lib/queries";
import { ProductList } from "@/ui/components/ProductList";

export default async function Page() {
  const { data: products } = await sanityFetch({
    query: allProductsQuery,
  });

  return (
    <section className="mx-auto max-w-7xl p-8 pb-16">
      <ProductList products={products} />
    </section>
  );
}

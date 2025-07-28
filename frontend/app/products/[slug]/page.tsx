import edjsHTML from "editorjs-html";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import xss from "xss";
import { QuantitySelector } from "@/app/products/[slug]/QuantitySelector";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { Gallery } from "@/ui/components/Gallery";
import { AvailabilityMessage } from "@/ui/components/AvailabilityMessage";
import { formatMoney } from "@/utils/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { allProductsQuery, productQuery } from "@/sanity/lib/queries";

// export async function generateMetadata(
//   props: {
//     params: Promise<{ slug: string; channel: string }>;
//     searchParams: Promise<{ variant?: string }>;
//   },
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const [searchParams, params] = await Promise.all([
//     props.searchParams,
//     props.params,
//   ]);

//   const { data: product } = await sanityFetch({
//     query: productQuery,
//     params: {
//       slug: decodeURIComponent(params.slug),
//     },
//   });

//   if (!product) {
//     notFound();
//   }

//   const productName = product.seoTitle || product.name;
//   const variantName = product.variants?.find(
//     ({ id }) => id === searchParams.variant
//   )?.name;
//   const productNameAndVariant = variantName
//     ? `${productName} - ${variantName}`
//     : productName;

//   return {
//     title: `${product.name} | ${product.seoTitle || (await parent).title?.absolute}`,
//     description: product.seoDescription || productNameAndVariant,
//     alternates: {
//       canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
//         ? process.env.NEXT_PUBLIC_STOREFRONT_URL +
//           `/products/${encodeURIComponent(params.slug)}`
//         : undefined,
//     },
//     openGraph: product.thumbnail
//       ? {
//           images: [
//             {
//               url: product.thumbnail.url,
//               alt: product.name,
//             },
//           ],
//         }
//       : null,
//   };
// }

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: allProductsQuery,
    perspective: "published",
    stega: false,
  });
  return data;
}

const parser = edjsHTML();

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const { data: product } = await sanityFetch({
    query: productQuery,
    params: {
      slug: decodeURIComponent(slug),
    },
  });

  if (!product) {
    notFound();
  }

  const description = product?.description;
  const price = formatMoney(product?.price || 93);
  // const isAvailable = variants?.some((variant) => variant.quantityAvailable) ?? false;

  return (
    <section className="mx-auto grid max-w-7xl p-8">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-8">
        <div className="md:col-span-1 lg:col-span-5">
          <Gallery images={product.images || []} />
        </div>
        <div className="flex flex-col pt-6 sm:col-span-1 sm:px-6 sm:pt-0 lg:col-span-3 lg:pt-16">
          <div>
            <h1 className="mb-4 flex-auto text-3xl font-medium tracking-tight text-neutral-900">
              {product?.name}
            </h1>
            <p className="mb-8 text-sm " data-testid="ProductElement_Price">
              {price}
            </p>
            <AvailabilityMessage isAvailable />
            <QuantitySelector product={product} />
            {description && (
              <div className="mt-8 space-y-6 text-sm text-neutral-500">
                {/* {description.map((content) => ( */}
                <div
                  // key={content}
                  dangerouslySetInnerHTML={{ __html: xss(description) }}
                />
                {/* ))} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import xss from 'xss';

import { i18n } from '@/i18n-config';
import { sanityFetch } from '@/sanity/lib/live';
import { allProductsQuery, productQuery, settingsQuery } from '@/sanity/lib/queries';
import { AvailabilityMessage } from '@/ui/components/AvailabilityMessage';
import { Gallery } from '@/ui/components/Gallery';
import { formatMoney } from '@/utils/utils';

import { QuantitySelector } from './QuantitySelector';
import { TrackViewContent } from './TrackViewContent';

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { data: product } = await sanityFetch({
    query: productQuery,
    params: {
      slug: decodeURIComponent(params.slug),
      lang: params.lang,
    },
  });

  if (!product) {
    notFound();
  }

  const productName = product.name[params.lang as keyof typeof product.name];
  const productDescription = product.description[params.lang as keyof typeof product.description];

  // Fetch settings to get the site URL
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const siteUrl = settings?.data?.url || '';

  return {
    title: productName,
    description: productDescription,
    alternates: {
      canonical: siteUrl
        ? `${siteUrl}/${params.lang}/products/${encodeURIComponent(params.slug)}`
        : undefined,
      languages: Object.fromEntries(
        i18n.locales.map((locale) => [
          locale,
          siteUrl ? `${siteUrl}/${locale}/products/${encodeURIComponent(params.slug)}` : undefined,
        ]),
      ),
    },
    openGraph:
      product.images && product.images.length > 0
        ? {
            images: [
              {
                url: product.images[0].asset?.url || '',
                alt: productName,
              },
            ],
          }
        : null,
  };
}

export async function generateStaticParams() {
  try {
    const { data: products } = await sanityFetch({
      query: allProductsQuery,
      perspective: 'published',
      stega: false,
    });

    if (!products || products.length === 0) {
      return [];
    }

    return i18n.locales.flatMap((lang) =>
      products.map((product) => ({
        lang,
        slug: product.slug,
      })),
    );
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function Page(props: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await props.params;
  const dictionary = (await import(`@/public/locales/${lang}/common.json`)).default;

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
  const price = formatMoney(product?.price, lang);
  const isRTL = lang === 'ar';

  return (
    <section className="mx-auto grid max-w-7xl p-8">
      <TrackViewContent
        product={{
          id: product._id,
          name: product.name[lang as keyof typeof product.name],
          price: product.price,
          currency: 'DZD',
        }}
      />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-8">
        <div className={`md:col-span-1 lg:col-span-5 ${isRTL ? 'sm:order-2' : 'sm:order-1'}`}>
          <Gallery images={product.images || []} />
        </div>
        <div
          className={`flex flex-col pt-6 sm:col-span-1 sm:px-6 sm:pt-0 lg:col-span-3 lg:pt-16 ${isRTL ? 'text-right sm:order-1' : 'sm:order-2'}`}
        >
          <div>
            <h1 className="mb-4 flex-auto text-3xl font-medium tracking-tight text-neutral-900">
              {product?.name[lang as keyof typeof product.name]}
            </h1>
            <div className="mb-8">
              <span className="font-medium text-sm">{dictionary.common.product.price}: </span>
              <span className="text-sm" data-testid="ProductElement_Price">
                {price}
              </span>
            </div>
            <AvailabilityMessage isAvailable={true} lang={lang} />
            <QuantitySelector
              product={product}
              translations={{
                addToCart: dictionary.common.product.addToCart,
                orderNow: dictionary.common.product.orderNow,
                payOnDelivery: dictionary.common.product.payOnDelivery,
                orderForm: dictionary.common.orderForm,
                messages: dictionary.common.messages,
                trust: dictionary.common.trust,
              }}
            />
            {description && (
              <div className="mt-6">
                <h2 className="font-medium text-sm mb-4">
                  {dictionary.common.product.description}
                </h2>
                <div className="space-y-6 text-sm text-neutral-500">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: xss(description[lang as keyof typeof description]),
                    }}
                  />
                  <div>{description[lang as keyof typeof description]}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

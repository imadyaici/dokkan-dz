import './globals.css';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { Toaster } from 'sonner';

import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { settingsQuery } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';
import { FacebookPixel } from '@/ui/components/FacebookPixel';
import { Footer } from '@/ui/components/Footer';
import { Header } from '@/ui/components/Header';
import { handleError } from '@/utils/client-utils';

import type { Metadata } from 'next';

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });

  const title = settings?.title?.[lang as keyof typeof settings.title] || '';
  const description = settings?.description?.[lang as keyof typeof settings.description] || '';
  const keywords = settings?.keywords?.[lang as keyof typeof settings.keywords] || [];
  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  const metadataBase = settings?.ogImage?.metadataBase
    ? new URL(settings.ogImage.metadataBase)
    : undefined;

  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description,
    keywords: keywords.join(', '),
    robots: settings?.robotsTxt || 'index, follow',
    openGraph: {
      title,
      description: description,
      images: ogImage
        ? [ogImage]
        : settings?.logo
          ? [
              {
                url: settings.logo,
                alt: settings.logoAlt || 'Logo',
              },
            ]
          : [],
      locale: lang,
      type: 'website',
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description,
      images: ogImage ? [ogImage.url] : settings?.logo ? [settings.logo] : [],
    },
    alternates: {
      canonical: settings?.url,
      languages: {
        fr: '/fr',
        ar: '/ar',
      },
    },
  };
}

const inter = Inter({ subsets: ['latin'] });
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  return (
    <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'} className="min-h-dvh">
      <body
        className={`${isRTL ? notoSansArabic.className : inter.className} ${notoSansArabic.variable} min-h-dvh`}
      >
        <FacebookPixel />
        <Toaster richColors />
        <SanityLive onError={handleError} />
        <Header lang={lang} />
        <div className="flex min-h-[calc(100dvh-64px)] flex-col">
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
        </div>
      </body>
    </html>
  );
}

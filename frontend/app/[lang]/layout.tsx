import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { toPlainText } from "next-sanity";
import { Toaster } from "sonner";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { handleError } from "@/utils/client-utils";
import { Header } from "@/ui/components/Header";
import { Footer } from "@/ui/components/Footer";

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

  const dictionary = (await import(`@/public/locales/${lang}/common.json`)).default;

  // Use settings title if available, otherwise fall back to dictionary
  const title = settings?.title?.[lang as keyof typeof settings.title] || 
                dictionary.common.meta.title || 
                demo.title;
  
  // Use settings tagline if available, otherwise fall back to dictionary
  const description = settings?.tagline?.[lang as keyof typeof settings.tagline] || 
                     dictionary.common.meta.description || 
                     demo.description;

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: settings?.logo ? [
        {
          url: settings.logo,
          alt: settings.logoAlt || 'Logo',
        }
      ] : [],
    },
  };
}

const inter = Inter({ subsets: ["latin"] });
const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  variable: "--font-arabic"
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
      <body className={`${inter.className} ${notoSansArabic.variable} min-h-dvh`}>
        <Toaster richColors />
        <SanityLive onError={handleError} />
        <Header />
        <div className="flex min-h-[calc(100dvh-64px)] flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

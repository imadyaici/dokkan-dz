import { i18n } from '@/i18n-config';

export function getCurrentLang(params: Promise<{ lang: string }> | { lang: string }): string {
  // Handle both Promise and direct object
  if (params instanceof Promise) {
    // This is a Promise, we need to await it in the calling function
    throw new Error(
      'getCurrentLang expects resolved params. Use getCurrentLangAsync for Promise params.',
    );
  }

  return params.lang || i18n.defaultLocale;
}

export async function getCurrentLangAsync(params: Promise<{ lang: string }>): Promise<string> {
  const resolvedParams = await params;
  return resolvedParams.lang || i18n.defaultLocale;
}

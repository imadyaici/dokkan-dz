'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useCurrentLang } from '@/hooks/useCurrentLang';
import { i18n } from '@/i18n-config';

export function LocaleSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = useCurrentLang();

  const redirectedPathname = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const changeLanguage = (lang: string) => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    router.push(redirectedPathname(lang));
  };

  return (
    <div className="flex gap-2 text-sm">
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => changeLanguage(locale)}
          className={`rounded px-4 py-2 ${
            currentLang === locale ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'
          } ${locale === 'ar' ? 'font-arabic' : ''}`}
          style={locale === 'ar' ? { fontFamily: 'var(--font-arabic)' } : {}}
        >
          {locale === 'ar' ? 'عربي' : 'Français'}
        </button>
      ))}
    </div>
  );
}

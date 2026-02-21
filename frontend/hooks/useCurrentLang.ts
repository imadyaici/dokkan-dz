'use client';

import { usePathname } from 'next/navigation';

import { i18n } from '@/i18n-config';

export function useCurrentLang() {
  const pathname = usePathname();
  return pathname.split('/')[1] || i18n.defaultLocale;
}

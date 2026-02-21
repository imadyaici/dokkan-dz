import { LocaleSelector } from './LocaleSelector';
import { Logo } from './Logo';
import { Nav } from './nav/Nav';

import { sanityFetch } from '@/sanity/lib/live';
import { settingsQuery } from '@/sanity/lib/queries';

export async function Header(props: { lang: string }) {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  return (
    <header className="sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-8">
        <div className="flex h-16 justify-between items-center gap-4 md:gap-8">
          <Logo
            logo={settings?.logo || '/images/dokkan-logo.png'}
            alt={settings?.logoAlt || 'Dokkan Dz Logo'}
          />
          <Nav lang={props.lang} />
          <LocaleSelector />
        </div>
      </div>
    </header>
  );
}

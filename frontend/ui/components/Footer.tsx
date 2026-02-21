import Link from 'next/link';

export async function Footer({ lang }: { lang: string }) {
  const currentYear = new Date().getFullYear();
  const dictionary = (await import(`@/public/locales/${lang}/common.json`)).default;
  const isRTL = lang === 'ar';

  return (
    <footer className="border-neutral-300 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-3 gap-8 py-16">
          <ul
            className={`mt-4 space-y-4 [&>li]:text-neutral-500 ${isRTL ? 'text-right col-start-3' : ''}`}
          >
            <li className="text-sm">
              <Link href={`/${lang}/contact-us`}>{dictionary.common.navigation.contact}</Link>
            </li>
            <li className="text-sm">
              <Link href={`/${lang}/about-us`}>{dictionary.common.navigation.about}</Link>
            </li>
          </ul>
        </div>

        <div
          className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row"
          dir="ltr"
        >
          <p className="text-sm text-neutral-500">Copyright &copy; {currentYear} Dokkan</p>
          <p className="flex gap-1 text-sm text-neutral-500">
            Created by{' '}
            <Link href={'https://github.com/imadyaici'} target={'_blank'} className={'opacity-30'}>
              Imad Yaici
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

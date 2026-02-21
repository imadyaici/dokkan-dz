import { NavLink } from './components/NavLink';

const links = [
  {
    href: '',
    name: 'home',
  },
];

export const Nav = async (props: { lang: string }) => {
  const { lang } = props;
  const dictionary = (await import(`@/public/locales/${lang}/common.json`)).default;

  const navLinks = links.map((link) => (
    <NavLink key={link.href} href={`/${lang}${link.href}`}>
      {dictionary.common.navigation[link.name]}
    </NavLink>
  ));

  return (
    <nav className="flex gap-4 lg:gap-6" aria-label="Main navigation">
      <ul className="hidden gap-4 whitespace-nowrap md:flex lg:gap-8 lg:px-0">{navLinks}</ul>
    </nav>
  );
};

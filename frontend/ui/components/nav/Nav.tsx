import { Suspense } from "react";
// import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
import { NavLink } from "./components/NavLink";
// import { SearchBar } from "./components/SearchBar";

const links = [
	{
		href: "",
		name: "home",
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
			<ul className="hidden gap-4 whitespace-nowrap md:flex lg:gap-8 lg:px-0">
				{navLinks}
			</ul>
			<div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8">
				{/* <div className="hidden lg:flex">
					<SearchBar />
				</div> */}
			</div>
			<Suspense>
				<MobileMenu>
					{navLinks}
				</MobileMenu>
			</Suspense>
		</nav>
	);
};

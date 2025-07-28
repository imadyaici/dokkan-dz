import { Suspense } from "react";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
// import { SearchBar } from "./components/SearchBar";

export const Nav = () => {
	return (
		<nav className="flex w-full gap-4 lg:gap-6" aria-label="Main navigation">
			<ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
				<NavLinks />
			</ul>
			<div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8">
				{/* <div className="hidden lg:flex">
					<SearchBar />
				</div> */}
			</div>
			<Suspense>
				<MobileMenu>
					<NavLinks />
				</MobileMenu>
			</Suspense>
		</nav>
	);
};

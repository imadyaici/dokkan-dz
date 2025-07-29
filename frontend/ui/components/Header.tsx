import { Logo } from "./Logo";
import { LocaleSelector } from "./LocaleSelector";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
// import { Nav } from "./nav/Nav";

export async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  return (
    <header className="sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-8">
        <div className="flex h-16 justify-between items-center gap-4 md:gap-8">
          <Logo logo={settings?.logo || "/images/dokkan-logo.png"} alt={settings?.logoAlt || "Dokkan Dz Logo"} />
          <LocaleSelector />
        </div>
      </div>
    </header>
  );
}

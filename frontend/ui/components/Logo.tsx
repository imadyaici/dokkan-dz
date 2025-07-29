"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCurrentLang } from "@/hooks/useCurrentLang";

export const Logo = ({ logo, alt }: { logo: string; alt: string }) => {
  const currentLang = useCurrentLang();
  const pathname = usePathname();

  const logoImg = (
    <Image
      src={logo}
      alt={alt}
      width={80}
      height={40}
      className="h-10 w-auto"
      priority
    />
  );

  const isHomePage = pathname === `/${currentLang}`;

  if (isHomePage) {
    return (
      <h1 className="flex items-center font-bold" aria-label="homepage">
        {logoImg}
      </h1>
    );
  }

  return (
    <div className="flex items-center font-bold">
      <Link aria-label="homepage" href={`/${currentLang}`}>
        {logoImg}
      </Link>
    </div>
  );
};

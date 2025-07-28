"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  const pathname = usePathname();

  const logoImg = (
    <Image
      src="/images/dokkan-logo.png"
      alt="Dokkan Dz Logo"
      width={80}
      height={40}
      className="h-10 w-auto"
      priority
    />
  );
  if (pathname === "/") {
    return (
      <h1 className="flex items-center font-bold" aria-label="homepage">
        {logoImg}
      </h1>
    );
  }
  return (
    <div className="flex items-center font-bold">
      <Link aria-label="homepage" href="/">
        {logoImg}
      </Link>
    </div>
  );
};

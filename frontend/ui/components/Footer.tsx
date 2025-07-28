import Link from "next/link";

export async function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-neutral-300 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
          <p className="text-sm text-neutral-500">
            Copyright &copy; {currentYear} Dokkan
          </p>
          <p className="flex gap-1 text-sm text-neutral-500">
            Created by{" "}
            <Link
              href={"https://github.com/imadyaici"}
              target={"_blank"}
              className={"opacity-30"}
            >
              Imad Yaici
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

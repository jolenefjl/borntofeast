import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#240B36] bg-[#e55224] px-5 pt-4 sm:px-8 lg:pt-6">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 pb-4 text-sm font-medium lowercase"
      >
        <Link href="/" aria-label="Born to Feast home">
          <Image
            src="/born-to-feast-logo.svg"
            alt="Born to Feast"
            width={121}
            height={47}
            priority
            className="h-auto w-[8.65rem] sm:w-[10.1rem]"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-8">
          <Link href="/#recipes">recipes</Link>
          <Link href="/#categories">ingredients</Link>
          <Link href="/about">about</Link>
          <Link href="/search" aria-label="search">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.1-5.15a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}

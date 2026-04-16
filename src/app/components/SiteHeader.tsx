"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";

import {
  localeLabels,
  locales,
  localizedPath,
  swapLocale,
  type Locale,
} from "@/i18n/config";
import type {Dictionary} from "@/i18n/dictionaries";

type SiteHeaderProps = {
  locale: Locale;
  labels: Dictionary["nav"];
};

export function SiteHeader({locale, labels}: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#240B36] bg-[#e55224] px-5 pt-4 sm:px-8 lg:pt-6">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 pb-4 text-sm font-medium lowercase"
      >
        <Link href={localizedPath(locale)} aria-label="Born to Feast home">
          <Image
            src="/born-to-feast-logo.svg"
            alt="Born to Feast"
            width={121}
            height={47}
            priority
            className="h-auto w-[8.65rem] sm:w-[10.1rem]"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <Link href={`${localizedPath(locale)}/#recipes`}>
            {labels.recipes}
          </Link>
          <Link href={`${localizedPath(locale)}/#categories`}>
            {labels.ingredients}
          </Link>
          <Link href={localizedPath(locale, "/about")}>{labels.about}</Link>
          <Link href={localizedPath(locale, "/search")} aria-label={labels.search}>
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
          <div
            aria-label={labels.languageLabel}
            className="flex items-center gap-2 border-2 border-[#240B36] bg-[#ffd447] px-2 py-1 text-xs font-semibold uppercase leading-[0.9]"
          >
            {locales.map((item) => (
              <Link
                key={item}
                href={swapLocale(pathname, item)}
                aria-current={item === locale ? "page" : undefined}
                className={item === locale ? "underline" : undefined}
              >
                {localeLabels[item]}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

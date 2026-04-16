"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

import {
  localeLabels,
  locales,
  localizedPath,
  swapLocale,
  type Locale,
} from "@/i18n/config";
import type {Dictionary} from "@/i18n/dictionaries";
import type {SiteLink} from "@/app/components/siteChrome";

type SiteHeaderProps = {
  locale: Locale;
  labels: Dictionary["nav"];
  navigationItems?: SiteLink[];
};

export function SiteHeader({locale, labels, navigationItems}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const items =
    navigationItems?.length
      ? navigationItems
      : [
          {label: labels.recipes, href: localizedPath(locale, "/recipes")},
          {label: labels.about, href: localizedPath(locale, "/about")},
        ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#240B36] bg-[#e55224] px-4 pt-3 sm:px-8 lg:pt-6">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 pb-3 text-sm font-medium lowercase sm:gap-4 sm:pb-4"
      >
        <Link href={localizedPath(locale)} aria-label="Born to Feast home">
          <Image
            src="/born-to-feast-logo.svg"
            alt="Born to Feast"
            width={121}
            height={47}
            priority
            className="h-auto w-[7.9rem] sm:w-[10.1rem]"
          />
        </Link>
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="site-navigation-menu"
          className="flex h-11 w-11 items-center justify-center border-2 border-[#240B36] bg-[#ffd447] shadow-[3px_3px_0_#240B36] md:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="grid gap-1.5" aria-hidden="true">
            <span className="block h-0.5 w-5 bg-[#240B36]" />
            <span className="block h-0.5 w-5 bg-[#240B36]" />
            <span className="block h-0.5 w-5 bg-[#240B36]" />
          </span>
        </button>
        <div
          id="site-navigation-menu"
          className={`w-full flex-col gap-2 border-t-2 border-[#240B36] pt-3 text-base md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-6 md:border-t-0 md:pt-0 md:text-sm lg:gap-8 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {items.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              target={item.openInNewTab ? "_blank" : undefined}
              rel={item.openInNewTab ? "noreferrer" : undefined}
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 items-center border-b-2 border-[#240B36]/35 py-2 last:border-b-0 md:min-h-0 md:border-b-0 md:py-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={localizedPath(locale, "/search")}
            aria-label={labels.search}
            onClick={() => setIsOpen(false)}
            className="flex min-h-11 items-center border-b-2 border-[#240B36]/35 py-2 md:min-h-0 md:border-b-0 md:py-0"
          >
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
            className="mt-2 flex w-fit items-center gap-2 border-2 border-[#240B36] bg-[#ffd447] px-3 py-2 text-xs font-semibold uppercase leading-[0.9] md:mt-0 md:px-2 md:py-1"
          >
            {locales.map((item) => (
              <Link
                key={item}
                href={swapLocale(pathname, item)}
                aria-current={item === locale ? "page" : undefined}
                className={`flex min-h-8 items-center ${item === locale ? "underline" : ""}`}
                onClick={() => setIsOpen(false)}
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

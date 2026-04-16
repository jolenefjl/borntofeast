import Image from "next/image";
import Link from "next/link";

import type {SiteChrome} from "@/app/components/siteChrome";

type SiteFooterProps = {
  footer: SiteChrome["footer"];
};

export function SiteFooter({footer}: SiteFooterProps) {
  return (
    <footer className="border-t-4 border-[#240B36] bg-[#e55224] px-4 py-9 text-[#240B36] sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1.2fr] md:items-end">
        <div>
          <Image
            src="/born-to-feast-logo.svg"
            alt="Born to Feast"
            width={150}
            height={58}
            className="h-auto w-32 sm:w-36"
          />
          <p className="mt-5 max-w-prose text-base leading-[1.55rem] sm:text-lg sm:leading-[1.65rem]">
            {footer.intro}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
              {footer.newsletterHeading}
            </p>
            <Link
              href={footer.newsletterHref}
              className="mt-5 inline-flex min-h-11 items-center border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-black uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
            >
              {footer.newsletterCtaLabel}
            </Link>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-2 text-base font-medium lowercase sm:flex sm:flex-wrap sm:gap-4 sm:text-sm"
          >
            {footer.links.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noreferrer" : undefined}
                className="flex min-h-10 items-center sm:min-h-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

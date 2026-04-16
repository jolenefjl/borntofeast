import {locales, type Locale} from "@/i18n/config";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://borntofeast.vercel.app";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function localeAlternates(pathWithoutLocale: string) {
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      absoluteUrl(`/${locale}${pathWithoutLocale}`),
    ]),
  ) as Record<Locale, string>;
}

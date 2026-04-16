export const locales = ["en", "no"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  no: "Norsk",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function swapLocale(pathname: string, locale: Locale) {
  const parts = pathname.split("/");

  if (isLocale(parts[1])) {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }

  return localizedPath(locale, pathname);
}

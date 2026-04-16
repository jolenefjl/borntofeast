import type {Locale} from "@/i18n/config";

export type LocalizedValue<T> = T | Partial<Record<Locale, T>> | null | undefined;

export function resolveLocalized<T>(
  value: LocalizedValue<T>,
  locale: Locale,
  fallback?: T,
) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const localized = value as Partial<Record<Locale, T>>;
    return localized[locale] ?? fallback;
  }

  if (locale === "en" && value != null) {
    return value as T;
  }

  return fallback;
}

export function resolveLocalizedString(
  value: LocalizedValue<string>,
  locale: Locale,
  fallback = "",
) {
  return resolveLocalized(value, locale, fallback) || "";
}

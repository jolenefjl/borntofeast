import {en} from "@/i18n/dictionaries/en";
import {no} from "@/i18n/dictionaries/no";
import type {Locale} from "@/i18n/config";

export const dictionaries = {
  en,
  no,
};

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

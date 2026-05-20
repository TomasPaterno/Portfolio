import type { Locale } from "@/i18n/routing";

export type { Locale };

export type LocalizedString = {
  es: string;
  en: string;
};

export type LocalizedStringInput = LocalizedString | string;

export function pickLocalized(
  value: LocalizedStringInput,
  locale: Locale,
): string {
  if (typeof value === "string") {
    return value;
  }
  return value[locale] ?? value.es;
}

export type LocalizedArray = {
  es: string[];
  en: string[];
};

export function pickLocalizedTags(
  value: LocalizedArray | string[],
  locale: Locale,
): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value[locale] ?? value.es;
}

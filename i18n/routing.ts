import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export function parseLocale(locale: string | undefined): Locale | null {
  if (!locale) return null;
  return routing.locales.includes(locale as Locale) ? (locale as Locale) : null;
}

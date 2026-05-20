import siteJson from "@/content/site.json";
import {
  getSiteConfig as getSiteConfigAsync,
  resolveSiteConfig,
  siteSchema,
  type SiteConfig,
  type SiteConfigRaw,
} from "@/lib/content/site";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const siteRaw = siteSchema.parse(siteJson) as SiteConfigRaw;

/** Synchronous site config for client components (build-time JSON). */
export function getSiteConfig(locale: Locale): SiteConfig {
  return resolveSiteConfig(siteRaw, locale);
}

export { getSiteConfigAsync, type SiteConfig, type SiteConfigRaw };

/** @deprecated Use getSiteConfig(locale) */
export const siteConfig = getSiteConfig(routing.defaultLocale);

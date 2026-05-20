import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/i18n/routing";
import {
  shouldReloadContentFromDisk,
  getSiteRawCache,
  setSiteRawCache,
} from "@/lib/content/content-cache";
import { siteSchema, type SiteConfigRaw } from "@/lib/content/schemas";
import { pickLocalized } from "@/lib/i18n/localized";

export { siteSchema, type SiteConfigRaw } from "@/lib/content/schemas";

export type SiteConfig = {
  name: string;
  author: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
  email: string;
  locale: string;
  openGraphLocale: string;
  social: {
    github: string;
    linkedin: string;
  };
  links: SiteConfigRaw["links"];
  navigation: SiteConfigRaw["navigation"];
  homeSections: NonNullable<SiteConfigRaw["homeSections"]>;
};

export function resolveSiteConfig(
  data: SiteConfigRaw,
  locale: Locale,
): SiteConfig {
  return {
    name: data.name,
    author: data.name,
    title: pickLocalized(data.title, locale),
    description: pickLocalized(data.description, locale),
    url: data.url,
    ogImage: data.ogImage,
    keywords: data.keywords[locale] ?? data.keywords.es,
    email: data.email,
    locale: locale === "es" ? "es_AR" : "en_US",
    openGraphLocale: locale === "es" ? "es_AR" : "en_US",
    social: {
      github: data.links.github,
      linkedin: data.links.linkedin,
    },
    links: data.links,
    navigation: data.navigation,
    homeSections: data.homeSections ?? {
      featuredProjects: true,
      skillsMarquee: true,
      ctaStrip: true,
    },
  };
}

export async function loadSiteRaw(): Promise<SiteConfigRaw> {
  const cached = getSiteRawCache();
  if (cached && !shouldReloadContentFromDisk()) return cached;
  const filePath = path.join(process.cwd(), "content", "site.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = siteSchema.parse(JSON.parse(raw));
  setSiteRawCache(parsed);
  return parsed;
}

export async function getSiteConfig(locale: Locale): Promise<SiteConfig> {
  const data = await loadSiteRaw();
  return resolveSiteConfig(data, locale);
}

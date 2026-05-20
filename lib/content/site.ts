import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { pickLocalized } from "@/lib/i18n/localized";

const localizedStringSchema = z.object({
  es: z.string(),
  en: z.string(),
});

const localizedStringArraySchema = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()),
});

const navigationItemSchema = z.object({
  href: z.string(),
  labelKey: z.string(),
  enabled: z.boolean().default(true),
});

export const siteSchema = z.object({
  name: z.string(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  url: z.string().url(),
  ogImage: z.string(),
  keywords: localizedStringArraySchema,
  email: z.string().email(),
  links: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    email: z.string(),
  }),
  navigation: z.array(navigationItemSchema),
  homeSections: z
    .object({
      featuredProjects: z.boolean().default(true),
      skillsMarquee: z.boolean().default(true),
      ctaStrip: z.boolean().default(true),
    })
    .optional(),
});

export type SiteConfigRaw = z.infer<typeof siteSchema>;

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

let rawCache: SiteConfigRaw | null = null;

export async function loadSiteRaw(): Promise<SiteConfigRaw> {
  if (rawCache) return rawCache;
  const filePath = path.join(process.cwd(), "content", "site.json");
  const raw = await fs.readFile(filePath, "utf-8");
  rawCache = siteSchema.parse(JSON.parse(raw));
  return rawCache;
}

export async function getSiteConfig(locale: Locale): Promise<SiteConfig> {
  const data = await loadSiteRaw();
  return resolveSiteConfig(data, locale);
}

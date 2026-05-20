import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/i18n/routing";
import {
  shouldReloadContentFromDisk,
  getAboutRawCache,
  setAboutRawCache,
} from "@/lib/content/content-cache";
import { aboutSchema, type AboutRaw } from "@/lib/content/schemas";
import { pickLocalized } from "@/lib/i18n/localized";

export { aboutSchema, type AboutRaw } from "@/lib/content/schemas";

export type AboutContent = {
  intro: string;
  timeline: Array<{ year: string; title: string; description: string }>;
  values: Array<{ title: string; description: string }>;
};

async function loadAboutRaw(): Promise<AboutRaw> {
  const cached = getAboutRawCache();
  if (cached && !shouldReloadContentFromDisk()) return cached;
  const filePath = path.join(process.cwd(), "content", "about.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = aboutSchema.parse(JSON.parse(raw));
  setAboutRawCache(parsed);
  return parsed;
}

export async function getAboutContent(locale: Locale): Promise<AboutContent> {
  const data = await loadAboutRaw();
  return {
    intro: pickLocalized(data.intro, locale),
    timeline: data.timeline.map((item) => ({
      year: pickLocalized(item.year, locale),
      title: pickLocalized(item.title, locale),
      description: pickLocalized(item.description, locale),
    })),
    values: data.values.map((item) => ({
      title: pickLocalized(item.title, locale),
      description: pickLocalized(item.description, locale),
    })),
  };
}

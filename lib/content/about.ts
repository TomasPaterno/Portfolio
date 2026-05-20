import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { pickLocalized } from "@/lib/i18n/localized";

const localizedStringSchema = z.object({
  es: z.string(),
  en: z.string(),
});

const timelineItemSchema = z.object({
  year: localizedStringSchema,
  title: localizedStringSchema,
  description: localizedStringSchema,
});

const valueItemSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
});

const aboutSchema = z.object({
  intro: localizedStringSchema,
  timeline: z.array(timelineItemSchema),
  values: z.array(valueItemSchema),
});

export type AboutContent = {
  intro: string;
  timeline: Array<{ year: string; title: string; description: string }>;
  values: Array<{ title: string; description: string }>;
};

let cache: z.infer<typeof aboutSchema> | null = null;

async function loadAboutRaw() {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "content", "about.json");
  const raw = await fs.readFile(filePath, "utf-8");
  cache = aboutSchema.parse(JSON.parse(raw));
  return cache;
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

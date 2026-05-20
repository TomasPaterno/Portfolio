import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { pickLocalized, type LocalizedString } from "@/lib/i18n/localized";

const localizedStringSchema = z.object({
  es: z.string(),
  en: z.string(),
});

const tagsSchema = z.record(z.string(), localizedStringSchema);

let tagsCache: Record<string, LocalizedString> | null = null;

export async function getTagRegistry(): Promise<Record<string, LocalizedString>> {
  if (tagsCache) return tagsCache;
  const filePath = path.join(process.cwd(), "content", "registries", "tags.json");
  const raw = await fs.readFile(filePath, "utf-8");
  tagsCache = tagsSchema.parse(JSON.parse(raw));
  return tagsCache;
}

export async function resolveTagLabels(
  tagIds: string[],
  locale: Locale,
): Promise<string[]> {
  const registry = await getTagRegistry();
  return tagIds.map((id) => {
    const entry = registry[id];
    if (!entry) return id;
    return pickLocalized(entry, locale);
  });
}

export function getTagLabel(
  registry: Record<string, LocalizedString>,
  tagId: string,
  locale: Locale,
): string {
  const entry = registry[tagId];
  return entry ? pickLocalized(entry, locale) : tagId;
}

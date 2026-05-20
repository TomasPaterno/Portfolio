import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { pickLocalized } from "@/lib/i18n/localized";

const localizedStringSchema = z.object({
  es: z.string(),
  en: z.string(),
});

const skillCategorySchema = z.object({
  id: z.string(),
  title: localizedStringSchema,
  skills: z.array(localizedStringSchema),
});

export const skillsSchema = z.object({
  categories: z.array(skillCategorySchema),
});

export type SkillsRaw = z.infer<typeof skillsSchema>;

export type SkillCategory = {
  id: string;
  title: string;
  skills: string[];
};

export function resolveSkillCategories(
  data: SkillsRaw,
  locale: Locale,
): SkillCategory[] {
  return data.categories.map((cat) => ({
    id: cat.id,
    title: pickLocalized(cat.title, locale),
    skills: cat.skills.map((s) => pickLocalized(s, locale)),
  }));
}

let cache: SkillsRaw | null = null;

export async function loadSkillsRaw(): Promise<SkillsRaw> {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "content", "skills.json");
  const raw = await fs.readFile(filePath, "utf-8");
  cache = skillsSchema.parse(JSON.parse(raw));
  return cache;
}

export async function getSkillCategoriesAsync(
  locale: Locale,
): Promise<SkillCategory[]> {
  const data = await loadSkillsRaw();
  return resolveSkillCategories(data, locale);
}

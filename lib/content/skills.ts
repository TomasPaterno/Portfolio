import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/i18n/routing";
import {
  shouldReloadContentFromDisk,
  getSkillsRawCache,
  setSkillsRawCache,
} from "@/lib/content/content-cache";
import { skillsSchema, type SkillsRaw } from "@/lib/content/schemas";
import { pickLocalized } from "@/lib/i18n/localized";

export { skillsSchema, type SkillsRaw } from "@/lib/content/schemas";

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

export async function loadSkillsRaw(): Promise<SkillsRaw> {
  const cached = getSkillsRawCache();
  if (cached && !shouldReloadContentFromDisk()) return cached;
  const filePath = path.join(process.cwd(), "content", "skills.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = skillsSchema.parse(JSON.parse(raw));
  setSkillsRawCache(parsed);
  return parsed;
}

export async function getSkillCategoriesAsync(
  locale: Locale,
): Promise<SkillCategory[]> {
  const data = await loadSkillsRaw();
  return resolveSkillCategories(data, locale);
}

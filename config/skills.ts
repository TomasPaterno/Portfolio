import skillsJson from "@/content/skills.json";
import {
  resolveSkillCategories,
  skillsSchema,
  type SkillCategory,
} from "@/lib/content/skills";
import type { Locale } from "@/i18n/routing";

const skillsRaw = skillsSchema.parse(skillsJson);

export function getSkillCategories(locale: Locale): SkillCategory[] {
  return resolveSkillCategories(skillsRaw, locale);
}

export type { SkillCategory };

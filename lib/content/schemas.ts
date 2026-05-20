import { z } from "zod";

export const localizedStringSchema = z.object({
  es: z.string(),
  en: z.string(),
});

export const localizedStringArraySchema = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()),
});

export const projectLocalizedStringSchema = z.union([
  z.object({
    es: z.string().min(1),
    en: z.string().min(1),
  }),
  z.string().min(1),
]);

export const localizedSeoSchema = z.object({
  title: projectLocalizedStringSchema.optional(),
  description: projectLocalizedStringSchema.optional(),
  noindex: z.boolean().optional(),
});

export const technicalDetailSchema = z.object({
  label: projectLocalizedStringSchema,
  value: projectLocalizedStringSchema,
});

export const metricSchema = z.object({
  label: projectLocalizedStringSchema,
  value: projectLocalizedStringSchema,
  unit: projectLocalizedStringSchema.optional(),
});

export const projectFrontmatterSchema = z.object({
  slug: z.string().optional(),
  title: projectLocalizedStringSchema,
  description: projectLocalizedStringSchema,
  shortDescription: projectLocalizedStringSchema,
  tagIds: z.array(z.string()).min(1),
  technologies: z.array(z.string()),
  coverImage: z.string(),
  galleryImages: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  date: z.string(),
  updatedAt: z.string().optional(),
  status: z.enum(["completed", "in-progress", "archived"]),
  markdownContent: projectLocalizedStringSchema.optional(),
  technicalDetails: z.array(technicalDetailSchema).default([]),
  metrics: z.array(metricSchema).default([]),
  videoUrl: z.string().url().optional(),
  seo: localizedSeoSchema.optional(),
});

export const navigationItemSchema = z.object({
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

export const skillCategorySchema = z.object({
  id: z.string(),
  title: localizedStringSchema,
  skills: z.array(localizedStringSchema),
});

export const skillsSchema = z.object({
  categories: z.array(skillCategorySchema),
});

export const aboutTimelineItemSchema = z.object({
  year: localizedStringSchema,
  title: localizedStringSchema,
  description: localizedStringSchema,
});

export const aboutValueItemSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
});

export const aboutSchema = z.object({
  intro: localizedStringSchema,
  timeline: z.array(aboutTimelineItemSchema),
  values: z.array(aboutValueItemSchema),
});

export type ProjectFrontmatterRaw = z.infer<typeof projectFrontmatterSchema>;
export type TechnicalDetailRaw = z.infer<typeof technicalDetailSchema>;
export type ProjectMetricRaw = z.infer<typeof metricSchema>;
export type SiteConfigRaw = z.infer<typeof siteSchema>;
export type SkillsRaw = z.infer<typeof skillsSchema>;
export type AboutRaw = z.infer<typeof aboutSchema>;

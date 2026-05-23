import { z } from "zod";
import { projectLocalizedStringSchema } from "./localized-schema";
import { mediaItemSchema, mediaSettingsSchema } from "./media-schema";

export { projectLocalizedStringSchema } from "./localized-schema";

export const localizedStringSchema = z.object({
  es: z.string(),
  en: z.string(),
});

export const localizedStringArraySchema = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()),
});

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

export const projectFrontmatterSchema = z
  .object({
    slug: z.string().optional(),
    title: projectLocalizedStringSchema,
    description: projectLocalizedStringSchema,
    shortDescription: projectLocalizedStringSchema,
    tagIds: z.array(z.string()).min(1),
    technologies: z.array(z.string()),
    /** @deprecated Use `media` array. Required when `media` is absent. */
    coverImage: z.string().optional(),
    /** @deprecated Use `media` array. */
    galleryImages: z.array(z.string()).default([]),
    media: z.array(mediaItemSchema).min(1).optional(),
    mediaSettings: mediaSettingsSchema.optional(),
    githubUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    date: z.string(),
    updatedAt: z.string().optional(),
    status: z.enum(["completed", "in-progress", "archived"]),
    markdownContent: projectLocalizedStringSchema.optional(),
    technicalDetails: z.array(technicalDetailSchema).default([]),
    metrics: z.array(metricSchema).default([]),
    /** @deprecated Use self-hosted video in `media`. */
    videoUrl: z.string().optional(),
    seo: localizedSeoSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const hasMedia = data.media && data.media.length > 0;
    const hasLegacy = !!data.coverImage;
    if (!hasMedia && !hasLegacy) {
      ctx.addIssue({
        code: "custom",
        message: "Project must define `media` (min 1 item) or legacy `coverImage`",
        path: ["media"],
      });
    }
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

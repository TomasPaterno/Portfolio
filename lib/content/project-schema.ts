import { z } from "zod";

const localizedStringSchema = z.union([
  z.object({
    es: z.string().min(1),
    en: z.string().min(1),
  }),
  z.string().min(1),
]);

const localizedSeoSchema = z.object({
  title: localizedStringSchema.optional(),
  description: localizedStringSchema.optional(),
  noindex: z.boolean().optional(),
});

export const technicalDetailSchema = z.object({
  label: localizedStringSchema,
  value: localizedStringSchema,
});

export const metricSchema = z.object({
  label: localizedStringSchema,
  value: localizedStringSchema,
  unit: localizedStringSchema.optional(),
});

/** Raw project file shape (bilingual fields). */
export const projectFrontmatterSchema = z.object({
  slug: z.string().optional(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  shortDescription: localizedStringSchema,
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
  markdownContent: localizedStringSchema.optional(),
  technicalDetails: z.array(technicalDetailSchema).default([]),
  metrics: z.array(metricSchema).default([]),
  videoUrl: z.string().url().optional(),
  seo: localizedSeoSchema.optional(),
});

export type ProjectFrontmatterRaw = z.infer<typeof projectFrontmatterSchema>;
export type TechnicalDetailRaw = z.infer<typeof technicalDetailSchema>;
export type ProjectMetricRaw = z.infer<typeof metricSchema>;

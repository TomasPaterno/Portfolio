import { z } from "zod";

export const technicalDetailSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
  unit: z.string().optional(),
});

/** Frontmatter / JSON fields for a portfolio project (slug comes from filename). */
export const projectFrontmatterSchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  tags: z.array(z.string()),
  technologies: z.array(z.string()),
  coverImage: z.string(),
  galleryImages: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  date: z.string(),
  status: z.enum(["completed", "in-progress", "archived"]),
  markdownContent: z.string().optional(),
  technicalDetails: z.array(technicalDetailSchema).default([]),
  metrics: z.array(metricSchema).default([]),
  videoUrl: z.string().url().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type TechnicalDetail = z.infer<typeof technicalDetailSchema>;
export type ProjectMetric = z.infer<typeof metricSchema>;

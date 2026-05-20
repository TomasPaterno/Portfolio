import type { LocalizedString } from "@/lib/i18n/localized";

/** Resolved project for a single locale (flattened strings). */
export type Project = {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  /** Stable ids for filtering (same across locales). */
  tagIds: string[];
  /** Localized display labels from tag registry. */
  tags: string[];
  technologies: string[];
  coverImage: string;
  galleryImages: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  date: string;
  updatedAt?: string;
  status: "completed" | "in-progress" | "archived";
  markdownContent?: string;
  technicalDetails: TechnicalDetail[];
  metrics: ProjectMetric[];
  videoUrl?: string;
  seo?: ProjectSeo;
};

export type ProjectSeo = {
  title?: string;
  description?: string;
  noindex?: boolean;
};

export type TechnicalDetail = {
  label: string;
  value: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
  unit?: string;
};

export type { LocalizedString };

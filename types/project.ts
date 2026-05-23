import type { LocalizedString } from "@/lib/i18n/localized";
import type { ProjectMediaItem, ProjectMediaSettings } from "@/types/media";

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
  /** Ordered gallery items (images + videos). */
  media: ProjectMediaItem[];
  mediaSettings: ProjectMediaSettings;
  /** Derived from first image/poster for SEO and cards fallback. */
  coverImage: string;
  /** @deprecated Derived image URLs from `media`. */
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

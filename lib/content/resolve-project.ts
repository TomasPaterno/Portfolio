import type { Locale } from "@/i18n/routing";
import { pickLocalized } from "@/lib/i18n/localized";
import { resolveTagLabels } from "@/lib/content/registries";
import type {
  ProjectFrontmatterRaw,
  ProjectMetricRaw,
  TechnicalDetailRaw,
} from "@/lib/content/project-schema";
import type { Project, ProjectMetric, ProjectSeo, TechnicalDetail } from "@/types/project";

function resolveTechnicalDetails(
  rows: TechnicalDetailRaw[],
  locale: Locale,
): TechnicalDetail[] {
  return rows.map((row) => ({
    label: pickLocalized(row.label, locale),
    value: pickLocalized(row.value, locale),
  }));
}

function resolveMetrics(rows: ProjectMetricRaw[], locale: Locale): ProjectMetric[] {
  return rows.map((row) => ({
    label: pickLocalized(row.label, locale),
    value: pickLocalized(row.value, locale),
    unit: row.unit ? pickLocalized(row.unit, locale) : undefined,
  }));
}

function resolveSeo(
  seo: ProjectFrontmatterRaw["seo"],
  locale: Locale,
): ProjectSeo | undefined {
  if (!seo) return undefined;
  return {
    title: seo.title ? pickLocalized(seo.title, locale) : undefined,
    description: seo.description
      ? pickLocalized(seo.description, locale)
      : undefined,
    noindex: seo.noindex,
  };
}

export async function resolveProject(
  raw: ProjectFrontmatterRaw,
  slug: string,
  locale: Locale,
): Promise<Project> {
  const tags = await resolveTagLabels(raw.tagIds, locale);
  return {
    slug,
    title: pickLocalized(raw.title, locale),
    description: pickLocalized(raw.description, locale),
    shortDescription: pickLocalized(raw.shortDescription, locale),
    tagIds: raw.tagIds,
    tags,
    technologies: raw.technologies,
    coverImage: raw.coverImage,
    galleryImages: raw.galleryImages,
    githubUrl: raw.githubUrl,
    demoUrl: raw.demoUrl,
    featured: raw.featured,
    date: raw.date,
    updatedAt: raw.updatedAt,
    status: raw.status,
    markdownContent: raw.markdownContent
      ? pickLocalized(raw.markdownContent, locale)
      : undefined,
    technicalDetails: resolveTechnicalDetails(raw.technicalDetails, locale),
    metrics: resolveMetrics(raw.metrics, locale),
    videoUrl: raw.videoUrl,
    seo: resolveSeo(raw.seo, locale),
  };
}

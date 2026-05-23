import type { Locale } from "@/i18n/routing";
import { pickLocalized } from "@/lib/i18n/localized";
import { resolveTagLabels } from "@/lib/content/registries";
import {
  getCoverFromMedia,
  getGalleryImagesFromMedia,
  normalizeProjectMedia,
} from "@/lib/media/normalize-project-media";
import { resolveMediaSettings, resolveProjectMedia } from "@/lib/media/resolve-media";
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
  const normalized = normalizeProjectMedia(raw, slug);
  const media = resolveProjectMedia(normalized.media ?? [], slug, locale);
  const mediaSettings = resolveMediaSettings(normalized.mediaSettings);
  const coverImage = getCoverFromMedia(media, normalized.coverImage);
  const galleryImages = getGalleryImagesFromMedia(media);

  const tags = await resolveTagLabels(normalized.tagIds, locale);
  return {
    slug,
    title: pickLocalized(normalized.title, locale),
    description: pickLocalized(normalized.description, locale),
    shortDescription: pickLocalized(normalized.shortDescription, locale),
    tagIds: normalized.tagIds,
    tags,
    technologies: normalized.technologies,
    media,
    mediaSettings,
    coverImage,
    galleryImages,
    githubUrl: normalized.githubUrl,
    demoUrl: normalized.demoUrl,
    featured: normalized.featured,
    date: normalized.date,
    updatedAt: normalized.updatedAt,
    status: normalized.status,
    markdownContent: normalized.markdownContent
      ? pickLocalized(normalized.markdownContent, locale)
      : undefined,
    technicalDetails: resolveTechnicalDetails(normalized.technicalDetails, locale),
    metrics: resolveMetrics(normalized.metrics, locale),
    seo: resolveSeo(normalized.seo, locale),
  };
}

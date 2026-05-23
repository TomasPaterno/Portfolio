import type { MediaItemRaw } from "../content/media-schema";
import type { ProjectFrontmatterRaw } from "../content/project-schema";

function isPublicVideoPath(url: string): boolean {
  return url.startsWith("/videos/");
}

function defaultAlt(slug: string, index: number): { es: string; en: string } {
  return {
    es: `Medio del proyecto ${slug} ${index + 1}`,
    en: `Project ${slug} media ${index + 1}`,
  };
}

/**
 * Ensures every project has a normalized `media` array.
 * Legacy coverImage / galleryImages are folded in when `media` is absent.
 */
export function normalizeProjectMedia(
  data: ProjectFrontmatterRaw,
  slug: string,
): ProjectFrontmatterRaw {
  if (data.media && data.media.length > 0) {
    return {
      ...data,
      media: sortMediaByOrder(data.media),
    };
  }

  const items: MediaItemRaw[] = [];
  const seen = new Set<string>();

  if (data.coverImage) {
    items.push({
      type: "image",
      src: data.coverImage,
      alt: defaultAlt(slug, 0),
      priority: true,
      order: 0,
    });
    seen.add(data.coverImage);
  }

  for (const src of data.galleryImages ?? []) {
    if (seen.has(src)) continue;
    seen.add(src);
    items.push({
      type: "image",
      src,
      alt: defaultAlt(slug, items.length),
      order: items.length,
    });
  }

  if (data.videoUrl && isPublicVideoPath(data.videoUrl)) {
    items.push({
      type: "video",
      src: data.videoUrl,
      alt: defaultAlt(slug, items.length),
      order: items.length,
      muted: true,
      playsInline: true,
      loop: false,
    });
  }

  return {
    ...data,
    media: items,
  };
}

function sortMediaByOrder(items: MediaItemRaw[]): MediaItemRaw[] {
  return [...items].sort((a, b) => {
    const ao = a.order ?? 0;
    const bo = b.order ?? 0;
    if (ao !== bo) return ao - bo;
    return 0;
  });
}

export function getCoverFromMedia(
  media: Array<{ type: string; src: string; poster?: string }>,
  fallbackCover?: string,
): string {
  const first = media[0];
  if (!first) return fallbackCover ?? "";
  if (first.type === "image") return first.src;
  if (first.type === "video" && "poster" in first && first.poster) {
    return first.poster;
  }
  const firstImage = media.find((m) => m.type === "image");
  if (firstImage && firstImage.type === "image") return firstImage.src;
  return fallbackCover ?? first.src;
}

export function getGalleryImagesFromMedia(
  media: Array<{ type: string; src: string }>,
): string[] {
  return media.filter((m) => m.type === "image").map((m) => m.src);
}

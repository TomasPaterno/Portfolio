import type { Locale } from "@/i18n/routing";
import { pickLocalized } from "@/lib/i18n/localized";
import type { MediaItemRaw, MediaSettingsRaw } from "@/lib/content/media-schema";
import {
  DEFAULT_MEDIA_SETTINGS,
  type MediaImage,
  type MediaVideo,
  type ProjectMediaItem,
  type ProjectMediaSettings,
} from "@/types/media";

function resolveMediaId(item: MediaItemRaw, index: number, slug: string): string {
  return item.id ?? `${slug}-media-${index}`;
}

export function resolveMediaSettings(
  raw?: MediaSettingsRaw,
): ProjectMediaSettings {
  if (!raw) return { ...DEFAULT_MEDIA_SETTINGS };
  return {
    imageDurationMs: raw.imageDurationMs ?? DEFAULT_MEDIA_SETTINGS.imageDurationMs,
    transition: raw.transition ?? DEFAULT_MEDIA_SETTINGS.transition,
    autoplay: raw.autoplay ?? DEFAULT_MEDIA_SETTINGS.autoplay,
    pauseWhenOffscreen:
      raw.pauseWhenOffscreen ?? DEFAULT_MEDIA_SETTINGS.pauseWhenOffscreen,
    pauseOnHover: raw.pauseOnHover ?? DEFAULT_MEDIA_SETTINGS.pauseOnHover,
    preload: raw.preload ?? DEFAULT_MEDIA_SETTINGS.preload,
    manualHoldMs: raw.manualHoldMs ?? DEFAULT_MEDIA_SETTINGS.manualHoldMs,
    reducedMotionFallback:
      raw.reducedMotionFallback ?? DEFAULT_MEDIA_SETTINGS.reducedMotionFallback,
  };
}

function resolvePresentation(
  raw: MediaItemRaw["presentation"],
): MediaImage["presentation"] {
  if (!raw) return undefined;
  return { ...raw };
}

export function resolveProjectMedia(
  items: MediaItemRaw[],
  slug: string,
  locale: Locale,
): ProjectMediaItem[] {
  const sorted = [...items]
    .filter((item) => !item.hidden)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return sorted.map((item, index) => {
    const id = resolveMediaId(item, index, slug);
    const alt = pickLocalized(item.alt, locale);
    const caption = item.caption
      ? pickLocalized(item.caption, locale)
      : undefined;

    if (item.type === "image") {
      const resolved: MediaImage = {
        id,
        type: "image",
        src: item.src,
        thumbnail: item.thumbnail,
        alt,
        caption,
        priority: item.priority,
        presentation: resolvePresentation(item.presentation),
      };
      return resolved;
    }

    const resolved: MediaVideo = {
      id,
      type: "video",
      src: item.src,
      poster: item.poster ?? item.presentation?.posterImage,
      thumbnail: item.thumbnail,
      alt,
      caption,
      muted: item.muted ?? true,
      playsInline: item.playsInline ?? true,
      loop: item.loop ?? false,
      duration: item.duration,
      presentation: resolvePresentation(item.presentation),
    };
    return resolved;
  });
}

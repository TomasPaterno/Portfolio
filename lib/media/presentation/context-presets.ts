import type {
  MediaFitMode,
  MediaOrientation,
  MediaRenderContext,
} from "@/lib/media/presentation/types";

export const CONTEXT_SIZES: Record<MediaRenderContext, string> = {
  hero: "(max-width: 1200px) 100vw, 1152px",
  card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  gallery: "(max-width: 1024px) 100vw, 66vw",
  thumbnail: "128px",
  fullscreen: "100vw",
};

export const CONTEXT_PRELOAD: Record<
  MediaRenderContext,
  "none" | "metadata" | "auto"
> = {
  hero: "auto",
  card: "metadata",
  gallery: "metadata",
  thumbnail: "none",
  fullscreen: "auto",
};

const LETTERBOX_BG = "bg-secondary/95";

type FitRule = MediaFitMode | "auto";

const AUTO_FIT: Record<
  MediaRenderContext,
  Record<MediaOrientation, FitRule>
> = {
  hero: {
    portrait: "contain",
    landscape: "cover",
    ultrawide: "cover",
    square: "contain",
  },
  card: {
    portrait: "contain",
    landscape: "cover",
    ultrawide: "cover",
    square: "cover",
  },
  gallery: {
    portrait: "contain",
    landscape: "cover",
    ultrawide: "cover",
    square: "contain",
  },
  thumbnail: {
    portrait: "cover",
    landscape: "cover",
    ultrawide: "cover",
    square: "cover",
  },
  fullscreen: {
    portrait: "contain",
    landscape: "contain",
    ultrawide: "contain",
    square: "contain",
  },
};

export function resolveAutoFit(
  context: MediaRenderContext,
  orientation: MediaOrientation,
): MediaFitMode {
  const rule = AUTO_FIT[context][orientation];
  if (rule === "auto") return "cover";
  return rule;
}

export function backgroundForFit(fit: MediaFitMode): string {
  return fit === "contain" ? LETTERBOX_BG : "bg-secondary";
}

export type MediaTransition = "crossfade" | "slide" | "fade-blur";

export type MediaPreload = "adjacent" | "none" | "all-images";

export type ReducedMotionFallback = "static-first" | "first-only";

export type MediaImage = {
  id: string;
  type: "image";
  src: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
  priority?: boolean;
};

export type MediaVideo = {
  id: string;
  type: "video";
  src: string;
  poster?: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
  muted: boolean;
  playsInline: boolean;
  loop: boolean;
  duration?: number;
};

export type ProjectMediaItem = MediaImage | MediaVideo;

export type ProjectMediaSettings = {
  imageDurationMs: number;
  transition: MediaTransition;
  autoplay: boolean;
  pauseWhenOffscreen: boolean;
  pauseOnHover: boolean;
  preload: MediaPreload;
  manualHoldMs: number;
  reducedMotionFallback: ReducedMotionFallback;
};

export const DEFAULT_MEDIA_SETTINGS: ProjectMediaSettings = {
  imageDurationMs: 5500,
  transition: "crossfade",
  autoplay: true,
  pauseWhenOffscreen: true,
  pauseOnHover: true,
  preload: "adjacent",
  manualHoldMs: 8000,
  reducedMotionFallback: "static-first",
};

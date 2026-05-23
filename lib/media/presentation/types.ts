import type { MediaPresentation, ProjectMediaItem } from "@/types/media";

export type MediaRenderContext =
  | "hero"
  | "card"
  | "gallery"
  | "thumbnail"
  | "fullscreen";

export type MediaFitMode = "cover" | "contain" | "fill";

export type MediaCropMode = "auto" | "cover" | "contain" | "fill";

export type MediaOrientation =
  | "portrait"
  | "landscape"
  | "square"
  | "ultrawide";

export type MediaIntrinsicSize = {
  width: number;
  height: number;
  aspect: number;
  orientation: MediaOrientation;
};

export type ResolvedPresentation = {
  fit: MediaFitMode;
  objectPosition: string;
  backgroundClass: string;
  sizes: string;
  preload: "none" | "metadata" | "auto";
};

export type PresentationInput = {
  item: ProjectMediaItem;
  context: MediaRenderContext;
  intrinsic?: MediaIntrinsicSize | null;
  presentation?: MediaPresentation;
};

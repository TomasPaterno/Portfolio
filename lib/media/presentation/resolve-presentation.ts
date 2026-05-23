import { classifyOrientation } from "@/lib/media/presentation/classify-orientation";
import {
  CONTEXT_PRELOAD,
  CONTEXT_SIZES,
  backgroundForFit,
  resolveAutoFit,
} from "@/lib/media/presentation/context-presets";
import { focalToObjectPosition } from "@/lib/media/presentation/object-position";
import type {
  MediaCropMode,
  MediaFitMode,
  MediaIntrinsicSize,
  MediaOrientation,
  PresentationInput,
  ResolvedPresentation,
} from "@/lib/media/presentation/types";
import type { MediaPresentation } from "@/types/media";

function orientationFromInput(
  presentation?: MediaPresentation,
  intrinsic?: MediaIntrinsicSize | null,
): MediaOrientation {
  if (intrinsic?.orientation) return intrinsic.orientation;
  if (presentation?.aspectRatio) {
    const ar = presentation.aspectRatio;
    if (presentation.width && presentation.height) {
      return classifyOrientation(presentation.width, presentation.height);
    }
    if (ar <= 0.91) return "portrait";
    if (ar >= 2.1) return "ultrawide";
    if (ar >= 0.91 && ar <= 1.11) return "square";
    return "landscape";
  }
  if (presentation?.width && presentation?.height) {
    return classifyOrientation(presentation.width, presentation.height);
  }
  return "landscape";
}

function cropModeToFit(
  cropMode: MediaCropMode | undefined,
  context: PresentationInput["context"],
  orientation: MediaOrientation,
): MediaFitMode {
  if (!cropMode || cropMode === "auto") {
    return resolveAutoFit(context, orientation);
  }
  if (cropMode === "fill") return "fill";
  return cropMode;
}

export function resolveMediaPresentation({
  context,
  intrinsic,
  presentation,
}: PresentationInput): ResolvedPresentation {
  const orientation = orientationFromInput(presentation, intrinsic);
  const fit = cropModeToFit(presentation?.cropMode, context, orientation);
  const focalX = presentation?.focalX ?? 0.5;
  const focalY = presentation?.focalY ?? 0.5;
  const preload =
    presentation?.preloadStrategy ?? CONTEXT_PRELOAD[context];

  return {
    fit,
    objectPosition: focalToObjectPosition(focalX, focalY),
    backgroundClass: backgroundForFit(fit),
    sizes: CONTEXT_SIZES[context],
    preload,
  };
}

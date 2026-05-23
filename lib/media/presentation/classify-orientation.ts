import type { MediaIntrinsicSize, MediaOrientation } from "@/lib/media/presentation/types";

const PORTRAIT_THRESHOLD = 0.91;
const ULTRAWIDE_THRESHOLD = 2.1;
const SQUARE_LOW = 0.91;
const SQUARE_HIGH = 1.11;

export function classifyOrientation(width: number, height: number): MediaOrientation {
  if (width <= 0 || height <= 0) return "landscape";
  const aspect = width / height;
  if (aspect >= ULTRAWIDE_THRESHOLD) return "ultrawide";
  if (aspect <= PORTRAIT_THRESHOLD) return "portrait";
  if (aspect >= SQUARE_LOW && aspect <= SQUARE_HIGH) return "square";
  return "landscape";
}

export function intrinsicFromDimensions(
  width: number,
  height: number,
): MediaIntrinsicSize {
  const orientation = classifyOrientation(width, height);
  return {
    width,
    height,
    aspect: width / height,
    orientation,
  };
}

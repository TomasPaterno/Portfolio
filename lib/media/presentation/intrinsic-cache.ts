import { intrinsicFromDimensions } from "@/lib/media/presentation/classify-orientation";
import type { MediaIntrinsicSize } from "@/lib/media/presentation/types";

const cache = new Map<string, MediaIntrinsicSize>();

export function getCachedIntrinsic(key: string): MediaIntrinsicSize | undefined {
  return cache.get(key);
}

export function setCachedIntrinsic(key: string, size: MediaIntrinsicSize): void {
  cache.set(key, size);
}

export function cacheKey(id: string, src: string): string {
  return `${id}:${src}`;
}

export function probeImageSrc(src: string): Promise<MediaIntrinsicSize> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve(intrinsicFromDimensions(img.naturalWidth, img.naturalHeight));
    };
    img.onerror = () => reject(new Error("Failed to load image dimensions"));
    img.src = src;
  });
}

"use client";

import { useEffect, useState } from "react";
import { intrinsicFromDimensions } from "@/lib/media/presentation/classify-orientation";
import {
  cacheKey,
  getCachedIntrinsic,
  probeImageSrc,
  setCachedIntrinsic,
} from "@/lib/media/presentation/intrinsic-cache";
import type { MediaIntrinsicSize } from "@/lib/media/presentation/types";
import type { MediaPresentation } from "@/types/media";

type UseMediaIntrinsicSizeOptions = {
  id: string;
  src: string;
  type: "image" | "video";
  presentation?: MediaPresentation;
};

export function useMediaIntrinsicSize({
  id,
  src,
  type,
  presentation,
}: UseMediaIntrinsicSizeOptions) {
  const [intrinsic, setIntrinsic] = useState<MediaIntrinsicSize | null>(() => {
    if (presentation?.width && presentation?.height) {
      return intrinsicFromDimensions(presentation.width, presentation.height);
    }
    const cached = getCachedIntrinsic(cacheKey(id, src));
    return cached ?? null;
  });
  const [loading, setLoading] = useState(!intrinsic);

  useEffect(() => {
    if (presentation?.width && presentation?.height) {
      const size = intrinsicFromDimensions(
        presentation.width,
        presentation.height,
      );
      setIntrinsic(size);
      setLoading(false);
      return;
    }

    const key = cacheKey(id, src);
    const cached = getCachedIntrinsic(key);
    if (cached) {
      setIntrinsic(cached);
      setLoading(false);
      return;
    }

    if (type === "image") {
      setLoading(true);
      probeImageSrc(src)
        .then((size) => {
          setCachedIntrinsic(key, size);
          setIntrinsic(size);
        })
        .catch(() => setIntrinsic(null))
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, [id, src, type, presentation?.width, presentation?.height]);

  return { intrinsic, loading };
}

export function intrinsicFromVideoElement(
  video: HTMLVideoElement,
): MediaIntrinsicSize | null {
  if (!video.videoWidth || !video.videoHeight) return null;
  return intrinsicFromDimensions(video.videoWidth, video.videoHeight);
}

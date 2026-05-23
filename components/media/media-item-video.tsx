"use client";

import { forwardRef, useEffect } from "react";
import {
  cacheKey,
  setCachedIntrinsic,
} from "@/lib/media/presentation/intrinsic-cache";
import type { ResolvedPresentation } from "@/lib/media/presentation/types";
import { intrinsicFromVideoElement } from "@/hooks/use-media-intrinsic-size";
import { cn } from "@/lib/utils";
import type { MediaVideo } from "@/types/media";

type MediaItemVideoProps = {
  item: MediaVideo;
  isActive: boolean;
  presentation: ResolvedPresentation;
  onEnded: () => void;
  onError: () => void;
  onCanPlay: () => void;
  onIntrinsic?: () => void;
  className?: string;
};

export const MediaItemVideo = forwardRef<HTMLVideoElement, MediaItemVideoProps>(
  function MediaItemVideo(
    {
      item,
      isActive,
      presentation,
      onEnded,
      onError,
      onCanPlay,
      onIntrinsic,
      className,
    },
    ref,
  ) {
    useEffect(() => {
      const el = ref && "current" in ref ? ref.current : null;
      if (!el || !isActive) return;
      el.currentTime = 0;
    }, [isActive, item.id, ref]);

    const preload = isActive ? presentation.preload : "none";

    return (
      <video
        ref={ref}
        src={item.src}
        poster={item.poster}
        className={cn("h-full w-full", className)}
        style={{
          objectFit: presentation.fit,
          objectPosition: presentation.objectPosition,
        }}
        muted={item.muted}
        playsInline={item.playsInline}
        loop={false}
        preload={preload}
        onEnded={onEnded}
        onError={onError}
        onCanPlay={onCanPlay}
        onLoadedMetadata={(event) => {
          const size = intrinsicFromVideoElement(event.currentTarget);
          if (size) {
            setCachedIntrinsic(cacheKey(item.id, item.src), size);
            onIntrinsic?.();
          }
        }}
        aria-label={item.alt}
      />
    );
  },
);

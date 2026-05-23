"use client";

import { forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { MediaVideo } from "@/types/media";

type MediaItemVideoProps = {
  item: MediaVideo;
  isActive: boolean;
  onEnded: () => void;
  onError: () => void;
  onCanPlay: () => void;
  className?: string;
};

export const MediaItemVideo = forwardRef<HTMLVideoElement, MediaItemVideoProps>(
  function MediaItemVideo(
    { item, isActive, onEnded, onError, onCanPlay, className },
    ref,
  ) {
    useEffect(() => {
      const el = ref && "current" in ref ? ref.current : null;
      if (!el || !isActive) return;
      el.currentTime = 0;
    }, [isActive, item.id, ref]);

    return (
      <video
        ref={ref}
        src={item.src}
        poster={item.poster}
        className={cn("h-full w-full object-cover", className)}
        muted={item.muted}
        playsInline={item.playsInline}
        loop={false}
        preload={isActive ? "auto" : "metadata"}
        onEnded={onEnded}
        onError={onError}
        onCanPlay={onCanPlay}
        aria-label={item.alt}
      />
    );
  },
);

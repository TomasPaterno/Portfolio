"use client";

import { useMemo } from "react";
import { MediaCrossfade } from "@/components/media/media-crossfade";
import { MediaItemImage } from "@/components/media/media-item-image";
import { MediaItemVideo } from "@/components/media/media-item-video";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { UseMediaSequenceReturn } from "@/hooks/use-media-sequence";
import type { ProjectMediaItem, ProjectMediaSettings } from "@/types/media";
import { cn } from "@/lib/utils";

export type MediaStageVariant = "card" | "hero" | "gallery";

const SIZES: Record<MediaStageVariant, string> = {
  card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  hero: "(max-width: 1200px) 100vw, 1152px",
  gallery: "(max-width: 1024px) 100vw, 66vw",
};

type MediaStageProps = {
  media: ProjectMediaItem[];
  settings: ProjectMediaSettings;
  sequence: UseMediaSequenceReturn;
  variant?: MediaStageVariant;
  className?: string;
  showCaption?: boolean;
};

export function MediaStage({
  media,
  settings,
  sequence,
  variant = "card",
  className,
  showCaption = false,
}: MediaStageProps) {
  const reducedMotion = useReducedMotion();
  const { activeItem, activeIndex, videoRef, onVideoEnded, onVideoError, onVideoCanPlay } =
    sequence;

  const priority = useMemo(() => {
    if (!activeItem) return false;
    return activeItem.type === "image" && activeItem.priority === true;
  }, [activeItem]);

  if (!activeItem || media.length === 0) return null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <MediaCrossfade
        itemKey={activeItem.id}
        transition={settings.transition}
        reducedMotion={reducedMotion}
        className="absolute inset-0"
      >
        {activeItem.type === "image" ? (
          <MediaItemImage
            src={activeItem.src}
            alt={activeItem.alt}
            priority={priority || activeIndex === 0}
            sizes={SIZES[variant]}
          />
        ) : (
          <MediaItemVideo
            ref={videoRef}
            item={activeItem}
            isActive
            onEnded={onVideoEnded}
            onError={onVideoError}
            onCanPlay={onVideoCanPlay}
          />
        )}
      </MediaCrossfade>
      {showCaption && activeItem.caption && (
        <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent px-4 py-3 text-sm text-muted-foreground">
          {activeItem.caption}
        </p>
      )}
    </div>
  );
}

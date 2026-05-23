"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MediaCrossfade } from "@/components/media/media-crossfade";
import { MediaRenderer } from "@/components/media/presentation/media-renderer";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { UseMediaSequenceReturn } from "@/hooks/use-media-sequence";
import type { MediaFitMode, MediaRenderContext } from "@/lib/media/presentation/types";
import type { ProjectMediaItem, ProjectMediaSettings } from "@/types/media";
import { cn } from "@/lib/utils";

export type MediaStageVariant = "card" | "hero" | "gallery";

const VARIANT_TO_CONTEXT: Record<MediaStageVariant, MediaRenderContext> = {
  card: "card",
  hero: "hero",
  gallery: "gallery",
};

type MediaStageProps = {
  media: ProjectMediaItem[];
  settings: ProjectMediaSettings;
  sequence: UseMediaSequenceReturn;
  variant?: MediaStageVariant;
  context?: MediaRenderContext;
  fitOverride?: MediaFitMode | null;
  className?: string;
  showCaption?: boolean;
};

function hasSchemaDimensions(item: ProjectMediaItem): boolean {
  return !!(item.presentation?.width && item.presentation?.height);
}

export function MediaStage({
  media,
  settings,
  sequence,
  variant = "card",
  context,
  fitOverride = null,
  className,
  showCaption = false,
}: MediaStageProps) {
  const reducedMotion = useReducedMotion();
  const renderContext = context ?? VARIANT_TO_CONTEXT[variant];
  const {
    activeItem,
    activeIndex,
    videoRef,
    onVideoEnded,
    onVideoError,
    onVideoCanPlay,
    markActiveItemReady,
    activeItemReady,
  } = sequence;

  const [itemReady, setItemReady] = useState(() =>
    activeItem ? hasSchemaDimensions(activeItem) : true,
  );
  const holdItemRef = useRef<ProjectMediaItem | undefined>(activeItem);

  useEffect(() => {
    if (!activeItem) return;
    const schemaReady = hasSchemaDimensions(activeItem);
    setItemReady(schemaReady);
    if (!schemaReady) {
      holdItemRef.current = activeItem;
    }
  }, [activeItem?.id, activeItem]);

  const priority = useMemo(() => {
    if (!activeItem) return false;
    return activeItem.type === "image" && activeItem.priority === true;
  }, [activeItem]);

  const handleReady = () => {
    setItemReady(true);
    markActiveItemReady();
    holdItemRef.current = activeItem;
  };

  const crossfadeReady = itemReady || activeItemReady;

  if (!activeItem || media.length === 0) return null;

  const holdItem =
    !crossfadeReady && holdItemRef.current?.id !== activeItem.id
      ? holdItemRef.current
      : undefined;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {holdItem ? (
        <div className="absolute inset-0 z-0" aria-hidden>
          <MediaRenderer
            item={holdItem}
            context={renderContext}
            isActive={false}
            fitOverride={fitOverride}
          />
        </div>
      ) : null}
      <MediaCrossfade
        itemKey={activeItem.id}
        transition={settings.transition}
        reducedMotion={reducedMotion}
        ready={crossfadeReady}
        className="absolute inset-0 z-[1]"
      >
        <MediaRenderer
          item={activeItem}
          context={renderContext}
          isActive
          priority={priority || activeIndex === 0}
          fitOverride={fitOverride}
          videoRef={videoRef}
          onVideoEnded={onVideoEnded}
          onVideoError={onVideoError}
          onVideoCanPlay={onVideoCanPlay}
          onReady={handleReady}
        />
      </MediaCrossfade>
      {showCaption && activeItem.caption && crossfadeReady && (
        <p className="absolute bottom-0 left-0 right-0 z-[2] bg-gradient-to-t from-background/90 to-transparent px-4 py-3 text-sm text-muted-foreground">
          {activeItem.caption}
        </p>
      )}
    </div>
  );
}

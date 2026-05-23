"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaItemImage } from "@/components/media/media-item-image";
import { MediaItemVideo } from "@/components/media/media-item-video";
import { MediaFrame } from "@/components/media/presentation/media-frame";
import { MediaSurface } from "@/components/media/presentation/media-surface";
import { useMediaIntrinsicSize } from "@/hooks/use-media-intrinsic-size";
import { useMediaPresentation } from "@/hooks/use-media-presentation";
import type { MediaFitMode, MediaRenderContext } from "@/lib/media/presentation/types";
import type { ProjectMediaItem } from "@/types/media";
import { cn } from "@/lib/utils";

type MediaRendererProps = {
  item: ProjectMediaItem;
  context: MediaRenderContext;
  isActive?: boolean;
  priority?: boolean;
  fitOverride?: MediaFitMode | null;
  className?: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onVideoEnded?: () => void;
  onVideoError?: () => void;
  onVideoCanPlay?: () => void;
  onReady?: () => void;
};

export function MediaRenderer({
  item,
  context,
  isActive = true,
  priority = false,
  fitOverride = null,
  className,
  videoRef,
  onVideoEnded,
  onVideoError,
  onVideoCanPlay,
  onReady,
}: MediaRendererProps) {
  const { intrinsic, loading } = useMediaIntrinsicSize({
    id: item.id,
    src: item.src,
    type: item.type,
    presentation: item.presentation,
  });

  const presentation = useMediaPresentation(item, context, intrinsic);
  const resolved = useMemo(
    () =>
      fitOverride
        ? { ...presentation, fit: fitOverride }
        : presentation,
    [presentation, fitOverride],
  );

  const [mediaReady, setMediaReady] = useState(() => {
    if (item.presentation?.width && item.presentation?.height) return true;
    if (item.type === "image" && intrinsic) return true;
    return false;
  });

  const markReady = useCallback(() => {
    setMediaReady(true);
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (item.presentation?.width && item.presentation?.height) {
      setMediaReady(true);
      return;
    }
    setMediaReady(false);
  }, [item.id, item.presentation?.width, item.presentation?.height]);

  useEffect(() => {
    if (intrinsic && item.type === "image") {
      setMediaReady(true);
      onReady?.();
    }
  }, [intrinsic, item.type, onReady]);

  const showLoading = loading && !mediaReady;

  return (
    <MediaFrame context={context} className={className}>
      <MediaSurface presentation={resolved} loading={showLoading}>
        {item.type === "image" ? (
          <MediaItemImage
            src={item.src}
            alt={item.alt}
            priority={priority}
            presentation={resolved}
            onReady={markReady}
          />
        ) : (
          <MediaItemVideo
            ref={videoRef}
            item={item}
            isActive={isActive}
            presentation={resolved}
            onEnded={onVideoEnded ?? (() => {})}
            onError={onVideoError ?? (() => {})}
            onCanPlay={() => {
              markReady();
              onVideoCanPlay?.();
            }}
            onIntrinsic={() => {
              if (!mediaReady) markReady();
            }}
          />
        )}
      </MediaSurface>
    </MediaFrame>
  );
}

"use client";

import { MediaRenderer } from "@/components/media/presentation/media-renderer";
import type { ProjectMediaItem } from "@/types/media";
import { cn } from "@/lib/utils";

type MediaThumbnailTileProps = {
  item: ProjectMediaItem;
  className?: string;
};

function thumbSrc(item: ProjectMediaItem): string {
  if (item.type === "image") {
    return item.thumbnail ?? item.src;
  }
  return item.thumbnail ?? item.poster ?? item.src;
}

export function MediaThumbnailTile({ item, className }: MediaThumbnailTileProps) {
  if (item.type === "video" && !item.thumbnail && !item.poster) {
    return (
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground",
          className,
        )}
      >
        Video
      </span>
    );
  }

  const thumbItem: ProjectMediaItem =
    item.type === "image"
      ? { ...item, src: thumbSrc(item) }
      : { ...item, src: thumbSrc(item) };

  return (
    <MediaRenderer
      item={thumbItem}
      context="thumbnail"
      className={className}
      priority={false}
    />
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MediaThumbnailDuration({
  duration,
}: {
  duration?: number;
}) {
  if (!duration) return null;
  return (
    <span className="absolute bottom-1 right-1 rounded bg-background/80 px-1 py-0.5 font-mono text-[10px] text-foreground">
      {formatDuration(duration)}
    </span>
  );
}

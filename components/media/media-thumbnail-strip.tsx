"use client";

import {
  MediaThumbnailDuration,
  MediaThumbnailTile,
} from "@/components/media/presentation/media-thumbnail-tile";
import { cn } from "@/lib/utils";
import type { ProjectMediaItem } from "@/types/media";

type MediaThumbnailStripProps = {
  media: ProjectMediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  title: string;
  className?: string;
};

export function MediaThumbnailStrip({
  media,
  activeIndex,
  onSelect,
  title,
  className,
}: MediaThumbnailStripProps) {
  if (media.length <= 1) return null;

  return (
    <nav className={cn("min-w-0", className)} aria-label={title}>
      <div
        className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [scrollbar-width:thin]"
        role="tablist"
      >
        {media.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={item.alt}
            onClick={() => onSelect(i)}
            className={cn(
              "relative aspect-video w-24 shrink-0 snap-start overflow-hidden rounded-lg border transition-all sm:w-28 md:w-32",
              activeIndex === i
                ? "border-primary ring-2 ring-primary/30"
                : "border-border/80 opacity-75 hover:opacity-100",
            )}
          >
            <MediaThumbnailTile item={item} />
            {item.type === "video" ? (
              <MediaThumbnailDuration duration={item.duration} />
            ) : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

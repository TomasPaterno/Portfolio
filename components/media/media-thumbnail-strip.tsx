"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProjectMediaItem } from "@/types/media";

type MediaThumbnailStripProps = {
  media: ProjectMediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  title: string;
  className?: string;
};

function thumbSrc(item: ProjectMediaItem): string {
  if (item.type === "image") {
    return item.thumbnail ?? item.src;
  }
  return item.thumbnail ?? item.poster ?? item.src;
}

export function MediaThumbnailStrip({
  media,
  activeIndex,
  onSelect,
  title,
  className,
}: MediaThumbnailStripProps) {
  if (media.length <= 1) return null;

  return (
    <nav
      className={cn("min-w-0", className)}
      aria-label={title}
    >
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
            {item.type === "video" && !item.thumbnail && !item.poster ? (
              <span className="absolute inset-0 flex items-center justify-center bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground">
                Video
              </span>
            ) : (
              <Image
                src={thumbSrc(item)}
                alt=""
                fill
                className="object-cover"
                sizes="128px"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

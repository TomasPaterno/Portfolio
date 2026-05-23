"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProjectMediaItem } from "@/types/media";

type MediaThumbnailsProps = {
  media: ProjectMediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  title: string;
};

function thumbSrc(item: ProjectMediaItem): string {
  if (item.type === "image") {
    return item.thumbnail ?? item.src;
  }
  return item.thumbnail ?? item.poster ?? item.src;
}

export function MediaThumbnails({
  media,
  activeIndex,
  onSelect,
  title,
}: MediaThumbnailsProps) {
  if (media.length <= 1) return null;

  return (
    <div
      className="grid grid-cols-4 gap-3 sm:grid-cols-6"
      role="tablist"
      aria-label={title}
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
            "relative aspect-video overflow-hidden rounded-lg border transition-all",
            activeIndex === i
              ? "border-primary ring-2 ring-primary/30"
              : "border-border opacity-70 hover:opacity-100",
          )}
        >
          {item.type === "video" && !item.thumbnail && !item.poster ? (
            <span className="absolute inset-0 flex items-center justify-center bg-secondary text-xs text-muted-foreground">
              Video
            </span>
          ) : (
            <Image
              src={thumbSrc(item)}
              alt=""
              fill
              className="object-cover"
              sizes="120px"
            />
          )}
        </button>
      ))}
    </div>
  );
}

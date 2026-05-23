"use client";

import { cn } from "@/lib/utils";

type MediaDotsProps = {
  count: number;
  activeIndex: number;
  className?: string;
};

export function MediaDots({ count, activeIndex, className }: MediaDotsProps) {
  if (count <= 1) return null;

  return (
    <div
      className={cn(
        "absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 rounded-full transition-all",
            i === activeIndex
              ? "w-4 bg-primary"
              : "w-1 bg-background/60",
          )}
        />
      ))}
    </div>
  );
}

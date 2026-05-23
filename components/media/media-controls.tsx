"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaControlsProps = {
  count: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
  className?: string;
};

export function MediaControls({
  count,
  activeIndex,
  onPrev,
  onNext,
  onFullscreen,
  className,
}: MediaControlsProps) {
  const t = useTranslations("projectDetail.media");

  if (count <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        className,
      )}
    >
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={onPrev}
          aria-label={t("previous")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={onNext}
          aria-label={t("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {onFullscreen && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={onFullscreen}
            aria-label={t("fullscreen")}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2" role="tablist" aria-label={t("slideOf", { current: activeIndex + 1, total: count })}>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === activeIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/40",
            )}
            aria-hidden
          />
        ))}
      </div>
      <span className="sr-only">
        {t("slideOf", { current: activeIndex + 1, total: count })}
      </span>
    </div>
  );
}

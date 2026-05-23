"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaStageChromeProps = {
  count: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
  className?: string;
};

/**
 * Controls scoped to the hero stage only (sides + bottom indicators).
 * Does not participate in document flow below the stage.
 */
export function MediaStageChrome({
  count,
  activeIndex,
  onPrev,
  onNext,
  onFullscreen,
  className,
}: MediaStageChromeProps) {
  const t = useTranslations("projectDetail.media");

  if (count <= 1) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex flex-col justify-between",
        className,
      )}
    >
      <div className="flex flex-1 items-center justify-between px-2 sm:px-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="pointer-events-auto h-9 w-9 border-border/60 bg-background/70 backdrop-blur-md hover:bg-background/90"
          onClick={onPrev}
          aria-label={t("previous")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="pointer-events-auto h-9 w-9 border-border/60 bg-background/70 backdrop-blur-md hover:bg-background/90"
          onClick={onNext}
          aria-label={t("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 px-3 pb-3 sm:px-4 sm:pb-4">
        <div
          className="flex items-center gap-1.5"
          role="tablist"
          aria-label={t("slideOf", { current: activeIndex + 1, total: count })}
        >
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                i === activeIndex
                  ? "w-5 bg-primary"
                  : "w-1 bg-foreground/40",
              )}
              aria-hidden
            />
          ))}
        </div>
        {onFullscreen ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto h-8 w-8 border-border/60 bg-background/70 backdrop-blur-md hover:bg-background/90"
            onClick={onFullscreen}
            aria-label={t("fullscreen")}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>
      <span className="sr-only">
        {t("slideOf", { current: activeIndex + 1, total: count })}
      </span>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MediaFullscreen } from "@/components/media/media-fullscreen";
import { MediaStage } from "@/components/media/media-stage";
import { MediaStageChrome } from "@/components/media/media-stage-chrome";
import { MediaThumbnailStrip } from "@/components/media/media-thumbnail-strip";
import { useMediaSequence } from "@/hooks/use-media-sequence";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 50;

type ProjectHeroGalleryProps = {
  project: Project;
  metadata: ReactNode;
  className?: string;
};

/**
 * Cinematic project hero with explicit vertical regions:
 * 1. Media stage (isolated aspect box + in-stage overlays/controls)
 * 2. Thumbnail strip (document flow)
 * 3. Project metadata (document flow — never overlaps thumbnails)
 */
export function ProjectHeroGallery({
  project,
  metadata,
  className,
}: ProjectHeroGalleryProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const sequence = useMediaSequence({
    media: project.media,
    settings: project.mediaSettings,
    variant: "detail",
    containerRef: stageRef,
  });

  const { goNext, goPrev, goTo, activeIndex } = sequence;
  const hasMultiple = project.media.length > 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (fullscreenOpen && e.key === "Escape") {
        setFullscreenOpen(false);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "f") {
        setFullscreenOpen(true);
      }
    },
    [goNext, goPrev, fullscreenOpen],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStart.current === null) return;
    const delta = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  if (project.media.length === 0) {
    return (
      <section className={cn("space-y-6", className)}>
        <header className="space-y-3">{metadata}</header>
      </section>
    );
  }

  return (
    <section
      className={cn("flex flex-col gap-5 sm:gap-6", className)}
      aria-label={project.title}
    >
      {/* Region 1 — Hero media (isolated stacking context) */}
      <div
        className="relative isolate overflow-hidden rounded-2xl border border-border/80 bg-secondary shadow-sm"
      >
        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={project.title}
          className={cn(
            "relative w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "aspect-[16/9] min-h-[12.5rem] max-h-[min(50vh,32rem)] sm:aspect-[21/9] sm:min-h-[14rem]",
          )}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* Layer 0 — media */}
          <MediaStage
            media={project.media}
            settings={project.mediaSettings}
            sequence={sequence}
            variant="hero"
            className="absolute inset-0 z-0"
          />

          {/* Layer 1 — cinematic gradient (stage bounds only) */}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/90 via-background/25 to-transparent"
            aria-hidden
          />

          {/* Layer 2 — prev/next + dots + fullscreen */}
          {hasMultiple ? (
            <MediaStageChrome
              count={project.media.length}
              activeIndex={activeIndex}
              onPrev={goPrev}
              onNext={goNext}
              onFullscreen={() => setFullscreenOpen(true)}
            />
          ) : null}
        </div>
      </div>

      {/* Region 2 — Thumbnail navigation (reserved flow space) */}
      {hasMultiple ? (
        <MediaThumbnailStrip
          media={project.media}
          activeIndex={activeIndex}
          onSelect={goTo}
          title={project.title}
          className="w-full"
        />
      ) : null}

      {/* Region 3 — Project metadata (document flow, below media UI) */}
      <header className="space-y-3 border-t border-border/50 pt-5 sm:pt-6">
        {metadata}
      </header>

      <MediaFullscreen
        open={fullscreenOpen}
        onOpenChange={setFullscreenOpen}
        media={project.media}
        settings={project.mediaSettings}
        sequence={sequence}
        title={project.title}
      />
    </section>
  );
}

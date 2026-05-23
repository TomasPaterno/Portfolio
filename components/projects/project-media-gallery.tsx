"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaControls } from "@/components/media/media-controls";
import { MediaFullscreen } from "@/components/media/media-fullscreen";
import { MediaStage } from "@/components/media/media-stage";
import { MediaThumbnails } from "@/components/media/media-thumbnails";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useMediaSequence } from "@/hooks/use-media-sequence";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 50;

type ProjectMediaGalleryProps = {
  project: Project;
  variant?: "section";
  className?: string;
};

export function ProjectMediaGallery({
  project,
  variant = "section",
  className,
}: ProjectMediaGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const sequence = useMediaSequence({
    media: project.media,
    settings: project.mediaSettings,
    variant: "detail",
    containerRef,
  });

  const { goNext, goPrev, goTo, activeIndex } = sequence;

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
      } else if (e.key === "f" && variant === "section") {
        setFullscreenOpen(true);
      }
    },
    [goNext, goPrev, fullscreenOpen, variant],
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

  if (project.media.length === 0) return null;

  const stage = (
    <div
      ref={containerRef}
      tabIndex={0}
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border border-border bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      role="region"
      aria-roledescription="carousel"
      aria-label={project.title}
    >
      <MediaStage
        media={project.media}
        settings={project.mediaSettings}
        sequence={sequence}
        variant="gallery"
        showCaption
        className="h-full w-full"
      />
    </div>
  );

  return (
    <ScrollReveal>
      <div className="space-y-4">
        {stage}
        <MediaControls
          count={project.media.length}
          activeIndex={activeIndex}
          onPrev={goPrev}
          onNext={goNext}
          onFullscreen={() => setFullscreenOpen(true)}
        />
        <MediaThumbnails
          media={project.media}
          activeIndex={activeIndex}
          onSelect={goTo}
          title={project.title}
        />
        <MediaFullscreen
          open={fullscreenOpen}
          onOpenChange={setFullscreenOpen}
          media={project.media}
          settings={project.mediaSettings}
          sequence={sequence}
          title={project.title}
        />
      </div>
    </ScrollReveal>
  );
}

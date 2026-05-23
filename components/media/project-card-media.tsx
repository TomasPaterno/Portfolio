"use client";

import { useRef } from "react";
import { MediaDots } from "@/components/media/media-dots";
import { MediaStage } from "@/components/media/media-stage";
import { useMediaSequence } from "@/hooks/use-media-sequence";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

type ProjectCardMediaProps = {
  project: Project;
  priority?: boolean;
  className?: string;
};

export function ProjectCardMedia({
  project,
  priority = false,
  className,
}: ProjectCardMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequence = useMediaSequence({
    media: project.media,
    settings: project.mediaSettings,
    variant: "preview",
    containerRef,
  });

  if (project.media.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden bg-secondary",
          className,
        )}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] overflow-hidden bg-secondary",
        className,
      )}
      onMouseEnter={() => sequence.setHovered(true)}
      onMouseLeave={() => sequence.setHovered(false)}
      aria-hidden
    >
      <MediaStage
        media={project.media}
        settings={project.mediaSettings}
        sequence={sequence}
        variant="card"
      />
      <MediaDots
        count={project.media.length}
        activeIndex={sequence.activeIndex}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
      {/* priority hint for first card — first image gets LCP via MediaStage */}
      {priority && project.media[0]?.type === "image" && (
        <span className="sr-only">priority</span>
      )}
    </div>
  );
}

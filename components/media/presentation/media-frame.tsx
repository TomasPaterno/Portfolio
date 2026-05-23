"use client";

import type { ReactNode } from "react";
import type { MediaRenderContext } from "@/lib/media/presentation/types";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  context: MediaRenderContext;
  className?: string;
  children: ReactNode;
};

export function MediaFrame({ context, className, children }: MediaFrameProps) {
  if (context === "fullscreen") {
    return (
      <div className={cn("relative min-h-0 flex-1", className)}>{children}</div>
    );
  }

  if (context === "thumbnail") {
    return (
      <div className={cn("relative aspect-video h-full w-full", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import type { ResolvedPresentation } from "@/lib/media/presentation/types";
import { cn } from "@/lib/utils";

type MediaSurfaceProps = {
  presentation: ResolvedPresentation;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

export function MediaSurface({
  presentation,
  loading = false,
  className,
  children,
}: MediaSurfaceProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        presentation.backgroundClass,
        loading && "animate-pulse",
        className,
      )}
    >
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

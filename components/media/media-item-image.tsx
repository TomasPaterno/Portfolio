"use client";

import Image from "next/image";
import type { ResolvedPresentation } from "@/lib/media/presentation/types";
import { cn } from "@/lib/utils";

type MediaItemImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  presentation: ResolvedPresentation;
  onReady?: () => void;
  className?: string;
};

export function MediaItemImage({
  src,
  alt,
  priority = false,
  presentation,
  onReady,
  className,
}: MediaItemImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={presentation.sizes}
      className={cn("h-full w-full", className)}
      style={{
        objectFit: presentation.fit,
        objectPosition: presentation.objectPosition,
      }}
      onLoad={onReady}
    />
  );
}

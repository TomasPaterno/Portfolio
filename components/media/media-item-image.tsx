"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaItemImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function MediaItemImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: MediaItemImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      sizes={sizes}
    />
  );
}

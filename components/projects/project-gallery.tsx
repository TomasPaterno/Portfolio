"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

type ProjectGalleryProps = {
  images: string[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <ScrollReveal>
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-secondary">
          <Image
            src={images[active]}
            alt={`${title} gallery ${active + 1}`}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-video overflow-hidden rounded-lg border transition-all",
                  active === i
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}

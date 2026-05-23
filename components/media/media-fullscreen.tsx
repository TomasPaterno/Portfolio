"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { MediaStage } from "@/components/media/media-stage";
import type { UseMediaSequenceReturn } from "@/hooks/use-media-sequence";
import type { MediaFitMode } from "@/lib/media/presentation/types";
import type { ProjectMediaItem, ProjectMediaSettings } from "@/types/media";
import { cn } from "@/lib/utils";

type MediaFullscreenProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: ProjectMediaItem[];
  settings: ProjectMediaSettings;
  sequence: UseMediaSequenceReturn;
  title: string;
};

export function MediaFullscreen({
  open,
  onOpenChange,
  media,
  settings,
  sequence,
  title,
}: MediaFullscreenProps) {
  const t = useTranslations("projectDetail.media");
  const [fitOverride, setFitOverride] = useState<MediaFitMode | null>(null);

  const toggleFit = useCallback(() => {
    setFitOverride((current) => (current === "cover" ? "contain" : "cover"));
  }, []);

  useEffect(() => {
    if (!open) {
      setFitOverride(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        toggleFit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggleFit]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed inset-4 z-50 flex flex-col outline-none sm:inset-8",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
          aria-label={t("fullscreen")}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
            <Dialog.Close
              className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-md"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
            <div className="relative min-h-0 flex-1">
              <MediaStage
                media={media}
                settings={settings}
                sequence={sequence}
                context="fullscreen"
                fitOverride={fitOverride}
                showCaption
                className="h-full min-h-[50vh]"
              />
            </div>
            {fitOverride ? (
              <p className="absolute bottom-4 left-4 z-10 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                {fitOverride === "cover" ? "Cover" : "Contain"} (C)
              </p>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

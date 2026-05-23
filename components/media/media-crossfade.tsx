"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  getMediaVariants,
  mediaTransitionConfig,
} from "@/lib/animations/media-variants";
import type { MediaTransition } from "@/types/media";
import { cn } from "@/lib/utils";

type MediaCrossfadeProps = {
  itemKey: string;
  transition: MediaTransition;
  reducedMotion: boolean;
  ready?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function MediaCrossfade({
  itemKey,
  transition,
  reducedMotion,
  ready = true,
  children,
  className,
}: MediaCrossfadeProps) {
  const variants = getMediaVariants(transition, reducedMotion);
  const transitionConfig = mediaTransitionConfig(reducedMotion);

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={itemKey}
        className={cn("absolute inset-0", className)}
        variants={variants}
        initial={false}
        animate={ready ? "enter" : { opacity: 0 }}
        exit="exit"
        transition={transitionConfig}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

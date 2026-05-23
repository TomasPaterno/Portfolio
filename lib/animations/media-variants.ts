import type { MediaTransition } from "@/types/media";
import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function getMediaVariants(
  transition: MediaTransition,
  reducedMotion: boolean,
): Variants {
  if (reducedMotion) {
    return {
      enter: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  switch (transition) {
    case "slide":
      return {
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };
    case "fade-blur":
      return {
        enter: { opacity: 1, filter: "blur(0px)", scale: 1 },
        exit: { opacity: 0, filter: "blur(8px)", scale: 1.01 },
      };
    case "crossfade":
    default:
      return {
        enter: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.01 },
      };
  }
}

export function mediaTransitionConfig(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? 0.01 : 0.6,
    ease,
  };
}

import { z } from "zod";
import { projectLocalizedStringSchema } from "./localized-schema";

const mediaPresentationSchema = z.object({
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  aspectRatio: z.number().positive().optional(),
  focalX: z.number().min(0).max(1).optional(),
  focalY: z.number().min(0).max(1).optional(),
  cropMode: z.enum(["auto", "cover", "contain", "fill"]).optional(),
  posterImage: z.string().optional(),
  preloadStrategy: z.enum(["none", "metadata", "auto"]).optional(),
});

const mediaBaseSchema = z.object({
  id: z.string().optional(),
  order: z.number().int().optional(),
  /** Excluded from public gallery when true */
  hidden: z.boolean().optional(),
  presentation: mediaPresentationSchema.optional(),
});

export const mediaImageSchema = mediaBaseSchema.extend({
  type: z.literal("image"),
  src: z.string().min(1),
  thumbnail: z.string().optional(),
  alt: projectLocalizedStringSchema,
  caption: projectLocalizedStringSchema.optional(),
  priority: z.boolean().optional(),
});

export const mediaVideoSchema = mediaBaseSchema.extend({
  type: z.literal("video"),
  src: z.string().min(1),
  poster: z.string().optional(),
  thumbnail: z.string().optional(),
  alt: projectLocalizedStringSchema,
  caption: projectLocalizedStringSchema.optional(),
  muted: z.boolean().optional(),
  playsInline: z.boolean().optional(),
  loop: z.boolean().optional(),
  duration: z.number().positive().optional(),
});

export const mediaItemSchema = z.discriminatedUnion("type", [
  mediaImageSchema,
  mediaVideoSchema,
]);

export const mediaSettingsSchema = z.object({
  imageDurationMs: z.number().int().positive().optional(),
  transition: z.enum(["crossfade", "slide", "fade-blur"]).optional(),
  autoplay: z.boolean().optional(),
  pauseWhenOffscreen: z.boolean().optional(),
  pauseOnHover: z.boolean().optional(),
  preload: z.enum(["adjacent", "none", "all-images"]).optional(),
  manualHoldMs: z.number().int().positive().optional(),
  reducedMotionFallback: z.enum(["static-first", "first-only"]).optional(),
});

export type MediaItemRaw = z.infer<typeof mediaItemSchema>;
export type MediaSettingsRaw = z.infer<typeof mediaSettingsSchema>;
export type MediaPresentationRaw = z.infer<typeof mediaPresentationSchema>;

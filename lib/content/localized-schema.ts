import { z } from "zod";

export const projectLocalizedStringSchema = z.union([
  z.object({
    es: z.string().min(1),
    en: z.string().min(1),
  }),
  z.string().min(1),
]);

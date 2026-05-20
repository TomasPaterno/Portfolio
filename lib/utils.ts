import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateLocales: Record<Locale, string> = {
  es: "es-AR",
  en: "en-US",
};

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocales[locale], {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

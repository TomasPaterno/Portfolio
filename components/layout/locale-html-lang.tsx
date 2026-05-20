"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/routing";

type LocaleHtmlLangProps = {
  locale: Locale;
};

/** Sets document lang on the root html element (root layout has no locale segment). */
export function LocaleHtmlLang({ locale }: LocaleHtmlLangProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

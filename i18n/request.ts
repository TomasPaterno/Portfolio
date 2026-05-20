import fs from "fs/promises";
import path from "path";
import { getRequestConfig } from "next-intl/server";
import { shouldReloadContentFromDisk } from "@/lib/content/content-cache";
import { parseLocale, routing, type Locale } from "./routing";

async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  if (shouldReloadContentFromDisk()) {
    const filePath = path.join(process.cwd(), "messages", `${locale}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  }
  return (await import(`../messages/${locale}.json`)).default;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = parseLocale(await requestLocale) ?? routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/** Must stay in sync with `routing.locales` in i18n/routing.ts (Next.js requires static matchers). */
export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};

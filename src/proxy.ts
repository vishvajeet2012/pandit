import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/** Sends "/" to the default locale and keeps every URL prefixed with /en or /hi. */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, generated icons, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|opengraph-image|.*\\..*).*)"],
};

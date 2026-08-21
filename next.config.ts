import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // There is no favicon.ico in the repo — the icon is generated from
  // src/config/site.ts, so point the legacy path at it.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
};

export default withNextIntl(nextConfig);

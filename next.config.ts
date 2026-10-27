import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// cacheComponents/partialPrefetching from the scaffold are off: next-intl resolves the request
// locale through headers(), and every page here is statically generated per locale instead.
const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback; originals in public/assets stay the optimiser's source
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    localPatterns: [{ pathname: "/assets/**" }],
    minimumCacheTTL: 2678400, // 31 days; Next cannot invalidate this cache, so give a replaced image a new file name
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);

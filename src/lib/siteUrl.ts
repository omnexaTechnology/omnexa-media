/* Absolute origin for metadata, sitemap and robots. Set NEXT_PUBLIC_SITE_URL in production (no domain is assumed). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

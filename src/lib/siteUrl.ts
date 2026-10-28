/* Absolute origin for metadata, sitemap and robots. NEXT_PUBLIC_* is inlined at build time, so a production build
   without it would ship localhost canonicals: fail the build instead. `next dev` falls back to localhost. */
function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV !== "production") return (raw ?? "http://localhost:3000").replace(/\/$/, "");
  let u: URL;
  try {
    u = new URL(raw ?? "");
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be set for production builds (e.g. https://media.omnexa.sa); got "${raw ?? ""}"`);
  }
  if (u.protocol !== "https:" || u.pathname !== "/" || u.search || u.hash || /^(localhost|127\.|\[::1\])/.test(u.hostname))
    throw new Error(`NEXT_PUBLIC_SITE_URL must be a public https origin with no path (e.g. https://media.omnexa.sa); got "${raw}"`);
  return u.origin;
}

export const SITE_URL = siteUrl();

import type { MetadataRoute } from "next";
import { SVCPAGES, WORKS, WORK_SVC } from "@/content/data";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/siteUrl";

/* Every indexable page in both languages, each listing its other-language twin.
   Works shown as service pages (WORK_SVC) redirect, so only their service URL is listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...WORKS.filter((w) => !(WORK_SVC as Record<string, string>)[w.id]).map((w) => `/work/${w.id}`),
    ...Object.keys(SVCPAGES).map((id) => `/services/${id}`),
  ];
  const url = (l: string, p: string) => `${SITE_URL}/${l}${p}`;
  return paths.flatMap((p) =>
    routing.locales.map((l) => ({
      url: url(l, p),
      alternates: { languages: Object.fromEntries(routing.locales.map((x) => [x, url(x, p)])) },
    })),
  );
}

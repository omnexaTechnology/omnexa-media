import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/siteUrl";
import DIMS from "@/content/media-dims.json";

export const SITE_NAME: Record<AppLocale, string> = { ar: "أومنيكسا ميديا", en: "Omnexa Media" };
const OG_LOCALE: Record<AppLocale, string> = { ar: "ar_SA", en: "en_US" };
const dims: Record<string, number[]> = DIMS;

/* default share image (scripts/gen-og.mjs): JPEG, since some platforms ignore WebP previews */
const DEFAULT_IMAGE = { src: "/assets/covers/og.jpg", width: 1200, height: 630, type: "image/jpeg" };

const abs = (path: string) => `${SITE_URL}${path}`;

/* Canonical, ar/en/x-default alternates, Open Graph and Twitter for one page, all absolute on SITE_URL.
   `path` is the locale-less path ("" for home, "/services/ads"…); `image` is a /assets/… file (default: og.jpg). */
export function pageMetadata({ locale, path, title, description, image, imageAlt }: {
  locale: AppLocale; path: string; title: string; description: string; image?: string; imageAlt?: string;
}): Metadata {
  const url = abs(`/${locale}${path}`);
  const languages: Record<string, string> = Object.fromEntries(routing.locales.map((l) => [l, abs(`/${l}${path}`)]));
  languages["x-default"] = abs(`/${routing.defaultLocale}${path}`);
  const [width, height] = image ? (dims[image] ?? []) : [DEFAULT_IMAGE.width, DEFAULT_IMAGE.height];
  const img = {
    url: abs(image ?? DEFAULT_IMAGE.src),
    ...(width && height ? { width, height } : {}),
    ...(image ? {} : { type: DEFAULT_IMAGE.type }),
    alt: imageAlt ?? SITE_NAME[locale],
  };
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME[locale],
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [img],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

/* JSON-LD built only from facts already visible on the page (names, titles, URLs). Organization/Service schema waits
   for the owner to confirm contact and business details (docs/SEO_GEO_IMPLEMENTATION_PLAN.md, Phase 4). */
export function websiteJsonLd(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME[locale],
    alternateName: routing.locales.filter((l) => l !== locale).map((l) => SITE_NAME[l]),
    url: `${SITE_URL}/`,
    inLanguage: locale,
  };
}

/* Home → page. `name` is the page's visible H1 */
export function breadcrumbJsonLd(locale: AppLocale, homeName: string, path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: abs(`/${locale}`) },
      { "@type": "ListItem", position: 2, name, item: abs(`/${locale}${path}`) },
    ],
  };
}

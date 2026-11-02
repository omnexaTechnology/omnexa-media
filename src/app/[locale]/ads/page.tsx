import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/data";
import { COPY } from "@/content/media299";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Hero from "@/components/media299/Hero";
import { Addons, End, FaqSection, How, Included, Overview, Why } from "@/components/media299/Sections";
import LandingNav from "@/components/media299/LandingNav";
import Effects from "@/components/media299/Effects";
import LandingFooter from "@/components/media299/LandingFooter";
import "@/styles/media299.css";

/* /ads — Omnexa Media packages: an independent campaign page (moved from /299, which redirects here). Offer structure from omnexa.sa/ar/299,
   content from Omnexa Media's own services, visual identity from the Media site (tokens, type, buttons, icons). */

export async function generateMetadata({ params }: PageProps<"/[locale]/ads">): Promise<Metadata> {
  const l = (await params).locale as Locale;
  const m = COPY[l].meta;
  return pageMetadata({ locale: l, path: "/ads", title: m.title, description: m.desc });
}

export default async function PackagePage({ params }: PageProps<"/[locale]/ads">) {
  const l = (await params).locale as Locale;
  setRequestLocale(l); // locale validated by the [locale] layout
  const t = await getTranslations();

  return (
    <div className="m299">
      {/* body.on-project before hydration: the site booking section stays hidden (this page has its own request form) */}
      <script dangerouslySetInnerHTML={{ __html: "document.body.classList.add('on-project')" }} />
      <JsonLd data={breadcrumbJsonLd(l, t("nav.home"), "/ads", COPY[l].meta.title.split(" — ")[0])} />
      {/* this page's own navbar; the site header is hidden here only (media299.css) */}
      <LandingNav />
      <Hero l={l} />
      <Overview l={l} />
      <Addons l={l} />
      <Included l={l} />
      <Why l={l} />
      <How l={l} />
      <FaqSection l={l} />
      <End l={l} />
      {/* this page's own footer (in-page links only); the site footer is hidden here only (media299.css) */}
      <LandingFooter l={l} />
      <Effects />
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, dirOf } from "@/i18n/routing";
import { cairo, icons, plex } from "@/lib/fonts";
import { SITE_URL } from "@/lib/siteUrl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Fab from "@/components/layout/Fab";
import Contact from "@/components/sections/Contact";
import MotionLayer from "@/components/motion/MotionLayer";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/* Site-wide defaults only; each page sets its own canonical/alternates/social metadata via pageMetadata (lib/seo.ts),
   so no page can inherit the homepage canonical. */
export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return { metadataBase: new URL(SITE_URL), title: t("title"), description: t("desc") };
}

export const viewport: Viewport = { themeColor: "#5700AE", width: "device-width", initialScale: 1, viewportFit: "cover" };

/* Runs before first paint:
   - theme: stored choice or light (reference behaviour), so no flash;
   - gsap-on: reveal blocks are visible by default (the motion layer hides what it animates), so content never depends on JS;
   - motion-pending: hides only the load-timeline elements until GSAP has set their start state (3 s safety net). */
const PREPAINT_JS = `(function(d){d=document.documentElement;try{d.setAttribute("data-theme",localStorage.getItem("om-theme")==="dark"?"dark":"light")}catch(e){}d.classList.add("gsap-on");if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion-pending");setTimeout(function(){d.classList.remove("motion-pending")},3000)}})()`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={dirOf(locale)} data-theme="light" className={`${plex.variable} ${cairo.variable} ${icons.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_JS }} />
      </head>
      {/* body.on-project is set by an inline script on detail pages before hydration */}
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <Header />
          <main id="main">
            {children}
            <Contact />
          </main>
          <Footer />
          <Fab />
          <MotionLayer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

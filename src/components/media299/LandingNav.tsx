"use client";

/* eslint-disable @next/next/no-img-element -- small SVG/PNG logos swapped by CSS per locale and bar state */
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/content/data";
import { COPY } from "@/content/media299";
import { useTheme } from "@/components/layout/useTheme";
import { rememberScrollAnchor, switchLocaleHref } from "@/components/layout/localeSwitch";
import BtnInner from "@/components/ui/BtnInner";
import Ms from "@/components/ui/Ms";

/* /ads' own navigation bar (the site header is hidden on this page by media299.css): logo → site home,
   theme + language, one CTA to the request section — the same bar on every screen size (no section links,
   no menu panel). Transparent over the hero, a glass bar once the page scrolls. Uses the shared theme/locale
   helpers without changing them. */
export default function LandingNav() {
  const l = useLocale() as Locale;
  const t = useTranslations("ui");
  const c = COPY[l].nav;
  const [dark, toggleTheme] = useTheme();
  const [solid, setSolid] = useState(false);
  const other = l === "ar" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`m-nav${solid ? " solid" : ""}`}>
      <div className="container m-nav-row">
        <a className="m-nav-logo" href={`/${l}`} aria-label={c.home}>
          <img className="brand-ar w" src="/assets/brand/logo-ar.svg" alt="" width={76} height={58} />
          <img className="brand-en w" src="/assets/brand/logo-en.png" alt="" width={90} height={50} />
          <img className="brand-ar c" src="/assets/brand/logo-ar-light.svg" alt="" width={76} height={58} />
          <img className="brand-en c" src="/assets/brand/logo-en-light.png" alt="" width={90} height={50} />
        </a>
        <div className="m-nav-end">
          <span className="m-nav-tools">
            <button type="button" className="m-nav-ic" aria-label={t("theme")} aria-pressed={dark} onClick={toggleTheme}>
              <Ms name={dark ? "light_mode" : "dark_mode"} />
            </button>
            <a className="m-nav-ic m-nav-lang" href={switchLocaleHref("/ads", other)} hrefLang={other} lang={other} aria-label={t("langLabel")} onClick={rememberScrollAnchor}>
              {t("lang")}
            </a>
          </span>
          <a className="btn btn-primary btn-sm m-nav-cta" href="#order"><BtnInner label={c.cta} /></a>
        </div>
      </div>
    </header>
  );
}

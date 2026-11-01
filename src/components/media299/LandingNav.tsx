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
   in-page section links with scroll-spy, theme + language, one CTA to the request section; on ≤1023px a menu
   panel. Transparent over the hero, a glass bar once the page scrolls. Uses the shared theme/locale helpers
   without changing them. */
export default function LandingNav() {
  const l = useLocale() as Locale;
  const t = useTranslations("ui");
  const c = COPY[l].nav;
  const [dark, toggleTheme] = useTheme();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const other = l === "ar" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 24);
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur: string | null = null;
      for (const [id] of c.links) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      // the request section follows the FAQ: no link is active there
      const order = document.getElementById("order");
      if (order && order.offsetTop <= y) cur = null;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [c.links]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 1023 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  const links = c.links.map(([id, label]) => (
    <a key={id} href={`#${id}`} className={active === id ? "on" : undefined} aria-current={active === id ? "true" : undefined} onClick={() => setOpen(false)}>
      {label}
    </a>
  ));
  const tools = (
    <span className="m-nav-tools">
      <button type="button" className="m-nav-ic" aria-label={t("theme")} aria-pressed={dark} onClick={toggleTheme}>
        <Ms name={dark ? "light_mode" : "dark_mode"} />
      </button>
      <a className="m-nav-ic m-nav-lang" href={switchLocaleHref("/ads", other)} hrefLang={other} lang={other} aria-label={t("langLabel")} onClick={rememberScrollAnchor}>
        {t("lang")}
      </a>
    </span>
  );

  return (
    <header className={`m-nav${solid || open ? " solid" : ""}${open ? " open" : ""}`}>
      <div className="container m-nav-row">
        <a className="m-nav-logo" href={`/${l}`} aria-label={c.home}>
          <img className="brand-ar w" src="/assets/brand/logo-ar.svg" alt="" width={76} height={58} />
          <img className="brand-en w" src="/assets/brand/logo-en.png" alt="" width={90} height={50} />
          <img className="brand-ar c" src="/assets/brand/logo-ar-light.svg" alt="" width={76} height={58} />
          <img className="brand-en c" src="/assets/brand/logo-en-light.png" alt="" width={90} height={50} />
        </a>
        <nav className="m-nav-links" aria-label={c.menu}>{links}</nav>
        <div className="m-nav-end">
          {tools}
          <a className="btn btn-primary btn-sm m-nav-cta" href="#order"><BtnInner label={c.cta} /></a>
          <button type="button" className="m-nav-ic m-nav-burger" aria-expanded={open} aria-controls="mNavPanel" aria-label={open ? c.close : c.menu} onClick={() => setOpen((o) => !o)}>
            <Ms name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <div className="m-nav-panel" id="mNavPanel" hidden={!open}>
        <nav className="container" aria-label={c.menu}>
          {links}
          <div className="m-nav-panel-end">
            {tools}
            <a className="btn btn-primary m-nav-cta2" href="#order" onClick={() => setOpen(false)}><BtnInner label={c.cta} /></a>
          </div>
        </nav>
      </div>
    </header>
  );
}

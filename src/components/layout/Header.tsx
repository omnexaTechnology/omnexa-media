"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { WA_PATH, waHref } from "@/content/site";
import { Svg } from "@/components/ui/PlatIcon";
import BtnInner from "@/components/ui/BtnInner";
import Ms from "@/components/ui/Ms";
import SocialRow from "./SocialRow";
import { useTheme } from "./useTheme";
import { switchLocaleHref, rememberScrollAnchor, restoreScrollAnchor, scrollToHashTarget } from "./localeSwitch";

const NAV = ["top", "services", "about", "work", "process", "faq"] as const;
const NAV_KEY = { top: "home", services: "services", about: "about", work: "work", process: "process", faq: "faq" } as const;
const SPY = ["services", "about", "work", "process", "faq", "contact"];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(isHome ? "top" : pathname.startsWith("/services") ? "services" : null);
  const [dark, toggleTheme] = useTheme();
  const home = `/${locale}`;
  const other = locale === "ar" ? "en" : "ar";
  const langHref = switchLocaleHref(pathname, other);

  // land where the visitor expects: the saved place after a language switch, else the #section in the URL
  useEffect(() => (restoreScrollAnchor() ? undefined : scrollToHashTarget()), []);

  // detail pages use the solid header (reference: body.on-project)
  useEffect(() => {
    document.body.classList.toggle("on-project", !isHome);
  }, [isHome]);

  // app.js onScroll: solid header after 20px + scroll-spy on the home page
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (!isHome) return;
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur = "top";
      for (const id of SPY) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 1060 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const navLinks = (extra?: boolean) => (
    <>
      {NAV.map((id) => (
        <a
          key={id}
          href={`${home}#${id}`}
          className={active === id ? "active" : undefined}
          aria-current={active === id ? "true" : undefined}
          onClick={() => setOpen(false)}
        >
          {t(`nav.${NAV_KEY[id]}`)}
        </a>
      ))}
      {extra && (
        <a href={`${home}#contact`} className={active === "contact" ? "active" : undefined} onClick={() => setOpen(false)}>
          {t("nav.contactP")}
        </a>
      )}
    </>
  );

  const themeBtn = (id?: string) => (
    <button id={id} className="hd-ic" type="button" aria-label={t("ui.theme")} aria-pressed={dark} onClick={toggleTheme}>
      <span className="ms ms-light" aria-hidden="true">dark_mode</span>
      <span className="ms ms-dark" aria-hidden="true">light_mode</span>
    </button>
  );
  // a real link: switching locale changes the root layout, so this is a full navigation anyway
  const langBtn = (id?: string) => (
    <a id={id} className="hd-ic hd-lang" href={langHref} hrefLang={other} lang={other} aria-label={t("ui.langLabel")} onClick={rememberScrollAnchor}>
      <span>{t("ui.lang")}</span>
    </a>
  );

  return (
    <>
      <a className="skip" href="#main">{t("skip")}</a>
      <header className={`site-header${scrolled || open ? " scrolled" : ""}`}>
        <div className="container header-row">
          <a className="brand" href={`${home}#top`} aria-label="Omnexa Media">
            {/* eslint-disable @next/next/no-img-element -- small SVG/PNG logos swapped by CSS per theme and locale */}
            <img className="brand-ar dk" src="/assets/brand/logo-ar.svg" alt="أومنيكسا ميديا" width={76} height={58} />
            <img className="brand-en dk" src="/assets/brand/logo-en.png" alt="Omnexa Media" width={90} height={50} />
            <img className="brand-ar lt" src="/assets/brand/logo-ar-light.svg" alt="أومنيكسا ميديا" width={76} height={58} />
            <img className="brand-en lt" src="/assets/brand/logo-en-light.png" alt="Omnexa Media" width={90} height={50} />
            {/* eslint-enable @next/next/no-img-element */}
          </a>
          <nav className="nav-main" aria-label="Main">{navLinks()}</nav>
          <div className="header-tools">
            {themeBtn("themeBtn")}
            {langBtn("langBtn")}
            <a className="btn btn-primary btn-sm header-cta" href={`${home}#contact`}>
              <BtnInner label={t("nav.contact")} />
            </a>
            <button
              id="menuBtn"
              className="hd-ic menu-btn"
              type="button"
              aria-expanded={open}
              aria-controls="drawer"
              aria-label={t(open ? "nav.close" : "nav.menu")}
              onClick={() => setOpen((o) => !o)}
            >
              <Ms name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
        <div className="drawer" id="drawer" hidden={!open}>
          <div className="drawer-top">
            <button className="hd-ic drawer-x" type="button" aria-label={t("nav.close")} onClick={() => setOpen(false)}>
              <Ms name="close" />
            </button>
          </div>
          <div className="drawer-tools-row">
            <span className="drawer-tools">
              {themeBtn()}
              {langBtn()}
            </span>
          </div>
          <nav className="container drawer-nav" aria-label="Mobile">{navLinks(true)}</nav>
          <div className="container drawer-act">
            <a className="btn btn-primary" href={`${home}#contact`} onClick={() => setOpen(false)}>
              <BtnInner label={t("nav.contact")} />
            </a>
            <a className="hd-ic drawer-wa" href={waHref()} target="_blank" rel="noopener" aria-label={t("foot.wa")}>
              <Svg d={WA_PATH} />
            </a>
          </div>
          <SocialRow className="drawer-soc f2-social" />
        </div>
      </header>
    </>
  );
}

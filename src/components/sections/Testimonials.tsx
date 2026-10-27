"use client";

import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PROJECTS, type Locale } from "@/content/data";
import ClientLogo from "@/components/ui/ClientLogo";
import Ms from "@/components/ui/Ms";

/* app.js tsGo/renderTesti: one client at a time; text is the shared sample line (the reference says these are not quotes).
   Auto-advance every 3 s while visible and not hovered/focused; slide + blur out/in, logo turns in (WAAPI). */
const EZ = "cubic-bezier(.45,0,.2,1)";

export default function Testimonials() {
  const t = useTranslations();
  const l = useLocale() as Locale;
  const [i, setI] = useState(0);
  const slide = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const animIn = useRef(false);
  const busy = useRef(false);
  const n = PROJECTS.length;
  const p = PROJECTS[i];

  const go = (k: number) => {
    const next = (k + n) % n, el = slide.current;
    if (busy.current) return;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return setI(next);
    busy.current = true;
    const dx = (document.documentElement.dir === "rtl" ? -1 : 1) * 36;
    el.animate([{ opacity: 1, transform: "none", filter: "blur(0)" }, { opacity: 0, transform: `translateX(${-dx}px)`, filter: "blur(2px)" }], { duration: 260, easing: EZ, fill: "forwards" }).onfinish = () => {
      animIn.current = true;
      setI(next);
    };
  };

  // after the new client is rendered, slide it in
  useLayoutEffect(() => {
    const el = slide.current;
    if (!animIn.current || !el) return;
    animIn.current = false;
    const dx = (document.documentElement.dir === "rtl" ? -1 : 1) * 36;
    el.animate([{ opacity: 0, transform: `translateX(${dx}px)`, filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], { duration: 420, easing: EZ, fill: "forwards" }).onfinish = () => (busy.current = false);
    el.querySelector(".ts-logo")?.animate([{ transform: "rotateY(70deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 760, easing: EZ });
  }, [i]);

  const tick = useEffectEvent(() => go(i + 1));
  useEffect(() => {
    const st = stage.current;
    if (!st || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let vis = false, hover = false;
    const io = new IntersectionObserver((es) => (vis = es[0].isIntersecting));
    io.observe(st);
    const on = () => (hover = true), off = () => (hover = false);
    st.addEventListener("mouseenter", on); st.addEventListener("mouseleave", off);
    st.addEventListener("focusin", on); st.addEventListener("focusout", off);
    const id = setInterval(() => { if (vis && !hover && !document.hidden) tick(); }, 3000);
    return () => {
      clearInterval(id); io.disconnect();
      st.removeEventListener("mouseenter", on); st.removeEventListener("mouseleave", off);
      st.removeEventListener("focusin", on); st.removeEventListener("focusout", off);
    };
  }, []);

  return (
    <div className="ts-stage" id="tsStage" ref={stage}>
      <div className="ts-slide" id="tsSlide" aria-live="polite" ref={slide}>
        <figure className="ts-logo"><span><ClientLogo p={p} alt={p[l].client} /></span></figure>
        <div className="ts-txt">
          <svg className="ts-q" viewBox="0 0 48 36" aria-hidden="true">
            <path d="M0 36V22C0 9.6 6.4 2.2 19 0l2 5.4C13.6 7.4 10.4 11.6 10 18h9v18H0Zm27 0V22C27 9.6 33.4 2.2 46 0l2 5.4C40.6 7.4 37.4 11.6 37 18h9v18H27Z" />
          </svg>
          <p>{t("ts.sample")}</p>
          <b>{p[l].client}</b>
          <div className="ts-nav">
            <button className="ts-arr" type="button" aria-label={t("lb.prev")} onClick={() => go(i - 1)}><Ms name="arrow_back" className="flip" /></button>
            <button className="ts-arr" type="button" aria-label={t("lb.next")} onClick={() => go(i + 1)}><Ms name="arrow_forward" className="flip" /></button>
          </div>
        </div>
      </div>
      <svg className="ill ill-chat" viewBox="0 0 220 170" aria-hidden="true">
        <rect className="ill-f" style={{ "--f": "var(--ill-rose)" } as React.CSSProperties} x="96" y="20" width="110" height="74" rx="18" />
        <path d="M30 52h104a16 16 0 0 1 16 16v44a16 16 0 0 1-16 16H74l-26 22v-22H30a16 16 0 0 1-16-16V68a16 16 0 0 1 16-16Z" />
        <path d="M46 90h4M80 90h4M114 90h4" />
        <path d="M150 20h40a16 16 0 0 1 16 16v36" />
        <path className="ill-s" d="M190 120l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
      </svg>
    </div>
  );
}

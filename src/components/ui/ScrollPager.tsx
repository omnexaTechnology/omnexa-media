"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Ms from "./Ms";

/* app.js scrollPager: dots for a horizontally scrolling row — the active dot is the card nearest the middle,
   a dot/arrow scrolls that card to the middle. `row` is a CSS selector for the scrolling element. */
export default function ScrollPager({ id, row, item, n, small }: { id: string; row: string; item: string; n: number; small?: boolean }) {
  const t = useTranslations("lb");
  const [cur, setCur] = useState(0);

  const nearest = (el: HTMLElement, only?: number) => {
    const rs = el.getBoundingClientRect(), mid = rs.left + rs.width / 2;
    let best = -1, bd = 1e9;
    el.querySelectorAll<HTMLElement>(item).forEach((it, k) => {
      if (only !== undefined && k % n !== only) return;
      const r = it.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) { bd = d; best = k; }
    });
    return { best, mid };
  };

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(row);
    if (!el) return;
    let q = 0;
    const onScroll = () => {
      if (q) return;
      q = requestAnimationFrame(() => { q = 0; setCur(Math.max(0, nearest(el).best) % n); });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(q); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row, item, n]);

  const go = (k: number) => {
    const el = document.querySelector<HTMLElement>(row);
    if (!el) return;
    const { best, mid } = nearest(el, k);
    const it = el.querySelectorAll<HTMLElement>(item)[best];
    if (!it) return;
    const r = it.getBoundingClientRect();
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: r.left + r.width / 2 - mid, behavior: smooth ? "smooth" : "auto" });
    setCur(k);
  };

  return (
    <div className={`pgr${small ? " pgr-sm" : ""} pgr-${id}`} data-pager={id} hidden={n < 2}>
      <button className="pg-btn pg-prev" type="button" aria-label={t("prev")} onClick={() => go((cur - 1 + n) % n)}>
        <Ms name="chevron_left" className="flip" />
      </button>
      <span className="pg-dots">
        {Array.from({ length: n }, (_, k) => (
          <button key={k} type="button" className={k === cur ? "on" : undefined} aria-current={k === cur} aria-label={`${k + 1} / ${n}`} onClick={() => go(k)} />
        ))}
      </span>
      <button className="pg-btn pg-next" type="button" aria-label={t("next")} onClick={() => go((cur + 1) % n)}>
        <Ms name="chevron_right" className="flip" />
      </button>
    </div>
  );
}

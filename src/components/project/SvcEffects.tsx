"use client";

import { useEffect } from "react";

/* Behaviour of the server-rendered service pages — port of svcpages.js svcAnim():
   counters + ".on" when blocks enter, platform icons spread while scrolling, the ads card fan rotates,
   report features light their pins. (The #tlList timeline in svcAnim targets markup the builder never renders.) */
export default function SvcEffects() {
  useEffect(() => {
    const box = document.getElementById("project");
    if (!box) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offs: (() => void)[] = [];

    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        e.target.querySelectorAll<HTMLElement>(".sp-num").forEach((n) => {
          const to = parseFloat(n.dataset.to!), suf = n.dataset.suf ?? "", dec = to % 1 ? 1 : 0, t0 = performance.now();
          if (reduced) { n.textContent = to.toFixed(dec) + suf; return; }
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / 1400);
            n.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        e.target.classList.add("on");
      }
    }, { threshold: 0.25 });
    box.querySelectorAll(".em, .fn, .ba3, .uc, .kb, .wa-stage, .pf-stage, .rp-doc, .rp-pills, .pp, .sp8-stage").forEach((el) => io.observe(el));
    offs.push(() => io.disconnect());

    const wa = box.querySelector<HTMLElement>(".wa-stage");
    if (wa && !reduced) {
      const icons = [...wa.querySelectorAll<HTMLElement>(".wa-ic")];
      const tick = () => {
        const r = wa.getBoundingClientRect(), p = Math.max(-1, Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight));
        icons.forEach((ic, k) => {
          ic.style.setProperty("--sx", ((k % 2 ? 1 : -1) * p * 60).toFixed(1) + "px");
          ic.style.setProperty("--sy", (p * (k < 3 ? -50 : 50)).toFixed(1) + "px");
          ic.style.setProperty("--sr", (p * (k % 2 ? 25 : -25)).toFixed(1) + "deg");
        });
      };
      window.addEventListener("scroll", tick, { passive: true });
      tick();
      offs.push(() => window.removeEventListener("scroll", tick));
    }

    box.querySelectorAll<HTMLElement>(".fn").forEach((fn) => {
      const cs = [...fn.querySelectorAll<HTMLElement>(".fn-c")], dots = [...(fn.parentNode as HTMLElement).querySelectorAll(".fn-dots i")], n = cs.length;
      let cur = 0, hold = 0;
      const set = () => { cs.forEach((c, k) => c.setAttribute("data-pos", String((k - cur + n) % n))); dots.forEach((d, k) => d.classList.toggle("on", k === cur)); };
      const onClick = (e: MouseEvent) => { const k = cs.indexOf((e.target as HTMLElement).closest(".fn-c")!); if (k >= 0) { cur = k; hold = Date.now() + 8000; set(); } };
      fn.addEventListener("click", onClick);
      set();
      const tm = reduced ? 0 : window.setInterval(() => { if (Date.now() > hold && !document.hidden) { cur = (cur + 1) % n; set(); } }, 3400);
      offs.push(() => { fn.removeEventListener("click", onClick); clearInterval(tm); });
    });

    box.querySelectorAll<HTMLElement>("[data-feat]").forEach((li) => {
      const lit = (on: boolean) => { box.querySelector(`[data-pin="${li.dataset.feat}"]`)?.classList.toggle("lit", on); li.classList.toggle("lit", on); };
      const on = () => lit(true), off = () => lit(false);
      li.addEventListener("mouseenter", on); li.addEventListener("mouseleave", off);
      offs.push(() => { li.removeEventListener("mouseenter", on); li.removeEventListener("mouseleave", off); });
    });

    return () => offs.forEach((f) => f());
  }, []);
  return null;
}

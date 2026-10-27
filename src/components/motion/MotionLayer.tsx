"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "@/i18n/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Motion layer — port of ../omnexa-final-run/js/motion.js (rows G1–G19 in docs/animation-inventory.md).
   Same triggers, durations and eases; desktop (≥1024) adds blur + longer rise; reduced motion = no animation.
   It targets the same class names the sections render, and everything it creates is reverted by useGSAP. */
const EASE = "power3.out";
/* play once without `once: true`: a once-trigger that fires while the page loads already scrolled kills itself in the
   middle of the next trigger's refresh loop and crashes ScrollTrigger (seen on /ar#faq and on language switch) */
const PLAY_ONCE = "play none none none";
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)];
const reducedNow = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* split text nodes into word spans — words, never letters, so Arabic shaping stays intact.
   Only static server-rendered copy is split (React never re-renders these nodes). */
function splitWords(el: Element | null): HTMLElement[] {
  if (!el) return [];
  if ((el as HTMLElement).dataset.split === "1") return $$(".mw", el);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) if (n.nodeValue?.trim() && !n.parentElement?.closest(".ab-sel, .ab-tile, .ms, bdi")) nodes.push(n as Text);
  for (const tn of nodes) {
    const frag = document.createDocumentFragment();
    for (const part of tn.nodeValue!.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
      const s = document.createElement("span");
      s.className = "mw";
      s.textContent = part;
      frag.appendChild(s);
    }
    tn.parentNode!.replaceChild(frag, tn);
  }
  (el as HTMLElement).dataset.split = "1";
  return $$(".mw", el);
}

/* every element animates in once per page view (ScrollTrigger.batch can re-fire) */
const seen = new WeakSet<Element>();
const fresh = (list: Element[]) => list.filter((e) => (seen.has(e) ? false : (seen.add(e), true)));

export default function MotionLayer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const firstLoad = useRef(true);

  useGSAP(
    () => {
      const root = document.documentElement;
      const rtl = root.dir === "rtl";
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)", mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const c = ctx.conditions as { desktop: boolean };
          const blur = c.desktop ? "blur(10px)" : "blur(0px)", rise = c.desktop ? 60 : 40;

          /* G1–G8 — load timeline (header on first load; hero parts only exist on the home page) */
          const tl = gsap.timeline({ defaults: { ease: EASE } });
          if (firstLoad.current) tl.from(".site-header .header-row > *", { y: -16, opacity: 0, duration: 0.5, stagger: 0.06 });
          if (isHome) {
            tl.from(splitWords(document.querySelector(".hc-title")), { opacity: 0, y: 26, filter: blur, duration: 0.7, stagger: 0.05 }, "-=.25")
              .from(".hc-ic i", { scale: 0, rotation: -40, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2.2)" }, "-=.45")
              .from(".hc-box", { rotation: -16, scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(2.4)" }, "-=.4")
              .from(".hcd-o", { opacity: 0, duration: 0.5, stagger: 0.07 }, "-=.3")
              .from(".hc-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=.35")
              .from(".hc-btn", { opacity: 0, y: 16, scale: 0.96, duration: 0.5 }, "-=.35")
              .from(".hcd", { opacity: 0, y: 120, duration: 0.9, stagger: 0.09 }, "-=.4");
            const hn = document.querySelector<HTMLElement>(".hcd-num");
            if (hn) {
              const o = { v: 0 }, to = +hn.dataset.to!;
              hn.textContent = "0";
              tl.to(o, { v: to, duration: 1.2, ease: "power2.out", onUpdate: () => { hn.textContent = String(Math.round(o.v)); } }, "-=.5");
            }
          }

          /* G18 — detail page enters */
          if (!isHome) {
            const proj = document.getElementById("project");
            if (proj) gsap.fromTo(proj, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE, clearProps: "transform,opacity" });
          }

          /* G9 — section heads: tag → words (blur) → icon chips → lead */
          $$("#home .shead, #project .shead, #contact .shead").forEach((head) => {
            const words = $$(".t1, .t2", head).flatMap((t) => splitWords(t));
            gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: { trigger: head, start: "top 82%", toggleActions: PLAY_ONCE } })
              .from($$(".ab-tag", head), { opacity: 0, y: 14, duration: 0.45 })
              .from(words, { opacity: 0, y: 18, filter: blur, duration: 0.6, stagger: 0.05 }, "-=.2")
              .from($$(".ab-sel, .ab-tile", head), { opacity: 0, scale: 0.6, duration: 0.45, stagger: 0.08 }, "-=.45")
              .from($$(".s-sub, .ab-sub", head), { opacity: 0, y: 16, duration: 0.5 }, "-=.35");
          });

          /* G10 — generic reveal blocks */
          const reveal = $$("#home [data-reveal]:not(.shead):not(.faq-item), #contact [data-reveal]:not(.shead), #project [data-reveal]:not(.shead)");
          if (reveal.length)
            ScrollTrigger.batch(reveal, {
              start: "top 88%",
              onEnter: (els) => { const f = fresh(els); if (f.length) gsap.fromTo(f, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.08, overwrite: true }); },
            });

          /* G11 — staggered card groups */
          ([[".sv7-c", 0.1], [".faq-item", 0.06], [".f2-nav a, .f2-social a", 0.03], ["#project .sx-c, #project .p6-ctab", 0.06]] as const).forEach(([sel, st]) => {
            const els = $$(sel);
            if (els.length)
              ScrollTrigger.batch(els, {
                start: "top 90%",
                onEnter: (b) => { const f = fresh(b); if (f.length) gsap.fromTo(f, { opacity: 0, y: rise * 0.6 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: st, overwrite: true }); },
              });
          });

          /* G12 — about numbers fall in with a bounce, then count up */
          const rps = $$("#resGrid .rp");
          if (rps.length) {
            $$("#resGrid .rp-n").forEach((n) => (n.textContent = "0"));
            const atl = gsap.timeline({ scrollTrigger: { trigger: "#resGrid", start: "top 80%", toggleActions: PLAY_ONCE } });
            rps.forEach((el, i) => {
              const n = el.querySelector<HTMLElement>(".rp-n");
              atl.from(el, {
                y: -320, opacity: 0, rotation: i % 2 ? 14 : -14, duration: c.desktop ? 1.1 : 0.9, ease: "bounce.out",
                onComplete: n ? () => { const o = { v: 0 }, to = +n.dataset.to!; gsap.to(o, { v: to, duration: 1.1, ease: "power2.out", onUpdate: () => { n.textContent = String(Math.round(o.v)); } }); } : undefined,
              }, i * 0.16);
            });
          }

          /* G13 — social icons fly out of the megaphone's mouth (mouth side depends on direction) */
          const abGrid = document.getElementById("abGrid");
          const mic = abGrid?.querySelector(".ab-mic");
          if (abGrid && mic) {
            const icons = $$(".abi", abGrid);
            let micDone = false;
            gsap.set(icons, { opacity: 0 });
            ScrollTrigger.create({
              trigger: abGrid, start: "top 70%",
              onEnter: () => {
                if (micDone) return;
                micDone = true;
                const m = mic.getBoundingClientRect(), mx = m.left + m.width * (rtl ? 0.43 : 0.57), my = m.top + m.height * 0.43;
                icons.forEach((ic, i) => {
                  const r = ic.getBoundingClientRect();
                  gsap.fromTo(ic, { x: mx - (r.left + r.width / 2), y: my - (r.top + r.height / 2), scale: 0.2, rotation: -40, opacity: 0 },
                    { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.2, delay: 0.2 + i * 0.16, ease: EASE });
                });
              },
            });
          }

          /* G15 — portfolio stage soft scale-in */
          if (document.getElementById("gfold"))
            gsap.from("#gfold", { opacity: 0, y: rise, scale: 0.97, duration: 0.9, ease: EASE, scrollTrigger: { trigger: "#gfold", start: "top 85%", toggleActions: PLAY_ONCE } });

          /* G16 — footer wordmark scrub (desktop) */
          if (c.desktop) gsap.from(".f2-wm", { yPercent: 40, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".footer", start: "top 90%", end: "bottom bottom", scrub: 0.8 } });

          root.classList.remove("motion-pending");
        },
      );
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.classList.add("reduce-motion");
        root.classList.remove("motion-pending");
        return () => root.classList.remove("reduce-motion");
      });

      firstLoad.current = false;
      // positions change once web fonts land
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  /* G17 — the work row replays its entrance after a filter change */
  useEffect(() => {
    const onWork = () => {
      if (reducedNow()) return;
      gsap.fromTo("#wkRow .sx-c", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.06, overwrite: true });
    };
    document.addEventListener("om:work", onWork);
    return () => document.removeEventListener("om:work", onWork);
  }, []);

  /* G19 — drawer links cascade in when the menu opens */
  useEffect(() => {
    const drawer = document.getElementById("drawer");
    if (!drawer) return;
    const mo = new MutationObserver(() => {
      if (drawer.hidden || reducedNow()) return;
      gsap.from("#drawer .drawer-nav a", { opacity: 0, x: document.documentElement.dir === "rtl" ? 24 : -24, duration: 0.35, ease: EASE, stagger: 0.04, overwrite: true });
    });
    mo.observe(drawer, { attributes: true, attributeFilter: ["hidden"] });
    return () => mo.disconnect();
  }, []);

  /* W3 — phones: card rows glide to the next card every 3.2 s; a touch/wheel holds them for 7 s (app.js omRows) */
  useEffect(() => {
    if (reducedNow() || !matchMedia("(max-width: 767px)").matches) return;
    const timers: number[] = [];
    const cleanups: (() => void)[] = [];
    const glide = (row: HTMLElement, dx: number) => {
      const from = row.scrollLeft, snap = row.style.scrollSnapType;
      let t0 = 0;
      row.style.scrollSnapType = "none";
      const step = (now: number) => {
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0) / 650), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        row.scrollLeft = from + dx * e;
        if (p < 1) requestAnimationFrame(step);
        else row.style.scrollSnapType = snap;
      };
      requestAnimationFrame(step);
    };
    for (const row of $$("#heroCards, .sv7, #wkRow, #relSx, .uc, .kb, .fn4, .p6-steps")) {
      let hold = 0;
      const touch = () => (hold = Date.now() + 7000);
      (["touchstart", "pointerdown", "wheel"] as const).forEach((ev) => row.addEventListener(ev, touch, { passive: true }));
      cleanups.push(() => (["touchstart", "pointerdown", "wheel"] as const).forEach((ev) => row.removeEventListener(ev, touch)));
      timers.push(window.setInterval(() => {
        if (!row.isConnected || Date.now() < hold || document.hidden || row.scrollWidth <= row.clientWidth + 4) return;
        const r = row.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const rtl = getComputedStyle(row).direction === "rtl";
        const kids = ([...row.children] as HTMLElement[]).filter((k) => k.offsetWidth);
        let cur = 0, best = 1e9;
        kids.forEach((k, i) => { const cr = k.getBoundingClientRect(), d = Math.abs(rtl ? cr.right - r.right : cr.left - r.left); if (d < best) { best = d; cur = i; } });
        const end = Math.abs(row.scrollLeft) + row.clientWidth >= row.scrollWidth - 6, nx = kids[cur + 1];
        if (!nx || end) return glide(row, -row.scrollLeft);
        kids.forEach((k) => k.classList.toggle("in-view", k === nx));
        const nr = nx.getBoundingClientRect();
        glide(row, rtl ? nr.right - r.right : nr.left - r.left);
      }, 3200));
    }
    return () => { timers.forEach(clearInterval); cleanups.forEach((f) => f()); };
  }, [pathname]);

  return null;
}

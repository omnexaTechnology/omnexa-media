"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Ms from "@/components/ui/Ms";
import { optimized } from "@/lib/imageUrl";

/* Behaviour of the server-rendered project page (ports of app.js: lightbox, jgFit, flowGo/flowRun,
   appSync/shotGo, ruGo/ruInit/rkFit/rkSound). One delegated click handler on #project, like the reference. */
export type Post = { t: "img" | "vid"; src: string; poster?: string };

const reducedNow = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)];
const play = (v: HTMLVideoElement) => v.play().catch(() => {});

export default function ProjectControls({ posts }: { posts: Post[] }) {
  const t = useTranslations();
  const [lb, setLb] = useState<number | null>(null);
  const lbRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const n = posts.length;

  // `from` = the tile that opened it; Safari does not focus buttons on click, so activeElement would be <body>
  const openLb = useCallback((i: number, from?: HTMLElement) => {
    lastFocus.current = from ?? (document.activeElement as HTMLElement);
    setLb(i);
  }, []);
  const closeLb = useCallback(() => {
    setLb(null);
    lastFocus.current?.focus();
  }, []);
  const stepLb = useCallback((d: number) => setLb((i) => (i === null ? i : (i + d + n) % n)), [n]);

  /* lightbox: lock scroll, focus close, Esc / arrows (reading direction) / focus trap */
  useEffect(() => {
    if (lb === null) return;
    document.body.style.overflow = "hidden";
    lbRef.current?.querySelector<HTMLButtonElement>(".lb-close")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeLb();
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") stepLb((e.key === "ArrowRight") !== (document.documentElement.dir === "rtl") ? 1 : -1);
      if (e.key === "Tab" && lbRef.current) {
        // cycle focus ourselves: the browser's own Tab order may skip buttons (Safari's default) and leave the dialog
        e.preventDefault();
        const f = $$<HTMLElement>("button, video", lbRef.current), i = f.indexOf(document.activeElement as HTMLElement);
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [lb, closeLb, stepLb]);

  useEffect(() => {
    const page = document.getElementById("project");
    if (!page) return;
    const reduced = reducedNow();
    const rtlSign = document.documentElement.dir === "rtl" ? -1 : 1;
    const timers: number[] = [];
    let raf = 0, alive = true;

    /* justified gallery: each tile keeps its image's shape */
    for (const im of $$<HTMLImageElement>(".jg-i img", page)) {
      const fit = () => { if (im.naturalWidth) (im.parentNode as HTMLElement).style.setProperty("--a", (im.naturalWidth / im.naturalHeight).toFixed(3)); };
      if (im.complete) fit(); else im.addEventListener("load", fit, { once: true });
    }

    /* cover-flow: active screen in the middle, the others step back to both sides */
    const flow = { i: 0, hold: 0 };
    const flowGo = (k: number) => {
      const st = document.getElementById("flowStage");
      if (!st) return;
      const cs = $$(".p9-fc", st), m = cs.length, W = st.clientWidth;
      flow.i = (k + m) % m;
      cs.forEach((c, q) => {
        let o = q - flow.i;
        if (o > m / 2) o -= m;
        if (o < -m / 2) o += m;
        const a = Math.abs(o);
        c.style.transform = `translate(-50%, -50%) translateX(${(o * rtlSign * W * (W < 600 ? 0.3 : 0.24)).toFixed(0)}px) scale(${(1 - Math.min(a, 3) * 0.16).toFixed(2)})`;
        c.style.zIndex = String(10 - a);
        c.style.opacity = a > 2 ? "0" : "1";
        c.style.filter = a ? `brightness(${(1 - a * 0.28).toFixed(2)})` : "none";
        c.classList.toggle("on", !a);
        c.tabIndex = a > 2 ? -1 : 0;
      });
      $$(".p9-fl-dots button", page).forEach((b, q) => b.classList.toggle("on", q === flow.i));
      const bg = document.getElementById("flowBg") as HTMLImageElement | null;
      const cur = cs[flow.i]?.querySelector("img");
      if (bg && cur) bg.src = cur.currentSrc || cur.src; // the optimised variant the card already loaded
    };
    const flowStage = document.getElementById("flowStage");
    let x0: number | null = null;
    const fTouchStart = (e: TouchEvent) => { x0 = e.touches[0].clientX; flow.hold = Date.now() + 8000; };
    const fTouchEnd = (e: TouchEvent) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) flowGo(flow.i + (dx < 0 ? 1 : -1) * rtlSign);
    };
    const fEnter = () => (flow.hold = Date.now() + 1e9), fLeave = () => (flow.hold = 0);
    if (flowStage) {
      flowGo(0);
      flowStage.addEventListener("touchstart", fTouchStart, { passive: true });
      flowStage.addEventListener("touchend", fTouchEnd);
      flowStage.addEventListener("mouseenter", fEnter);
      flowStage.addEventListener("mouseleave", fLeave);
      if (!reduced) timers.push(window.setInterval(() => { if (Date.now() > flow.hold && !document.hidden) flowGo(flow.i + 1); }, 2600));
    }

    /* app screens: whichever card passes behind the phone is shown on its screen */
    const shot = { i: 0 };
    const shotGo = (k: number) => {
      const el = document.getElementById("shotImg") as HTMLImageElement | null;
      const imgs = posts.filter((p) => p.t === "img");
      if (!el || !imgs.length) return;
      shot.i = (k + imgs.length) % imgs.length;
      el.classList.remove("in"); void el.offsetWidth;
      el.src = optimized(imgs[shot.i].src, 828);
      el.classList.add("in");
    };
    const phone = page.querySelector(".p9-app .rk-phone");
    if (phone) {
      const tick = () => {
        if (!alive) return;
        const pr = phone.getBoundingClientRect(), mid = pr.left + pr.width / 2;
        let best: HTMLElement | null = null, bd = 1e9;
        if (pr.bottom > 0 && pr.top < innerHeight)
          for (const c of $$(".p9-app .rk-card", page)) { const r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = c; } }
        if (best && bd < 4) { const k = +best.dataset.shot!; if (k !== shot.i) shotGo(k); }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    /* videos: cards slide behind the phone; the phone plays the current one and moves on when it ends */
    const vids = posts.filter((p) => p.t === "vid");
    const ru = { c: 0 };
    const vid = document.getElementById("rkVid") as HTMLVideoElement | null;
    const playBtn = document.getElementById("rkPlay"), sndBtn = document.getElementById("rkSnd");
    const setPlayUi = (playing: boolean) => {
      if (!playBtn) return;
      playBtn.querySelector(".ms")!.textContent = playing ? "pause" : "play_arrow";
      playBtn.setAttribute("aria-label", t(playing ? "pd.pause" : "pd.play"));
    };
    const setSndUi = () => {
      if (!sndBtn || !vid) return;
      sndBtn.querySelector(".ms")!.textContent = vid.muted ? "volume_off" : "volume_up";
      sndBtn.setAttribute("aria-pressed", String(!vid.muted));
    };
    const fit = () => { const st = vid?.closest(".ru"); if (vid?.videoWidth && st) st.classList.toggle("wide", vid.videoWidth > vid.videoHeight); };
    const ruGo = (c: number) => {
      const st = document.getElementById("ru");
      if (!st || !vids.length) return;
      const cs = $$(".ru-c", st), m = cs.length;
      ru.c = m ? ((c % m) + m) % m : 0;
      const k = ru.c % vids.length, cw = cs[0] ? cs[0].offsetWidth + 24 : 0;
      cs.forEach((el, q) => {
        let o = q - ru.c;
        if (o > m / 2) o -= m;
        if (o < -m / 2) o += m;
        el.style.transform = `translate(-50%, -50%) translateX(${o * cw * rtlSign}px)`;
        el.style.opacity = !o || Math.abs(o) > 4 ? "0" : "1";
        el.classList.toggle("on", !o);
      });
      if (vid && +vid.dataset.k! !== k) {
        vid.dataset.k = String(k);
        vid.poster = vids[k].poster!;
        vid.src = vids[k].src;
        vid.load();
        play(vid);
        setPlayUi(true);
      }
    };
    const onEnded = () => ruGo(ru.c + 1);
    let unmuteOnce: ((e: PointerEvent) => void) | null = null;
    let stageIO: IntersectionObserver | null = null, autoPaused = false, userPaused = false;
    if (vid) {
      vid.addEventListener("ended", onEnded);
      vid.addEventListener("loadedmetadata", fit);
      fit();
      requestAnimationFrame(() => ruGo(0));
      setPlayUi(false);
      setSndUi();
      if (!reduced) {
        // nothing is downloaded (preload="none") until the phone is in view; it pauses when scrolled away
        let started = false;
        stageIO = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) { if (!vid.paused) { vid.pause(); autoPaused = true; setPlayUi(false); } return; }
          if (started) { if (autoPaused && !userPaused) { autoPaused = false; play(vid); setPlayUi(true); } return; }
          started = true;
          setPlayUi(true);
          // try with sound; browsers usually block that → play muted and unmute on the first tap/click
          vid.muted = false;
          vid.play().catch(() => {
            vid.muted = true;
            play(vid);
            setSndUi();
            unmuteOnce = (ev: PointerEvent) => { if ((ev.target as Element).closest("#rkSnd")) return; vid.muted = false; setSndUi(); };
            document.addEventListener("pointerdown", unmuteOnce, { once: true });
          });
          setSndUi();
        }, { threshold: 0.25 });
        stageIO.observe(vid);
      }
    }

    const onClick = (e: MouseEvent) => {
      const tg = e.target as HTMLElement;
      let el: HTMLElement | null;
      if ((el = tg.closest("[data-ru]"))) return ruGo(+el.dataset.ru!);
      if ((el = tg.closest("[data-fc]"))) {
        const k = +el.dataset.fc!;
        flow.hold = Date.now() + 8000;
        if (el.classList.contains("p9-fc") && k === flow.i) return openLb(k, el);
        return flowGo(k);
      }
      if ((el = tg.closest("[data-fl]"))) { flow.hold = Date.now() + 8000; return flowGo(flow.i + +el.dataset.fl!); }
      if ((el = tg.closest("[data-gal]"))) return openLb(+el.dataset.gal!, el);
      if ((el = tg.closest("[data-shot]"))) return shotGo(+el.dataset.shot!);
      if (tg.closest("#rkPlay") && vid) {
        if (vid.paused) { userPaused = false; play(vid); setPlayUi(true); } else { userPaused = true; vid.pause(); setPlayUi(false); }
        return;
      }
      if (tg.closest("#rkSnd") && vid) { vid.muted = !vid.muted; setSndUi(); }
    };
    const onResize = () => { flowGo(flow.i); ruGo(ru.c); };
    page.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      stageIO?.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach(clearInterval);
      page.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      if (unmuteOnce) document.removeEventListener("pointerdown", unmuteOnce);
      if (flowStage) {
        flowStage.removeEventListener("touchstart", fTouchStart);
        flowStage.removeEventListener("touchend", fTouchEnd);
        flowStage.removeEventListener("mouseenter", fEnter);
        flowStage.removeEventListener("mouseleave", fLeave);
      }
      vid?.removeEventListener("ended", onEnded);
      vid?.removeEventListener("loadedmetadata", fit);
    };
  }, [posts, openLb, t]);

  const cur = lb === null ? null : posts[lb];
  return (
    <div
      className="lightbox"
      id="lightbox"
      hidden={lb === null}
      role="dialog"
      aria-modal="true"
      aria-label={t("pd.viewer")}
      ref={lbRef}
      onClick={(e) => { const el = e.target as HTMLElement; if (el === e.currentTarget || el.id === "lbMedia") closeLb(); }}
    >
      <button className="lb-close icon-btn" type="button" aria-label={t("lb.close")} onClick={closeLb}><Ms name="close" /></button>
      <button className="lb-nav lb-prev icon-btn" type="button" aria-label={t("lb.prev")} onClick={() => stepLb(-1)}><Ms name="arrow_back" className="flip" /></button>
      <div className="lb-media" id="lbMedia">
        {cur &&
          (cur.t === "img" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cur.src} alt={`${t("pd.post")} ${lb! + 1}`} />
          ) : (
            <video key={cur.src} controls autoPlay playsInline poster={cur.poster}><source src={cur.src} type="video/mp4" /></video>
          ))}
      </div>
      <p className="lb-count" dir="ltr">{lb === null ? "" : `${lb + 1} / ${n}`}</p>
      <button className="lb-nav lb-next icon-btn" type="button" aria-label={t("lb.next")} onClick={() => stepLb(1)}><Ms name="arrow_forward" className="flip" /></button>
    </div>
  );
}

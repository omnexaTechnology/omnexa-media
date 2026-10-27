"use client";

import { useEffect, useRef } from "react";

/* Hero background: interactive dot grid — port of ../omnexa-final-run/js/dots.js
   (itself a plain-canvas rewrite of React Bits "Dot Grid"). Same constants; adds cleanup on unmount. */
const GAP = 34, R = 2.1, PROX = 150, SPEED_TRIGGER = 90, SHOCK_R = 240, SHOCK_F = 5;
type Dot = { x: number; y: number; dx: number; dy: number; vx: number; vy: number };

export default function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current, hero = cv?.parentElement, ctx = cv?.getContext("2d");
    if (!cv || !hero || !ctx) return;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [], W = 0, H = 0, vis = true, raf = 0, rt = 0;
    const ptr = { x: -9999, y: -9999, t: 0, lx: 0, ly: 0 };

    const colors = () =>
      root.getAttribute("data-theme") === "dark"
        ? { base: [205, 180, 255, 0.16], act: [169, 123, 240, 1] }
        : { base: [87, 0, 174, 0.14], act: [123, 44, 240, 1] };

    function draw() {
      const { base: b, act: a } = colors();
      ctx!.clearRect(0, 0, W, H);
      for (const d of dots) {
        const dist = Math.hypot(d.x - ptr.x, d.y - ptr.y);
        let f = dist < PROX ? 1 - dist / PROX : 0;
        f = f * f;
        const c = (i: number) => Math.round(b[i] + (a[i] - b[i]) * f);
        ctx!.fillStyle = `rgba(${c(0)},${c(1)},${c(2)},${(b[3] + (a[3] - b[3]) * f).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(d.x + d.dx, d.y + d.dy, R + f * 1.4, 0, 6.2832);
        ctx!.fill();
      }
    }
    function build() {
      const r = hero!.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv!.width = Math.round(W * dpr); cv!.height = Math.round(H * dpr);
      cv!.style.width = W + "px"; cv!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.floor(W / GAP), rows = Math.floor(H / GAP), ox = (W - (cols - 1) * GAP) / 2, oy = (H - (rows - 1) * GAP) / 2;
      dots = [];
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) dots.push({ x: ox + i * GAP, y: oy + j * GAP, dx: 0, dy: 0, vx: 0, vy: 0 });
      draw();
    }
    function step() {
      raf = 0;
      let moving = false;
      for (const d of dots) {
        d.vx += -d.dx * 0.06; d.vy += -d.dy * 0.06; // spring home
        d.vx *= 0.86; d.vy *= 0.86; // damping
        d.dx += d.vx; d.dy += d.vy;
        if (Math.abs(d.dx) > 0.05 || Math.abs(d.dy) > 0.05 || Math.abs(d.vx) > 0.05) moving = true;
      }
      draw();
      if (moving && vis) raf = requestAnimationFrame(step);
    }
    const kick = () => { if (!raf && vis && !reduced) raf = requestAnimationFrame(step); };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now(), dt = Math.max(now - ptr.t, 1);
      const vx = ((x - ptr.lx) / dt) * 1000, vy = ((y - ptr.ly) / dt) * 1000, sp = Math.hypot(vx, vy);
      Object.assign(ptr, { x, y, lx: x, ly: y, t: now });
      if (reduced) return draw();
      if (sp > SPEED_TRIGGER && sp < 8000) {
        for (const d of dots) {
          const dist = Math.hypot(d.x - x, d.y - y);
          if (dist < 90) {
            const p = (1 - dist / 90) * Math.min(sp / 2500, 1);
            d.vx += (d.x - x) * p * 0.09 + vx * p * 0.004;
            d.vy += (d.y - y) * p * 0.09 + vy * p * 0.004;
          }
        }
      }
      kick();
      if (!raf) draw();
    };
    const onLeave = () => { ptr.x = ptr.y = -9999; kick(); if (!raf) draw(); };
    const onClick = (e: MouseEvent) => {
      if (reduced) return;
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      for (const d of dots) {
        const dist = Math.hypot(d.x - x, d.y - y);
        if (dist < SHOCK_R && dist > 0) {
          const p = 1 - dist / SHOCK_R;
          d.vx += ((d.x - x) / dist) * SHOCK_F * p * 3;
          d.vy += ((d.y - y) / dist) * SHOCK_F * p * 3;
        }
      }
      kick();
    };
    const rebuild = () => { clearTimeout(rt); rt = window.setTimeout(build, 150); };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("click", onClick);
    window.addEventListener("resize", rebuild);
    const ro = new ResizeObserver(rebuild);
    ro.observe(hero);
    const io = new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis) kick(); });
    io.observe(hero);
    const mo = new MutationObserver(draw);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    build();

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("click", onClick);
      window.removeEventListener("resize", rebuild);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      cancelAnimationFrame(raf); clearTimeout(rt);
    };
  }, []);

  return <canvas ref={ref} className="hc-dots" id="heroDots" aria-hidden="true" />;
}

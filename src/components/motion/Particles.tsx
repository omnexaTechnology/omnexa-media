"use client";

import { useEffect, useRef } from "react";

/* Floating brand-coloured particles behind the client stories — port of js/particles.js */
const COLS = ["87,0,174", "123,44,240", "169,123,240", "251,176,64"];
type P = { x: number; y: number; z: number; r: number; c: string; vx: number; vy: number; ph: number };

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current, sec = cv?.parentElement, ctx = cv?.getContext("2d");
    if (!cv || !sec || !ctx) return;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, vis = false, raf = 0, px = 0, py = 0, tx = 0, ty = 0, ps: P[] = [];

    const seed = () => {
      const n = Math.round(Math.min(160, (W * H) / 9000));
      ps = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 0.7, r: 0.8 + Math.random() * 2.2, c: COLS[i % COLS.length],
        vx: (Math.random() - 0.5) * 0.18, vy: -0.08 - Math.random() * 0.22, ph: Math.random() * 6.28,
      }));
    };
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = sec.clientWidth; H = sec.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const draw = (t: number) => {
      const dark = root.getAttribute("data-theme") === "dark";
      px += (tx - px) * 0.05; py += (ty - py) * 0.05;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        if (!reduced) {
          p.x += p.vx * p.z; p.y += p.vy * p.z;
          if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
        }
        const a = (dark ? 0.55 : 0.85) * p.z * (0.6 + 0.4 * Math.sin(t / 900 + p.ph));
        ctx.beginPath();
        ctx.arc(p.x + px * 30 * p.z, p.y + py * 30 * p.z, p.r * p.z * 1.3, 0, 6.2832);
        ctx.fillStyle = `rgba(${p.c},${a.toFixed(3)})`;
        ctx.fill();
      }
    };
    const loop = (t: number) => { raf = 0; draw(t); if (vis && !reduced) raf = requestAnimationFrame(loop); };
    const onResize = () => { size(); draw(performance.now()); };
    const onMove = (e: PointerEvent) => { const r = sec.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; };

    size(); draw(0);
    window.addEventListener("resize", onResize);
    sec.addEventListener("pointermove", onMove);
    const io = new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); });
    io.observe(sec);
    return () => { window.removeEventListener("resize", onResize); sec.removeEventListener("pointermove", onMove); io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={ref} className="pt-bg" id="ptBg" aria-hidden="true" />;
}

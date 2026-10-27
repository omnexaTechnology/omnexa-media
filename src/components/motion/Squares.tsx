"use client";

import { useEffect, useRef } from "react";

/* Moving square grid behind a section — port of js/squares.js (vanilla take on React Bits "Squares").
   The reference attached listeners per project render without removing them; this version cleans up. */
const DIRS = { diagonal: [1, 1], up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] } as const;
const S = 46, SPEED = 0.22;

export default function Squares({ dir = "diagonal" }: { dir?: keyof typeof DIRS }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current, sec = cv?.parentElement, ctx = cv?.getContext("2d");
    if (!cv || !sec || !ctx) return;
    const root = document.documentElement, d = DIRS[dir];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, ox = 0, oy = 0, hx = -1, hy = -1, vis = false, raf = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = sec.clientWidth; H = sec.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      const dark = root.getAttribute("data-theme") === "dark";
      ctx.clearRect(0, 0, W, H);
      const sx = ((ox % S) + S) % S, sy = ((oy % S) + S) % S;
      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? "rgba(255,255,255,.055)" : "rgba(87,0,174,.07)";
      for (let x = -sx; x < W + S; x += S)
        for (let y = -sy; y < H + S; y += S) {
          if (hx >= x && hx < x + S && hy >= y && hy < y + S) {
            ctx.fillStyle = dark ? "rgba(169,123,240,.14)" : "rgba(87,0,174,.08)";
            ctx.fillRect(x, y, S, S);
          }
          ctx.strokeRect(x + 0.5, y + 0.5, S, S);
        }
      // fade towards the edges so the content stays calm
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) / 1.6);
      const bg = getComputedStyle(sec).backgroundColor;
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, bg && bg !== "rgba(0, 0, 0, 0)" ? bg : dark ? "#000" : "#fff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };
    const loop = () => { raf = 0; ox += d[0] * SPEED; oy += d[1] * SPEED; draw(); if (vis && !reduced) raf = requestAnimationFrame(loop); };
    const onResize = () => { size(); draw(); };
    const onMove = (e: PointerEvent) => { const r = sec.getBoundingClientRect(); hx = e.clientX - r.left; hy = e.clientY - r.top; if (reduced) draw(); };
    const onLeave = () => { hx = hy = -1; if (reduced) draw(); };

    size(); draw();
    window.addEventListener("resize", onResize);
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis) { size(); if (!raf) raf = requestAnimationFrame(loop); } });
    io.observe(sec);
    const mo = new MutationObserver(draw);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      window.removeEventListener("resize", onResize);
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
      io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf);
    };
  }, [dir]);

  return <canvas ref={ref} className="sq-bg" data-squares={dir} aria-hidden="true" />;
}

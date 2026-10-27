"use client";

import { useEffect, useRef } from "react";
import type MatterNS from "matter-js";

/* Process pills fall into the purple frame and pile up — port of js/pills.js (Matter.js).
   Matter is imported only when the frame scrolls into view. Without it the pills wrap as a static row (.pf-flow). */
type PillBody = MatterNS.Body & { el: HTMLElement; w: number; h: number };

export default function ProcessPills({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let M: typeof MatterNS | null = null, engine: MatterNS.Engine | null = null, bodies: PillBody[] = [];
    let vis = false, started = false, raf = 0, timers: number[] = [], W = 0, rt = 0, dead = false;
    let lastX: number | null = null, lastY = window.scrollY;

    const pills = () => [...frame.querySelectorAll<HTMLElement>(".pf-pill")].filter((el) => getComputedStyle(el).display !== "none");
    const place = (b: PillBody) => { b.el.style.transform = `translate(${(b.position.x - b.w / 2).toFixed(1)}px,${(b.position.y - b.h / 2).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`; };
    const loop = () => { raf = 0; if (!engine || !M) return; M.Engine.update(engine, 1000 / 60); bodies.forEach(place); if (vis) raf = requestAnimationFrame(loop); };
    const clear = () => {
      timers.forEach(clearTimeout); timers = [];
      if (engine && M) { M.World.clear(engine.world, false); M.Engine.clear(engine); }
      engine = null; bodies = [];
    };
    const build = (animate: boolean) => {
      if (!M) return;
      const Mx = M;
      clear();
      W = frame.clientWidth;
      const H = frame.clientHeight, T = 200;
      const eng = (engine = Mx.Engine.create());
      eng.gravity.y = 1.15;
      const wall = { isStatic: true };
      Mx.Composite.add(eng.world, [
        Mx.Bodies.rectangle(W / 2, H + T / 2, W * 3, T, wall),
        Mx.Bodies.rectangle(-T / 2, 0, T, H * 12, wall),
        Mx.Bodies.rectangle(W + T / 2, 0, T, H * 12, wall),
      ]);
      const els = pills(), n = els.length;
      // mix the big step pills with the small tags so the pile reads well
      const order = els.map((_, k) => k).sort((a, b) => ((a * 7) % n) - ((b * 7) % n));
      els.forEach((el) => (el.style.visibility = "hidden"));
      order.forEach((k, i) => {
        const el = els[k];
        const drop = () => {
          if (engine !== eng) return;
          const w = el.offsetWidth, h = el.offsetHeight, x = w / 2 + 12 + Math.random() * Math.max(1, W - w - 24);
          const b = Mx.Bodies.rectangle(x, animate ? -h - 10 : -i * 70, w, h, {
            chamfer: { radius: h / 2 - 1 }, restitution: 0.3, friction: 0.6, frictionAir: 0.014, density: 0.0018, angle: (Math.random() - 0.5) * 0.9,
          }) as PillBody;
          Object.assign(b, { el, w, h });
          bodies.push(b);
          Mx.Composite.add(eng.world, b);
          place(b);
          el.style.visibility = "visible";
        };
        if (animate) timers.push(window.setTimeout(drop, i * 150));
        else drop();
      });
      if (!animate) {
        for (let s = 0; s < 900; s++) Mx.Engine.update(eng, 1000 / 60);
        bodies.forEach(place);
      }
      if (fine && animate) {
        const mouse = Mx.Mouse.create(frame);
        // keep page scrolling with the wheel over the frame
        const m = mouse as MatterNS.Mouse & { mousewheel: EventListener };
        ["mousewheel", "DOMMouseScroll", "wheel"].forEach((ev) => mouse.element.removeEventListener(ev, m.mousewheel));
        Mx.Composite.add(eng.world, Mx.MouseConstraint.create(eng, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } as MatterNS.IConstraintDefinition }));
        frame.classList.add("pf-grab");
      }
      if (animate && vis && !raf) raf = requestAnimationFrame(loop);
    };
    const start = async () => {
      if (started) return;
      started = true;
      try {
        M = (await import("matter-js")).default;
      } catch {
        frame.classList.add("pf-flow");
        return;
      }
      if (!dead) build(!reduced);
    };

    // while the visitor moves (mouse or scroll) the pile sways a little
    const nudge = (fx: number, fy: number) => {
      if (!M) return;
      for (const b of bodies) M.Body.applyForce(b, b.position, { x: fx * b.mass * (0.6 + Math.random() * 0.8), y: -fy * b.mass * (0.4 + Math.random()) });
    };
    const onPointer = (e: PointerEvent) => {
      if (!engine || !vis || reduced || e.pointerType !== "mouse") return;
      if (lastX == null) { lastX = e.clientX; return; }
      const f = Math.max(-1, Math.min(1, (e.clientX - lastX) / 40));
      lastX = e.clientX;
      if (f) nudge(f * 0.0007, Math.abs(f) * 0.0009);
    };
    const onScroll = () => {
      const y = window.scrollY, f = Math.max(-1, Math.min(1, (y - lastY) / 60));
      lastY = y;
      if (!engine || !vis || reduced || !f) return;
      nudge((Math.random() - 0.5) * Math.abs(f) * 0.0008, Math.abs(f) * 0.0013);
    };
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(() => { if (engine && Math.abs(frame.clientWidth - W) > 30) build(false); }, 200); };

    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
        if (vis && es[0].intersectionRatio >= 0.3) start();
        if (vis && engine && !reduced && !raf) raf = requestAnimationFrame(loop);
      },
      { threshold: [0, 0.3] },
    );
    io.observe(frame);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      dead = true;
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf); clearTimeout(rt); clear();
    };
  }, []);

  return (
    <div className="pf-frame" id="pfFrame" ref={ref}>
      {children}
    </div>
  );
}

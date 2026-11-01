"use client";

import { useEffect } from "react";

/* /ads behaviour: blocks marked [data-m-reveal] fade up once when they enter the viewport, and the hero's looping
   background animations pause while the hero is off-screen (no work for the GPU when nobody sees it).
   Content is visible without JS: the hidden start state only applies under html.gsap-on (set before paint). */
export default function Effects() {
  useEffect(() => {
    const root = document.querySelector(".m299");
    if (!root) return;
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    root.querySelectorAll("[data-m-reveal]").forEach((el) => io.observe(el));

    const hero = root.querySelector(".m-hero");
    const pause = new IntersectionObserver(([e]) => hero?.classList.toggle("m-paused", !e.isIntersecting));
    if (hero) pause.observe(hero);
    return () => { io.disconnect(); pause.disconnect(); };
  }, []);
  return null;
}

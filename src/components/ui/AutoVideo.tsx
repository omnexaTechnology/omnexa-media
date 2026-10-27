"use client";

import { useEffect, useRef } from "react";

/* Muted looping clip (hero reels, work cards). Rendered without a src, so nothing downloads up front:
   the source is attached and playback starts only when the clip comes near the viewport (also inside
   horizontally scrolling rows), and it pauses when it leaves. Reduced motion → poster only, like the reference. */
export default function AutoVideo({ src, ...props }: React.VideoHTMLAttributes<HTMLVideoElement> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return v.pause();
        if (v.getAttribute("src") !== src) v.src = src;
        v.play().catch(() => {});
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} muted loop playsInline preload="none" disablePictureInPicture {...props} />;
}

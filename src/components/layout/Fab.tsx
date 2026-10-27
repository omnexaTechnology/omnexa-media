"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WA_PATH, waHref } from "@/content/site";
import { Svg } from "@/components/ui/PlatIcon";
import Ms from "@/components/ui/Ms";

/* floating WhatsApp + scroll-progress button (app.js fabUpdate) */
export default function Fab() {
  const t = useTranslations();
  const [pct, setPct] = useState(0);
  const [down, setDown] = useState(true);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
      setDown(window.scrollY < 300);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const go = () => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: down ? window.innerHeight * 0.9 : 0, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className="fab">
      <a className="fab-wa" href={waHref()} target="_blank" rel="noopener" aria-label={t("foot.wa")}>
        <Svg d={WA_PATH} />
      </a>
      <button className={`fab-top${down ? " down" : ""}`} type="button" aria-label={t("ui.top")} style={{ "--p": pct } as React.CSSProperties} onClick={go}>
        <span className="ring"><Ms name="keyboard_double_arrow_up" /></span>
        <b>{pct}%</b>
      </button>
    </div>
  );
}

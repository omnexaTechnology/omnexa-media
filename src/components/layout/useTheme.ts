"use client";

import { useCallback, useSyncExternalStore } from "react";

/* the theme lives on <html data-theme> (set before paint by the layout script) — read it, don't duplicate it */
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";

export function useTheme(): [boolean, () => void] {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  const toggle = useCallback(() => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("om-theme", next);
    } catch {}
  }, []);
  return [dark, toggle];
}

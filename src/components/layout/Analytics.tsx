"use client";
import { useEffect } from "react";
import { SITE_URL } from "@/lib/siteUrl";

/* Google tag (GA4), loaded once after hydration and only when NEXT_PUBLIC_GA_ID is set at build time and the page is
   served from the production host (local dev, `next start` test runs and previews send nothing).
   SPA page views come from GA4 enhanced measurement (browser history changes).
   Conversion events carry no personal data: only the event name, the page path and, where known, the service id. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

export function track(event: string, params: Record<string, string | undefined> = {}) {
  window.gtag?.("event", event, { page_path: location.pathname, ...params });
}

/* contact links anywhere on the page (header, FAB, footer, contact section, end CTA) */
function onClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.("a[href]");
  if (!a) return;
  const href = a.getAttribute("href")!;
  const service = a.getAttribute("data-service") ?? undefined;
  if (href.startsWith("https://wa.me/")) track("whatsapp_click", { service });
  else if (href.startsWith("tel:")) track("phone_click");
  else if (href.startsWith("mailto:")) track("email_click");
  else if (href === "#contact" && service) track("service_cta_click", { service });
}

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID || location.hostname !== new URL(SITE_URL).hostname || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    // gtag.js reads the `arguments` objects pushed by this exact function shape
    window.gtag = function () { window.dataLayer!.push(arguments); }; // eslint-disable-line prefer-rest-params
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

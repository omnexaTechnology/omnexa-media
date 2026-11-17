"use client";
import { useEffect } from "react";
import { SITE_URL } from "@/lib/siteUrl";
import { GTM_ID } from "@/lib/gtm";

/* Google Tag Manager, loaded once after hydration and only when the page is served from the production host
   (local dev, `next start` test runs and previews send nothing).
   The container holds the GA4 Google tag (page views, including SPA navigations through enhanced measurement); the
   conversion events below reach GA4 once the container has a GA4 event tag for them.
   Conversion events carry no personal data: only the event name, the page path and, where known, the service id. */

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export function track(event: string, params: Record<string, string | undefined> = {}) {
  // service is reset on every push so a value from an earlier event never carries over in GTM's data layer model
  window.dataLayer?.push({ event, page_path: location.pathname, service: undefined, ...params });
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
    if (location.hostname !== new URL(SITE_URL).hostname || window.dataLayer) return;
    window.dataLayer = [{ "gtm.start": Date.now(), event: "gtm.js" }];
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(s);
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

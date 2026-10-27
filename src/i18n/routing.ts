import { defineRouting } from "next-intl/routing";

// Arabic first, like the reference (it defaulted to ar/rtl).
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  // "/" always opens Arabic, like the reference; language is chosen explicitly via the switcher (URL is the source of truth)
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
export const dirOf = (l: AppLocale) => (l === "ar" ? "rtl" : "ltr");

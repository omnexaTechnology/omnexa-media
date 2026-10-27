import type { routing } from "@/i18n/routing";
import type messages from "@/messages/en.json";

// Typed message keys: a key missing from en.json fails type-checking.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

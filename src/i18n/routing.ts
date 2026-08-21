import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi"],
  defaultLocale: "en",
  // English is the default, but every page still carries its locale in the URL.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  hi: { short: "हिं", full: "हिन्दी" },
};

/**
 * One place for everything that is true of the site regardless of language.
 * The favicon block is the single global setting for the tab icon — change it
 * here and every generated icon (browser tab, Apple touch icon) follows.
 */
export const site = {
  name: "VISH",

  /** Which opening the landing page uses: one still, or the four-chapter carousel. */
  hero: "carousel" as "still" | "carousel",

  email: "letters@aetheris.in",
  city: "Jaipur",
  url: "https://aetheris.in",

  favicon: {
    /** Drawn into the icon. Keep it to one or two Latin letters. */
    glyph: "V",
    background: "#1F252E",
    foreground: "#C5A46E",
    /** 0 = square, 0.5 = circle. */
    radius: 0.28,
    /** Glyph size as a share of the canvas. */
    scale: 0.62,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: 500,
  },
} as const;

export type SiteConfig = typeof site;

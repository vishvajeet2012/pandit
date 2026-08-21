import type { PlateVariant } from "@/components/plates/Plate";

/**
 * The photograph behind each plate. Everything here lives in
 * public/photography/ and is credited in public/photography/CREDITS.md.
 * Remove an entry and that plate falls back to its tonal SVG stand-in.
 */
export const PHOTOGRAPHY: Partial<
  Record<PlateVariant, { src: string; position?: string }>
> = {
  portrait: { src: "/photography/hero-yantra.jpg", position: "52% 50%" },
  "portrait-close": { src: "/photography/study-astrolabe.jpg", position: "50% 46%" },
  sanctum: { src: "/photography/sanctum-jali.jpg", position: "50% 58%" },
  manuscript: { src: "/photography/manuscript-paper.jpg", position: "50% 34%" },
  tea: { src: "/photography/sitting-tea.jpg", position: "50% 46%" },
  hand: { src: "/photography/sri-yantra-copper.jpg", position: "50% 50%" },
  chair: { src: "/photography/sitting-chair.jpg", position: "50% 40%" },
  page: { src: "/photography/manuscript-palm.jpg", position: "50% 50%" },
  "palm-leaf": { src: "/photography/journal-jantar.jpg", position: "50% 50%" },
  diya: { src: "/photography/journal-doors.jpg", position: "50% 50%" },
  corridor: { src: "/photography/journal-corridor.jpg", position: "50% 46%" },
};

/**
 * One grade for every photograph on the site, so red sandstone, brass and
 * palm leaf all sit in the same ivory-and-gold room.
 */
export const PLATE_GRADE = "sepia(0.42) saturate(0.7) contrast(1.04) brightness(1.04)";

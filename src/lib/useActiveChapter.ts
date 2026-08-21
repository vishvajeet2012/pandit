"use client";

import { useEffect, useState } from "react";

/** Tracks which <section id> currently owns the viewport middle. */
export function useActiveChapter() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sections.length) return;

    const pick = () => {
      const line = window.innerHeight * 0.38;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return active;
}

/** Chapter ids, in the order they are met on the way down. */
export const CHAPTER_IDS = [
  "hero",
  "press",
  "about",
  "offerings",
  "panchang",
  "ritual",
  "reading",
  "houses",
  "sanctum",
  "parampara",
  "forwhom",
  "sitting",
  "voices",
  "journal",
  "faq",
  "close",
] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];

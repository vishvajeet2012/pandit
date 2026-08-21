"use client";

import { useTranslations } from "next-intl";
import { CHAPTER_IDS, useActiveChapter } from "@/lib/useActiveChapter";

/** 1px vertical chapter rail on the right edge, gold head at the current act. */
export default function ChapterTicks() {
  const t = useTranslations("chapters");
  const active = useActiveChapter();

  return (
    <div
      aria-hidden
      className="fixed right-6 top-1/2 z-[88] hidden -translate-y-1/2 flex-col items-end gap-[10px] xl:flex"
    >
      <div className="absolute right-[3px] top-0 h-full w-px bg-rule" />
      {CHAPTER_IDS.map((id) => {
        const on = active === id;
        return (
          <div key={id} className="relative flex items-center gap-3">
            <span
              className={`smallcaps hidden whitespace-nowrap transition-opacity duration-500 2xl:block ${
                on ? "opacity-100 text-muted" : "opacity-0"
              }`}
            >
              {t(id)}
            </span>
            <span
              className={`block rounded-full transition-all duration-700 ${
                on ? "h-[7px] w-[7px] bg-gold" : "h-px w-[7px] bg-rule"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

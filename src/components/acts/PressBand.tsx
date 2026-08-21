"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";

function Run({ items, ariaHidden }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((o, i) => (
        <span key={o + i} className="flex items-center">
          <span className="smallcaps whitespace-nowrap px-7 text-muted">{o}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-gold" />
        </span>
      ))}
    </div>
  );
}

export default function PressBand() {
  const t = useTranslations("press");
  const track = useRef<HTMLDivElement>(null);
  const items = [t("featured"), ...(t.raw("outlets") as string[])];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(track.current, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
    }, track);
    return () => ctx.revert();
  }, []);

  return (
    <section id="press" className="relative">
      <div className="hairline" />
      <div className="flex h-14 items-center overflow-hidden">
        <div ref={track} className="flex" style={{ willChange: "transform" }}>
          <Run items={items} />
          <Run items={items} ariaHidden />
        </div>
      </div>
      <div className="hairline" />
    </section>
  );
}

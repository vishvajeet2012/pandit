"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export type PanchangItem = { label: string; value: string; deva: string };

export default function PanchangGrid({ items }: { items: PanchangItem[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".panchang-col",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: "top 82%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="mt-20 grid grid-cols-2 border-t border-rule md:grid-cols-3 lg:grid-cols-5"
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="panchang-col border-b border-rule px-0 py-10 lg:border-b-0 lg:border-l lg:first:border-l-0 lg:px-8 lg:first:pl-0"
        >
          <p className="smallcaps text-muted">{it.label}</p>
          <p className="display mt-5 text-[clamp(19px,1.8vw,26px)] leading-tight">{it.value}</p>
          <p className="deva mt-4">{it.deva}</p>
        </div>
      ))}
    </div>
  );
}

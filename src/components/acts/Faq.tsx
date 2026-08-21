"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import Rise from "@/components/site/Rise";

type Item = { q: string; a: string };

export default function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Item[];
  const [open, setOpen] = useState<number | null>(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-row",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={root} className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>
      <Rise as="h2" className="display text-[clamp(32px,4.8vw,64px)]">
        {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span> {t("titleTail")}
      </Rise>

      <div className="mt-20 max-w-[860px] border-t border-rule">
        {items.map((item, i) => {
          const on = open === i;
          return (
            <div
              key={item.q}
              className="faq-row group border-b border-rule transition-colors duration-500"
            >
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="flex w-full items-baseline gap-8 py-8 text-left"
              >
                <span
                  className={`smallcaps shrink-0 transition-colors duration-500 ${
                    on ? "text-gold" : "text-muted group-hover:text-gold"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`display flex-1 text-[clamp(19px,1.8vw,25px)] leading-[1.25] transition-colors duration-500 ${
                    on ? "text-ink" : "text-ink/80 group-hover:text-ink"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="relative mt-2 block h-4 w-4 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-ink" />
                  <span
                    className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ transform: on ? "rotate(0deg)" : "rotate(90deg)" }}
                  />
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <p className="body-muted max-w-[62ch] pb-9 pl-[calc(2rem+2ch)] text-[16px]">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

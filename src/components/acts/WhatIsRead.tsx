"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import Rise from "@/components/site/Rise";

type Item = { term: string; deva: string; body: string };

export default function WhatIsRead() {
  const t = useTranslations("reading");
  const locale = useLocale();
  const index = new Intl.NumberFormat(locale === "hi" ? "hi-IN-u-nu-deva" : "en-US", {
    minimumIntegerDigits: 2,
  });
  const items = t.raw("items") as Item[];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".read-row",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="reading" ref={root} className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display max-w-[18ch] text-[clamp(32px,4.2vw,58px)] leading-[0.96]">
          <Rise>{t("titleLead")}</Rise>
          <Rise delay={0.06}>
            <span className="italic-gold">{t("titleAccent")}</span> {t("titleTail")}
          </Rise>
        </h2>
        <p className="body-muted max-w-[42ch] text-[15px]">{t("note")}</p>
      </div>

      <div className="mt-24 border-t border-rule">
        {items.map((it, i) => (
          <div
            key={it.term}
            className="read-row grid grid-cols-12 items-baseline gap-6 border-b border-rule py-9"
          >
            <span className="smallcaps col-span-2 text-gold md:col-span-1">
              {index.format(i + 1)}
            </span>
            <h3 className="display col-span-10 text-[clamp(22px,2.1vw,30px)] leading-none md:col-span-3">
              {it.term}
            </h3>
            <p className="body-muted col-span-12 max-w-[52ch] text-[16px] md:col-span-6">
              {it.body}
            </p>
            <span className="deva col-span-12 md:col-span-2 md:text-right">{it.deva}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "@/lib/gsap";
import Plate, { type PlateVariant } from "@/components/plates/Plate";
import Rise from "@/components/site/Rise";

const VARIANTS: PlateVariant[] = ["tea", "hand", "chair", "page"];

type Beat = { time: string; caption: string; alt: string };

export default function ASitting() {
  const t = useTranslations("sitting");
  const beats = t.raw("beats") as Beat[];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".beat",
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 68%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="sitting" ref={root} className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>
      <Rise as="h2" className="display text-[clamp(32px,4.8vw,64px)]">
        {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span>
      </Rise>

      <div className="mt-20 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {beats.map((b, i) => (
          <figure key={b.time} className="beat">
            <Plate variant={VARIANTS[i]} alt={b.alt} className="aspect-[16/10] w-full" />
            <figcaption className="mt-5 flex items-baseline gap-3">
              <span className="smallcaps text-gold">{b.time}</span>
              <span className="smallcaps text-muted">{b.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p className="body-muted max-w-[62ch] text-[15px]">{t("note")}</p>
        <Link href="/book" className="gold-link shrink-0">
          {t("link")}
        </Link>
      </div>
    </section>
  );
}

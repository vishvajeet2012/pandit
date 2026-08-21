"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "@/lib/gsap";
import KundliChart from "@/components/site/KundliChart";
import RashiGlyph, { RASHIS } from "@/components/site/RashiGlyph";
import Rise from "@/components/site/Rise";

type Sign = { name: string; sub: string };

export default function Houses() {
  const t = useTranslations("houses");
  const signs = t.raw("signs") as Sign[];
  const locale = useLocale();
  const houseNumbers = Array.from({ length: 12 }, (_, i) =>
    new Intl.NumberFormat(locale === "hi" ? "hi-IN-u-nu-deva" : "en-US").format(i + 1)
  );
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rashi",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: root.current, start: "top 66%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="houses" ref={root} className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display max-w-[14ch] text-[clamp(32px,4.2vw,58px)] leading-[0.96]">
          <Rise>{t("titleLead")}</Rise>
          <Rise delay={0.06}>
            <span className="italic-gold">{t("titleAccent")}</span> {t("titleTail")}
          </Rise>
        </h2>
        <p className="body-muted max-w-[42ch] text-[15px]">{t("note")}</p>
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-[6%]">
        {/* the chart itself, drawn as you descend */}
        <div className="lg:col-span-5">
          <KundliChart className="w-full max-w-[440px]" lagna={1} labels={houseNumbers} />
          <p className="smallcaps mt-8 text-muted">{t("chartCaption")}</p>
          <div className="mt-8">
            <Link href="/kundli" className="gold-link">
              {t("cta")}
            </Link>
          </div>
        </div>

        {/* the twelve rashis */}
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="smallcaps mb-10 text-gold">{t("signsTitle")}</p>
          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3">
            {signs.map((s, i) => (
              <div key={s.name} className="rashi flex items-start gap-5">
                <RashiGlyph
                  sign={RASHIS[i]}
                  className="mt-[3px] h-9 w-9 shrink-0 text-gold"
                  strokeWidth={2.2}
                />
                <span>
                  <span className="display block text-[clamp(20px,1.6vw,24px)] leading-tight">
                    {s.name}
                  </span>
                  <span className="deva mt-1 block text-[14px]">{s.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

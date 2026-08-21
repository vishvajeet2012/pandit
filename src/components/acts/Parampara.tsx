                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import Plate from "@/components/plates/Plate";
import Rise from "@/components/site/Rise";

type Year = { y: string; t: string };

export default function Parampara() {
  const t = useTranslations("parampara");
  const years = t.raw("years") as Year[];
  const root = useRef<HTMLElement>(null);
  const rule = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rule.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: 0.5 },
        }
      );
      gsap.fromTo(
        ".lineage-entry",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.14,
          scrollTrigger: { trigger: root.current, start: "top 62%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="parampara" ref={root} className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>
      <Rise as="h2" className="display text-[clamp(32px,4.8vw,64px)]">
        {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span>
      </Rise>

      <div className="mt-24 grid gap-14 lg:grid-cols-12">
        {/* the rule and its nodes */}
        <div className="relative lg:col-span-8">
          <div className="absolute left-0 top-2 h-full w-px bg-rule" />
          <div
            ref={rule}
            className="absolute left-0 top-2 h-full w-px origin-top bg-gold"
            style={{ opacity: 0.55 }}
          />

          <div className="space-y-20 pl-12 md:pl-20">
            {years.map((e, i) => (
              <div key={e.y} className="lineage-entry relative">
                <span
                  className={`absolute -left-12 top-6 block h-2 w-2 -translate-x-1/2 rounded-full md:-left-20 ${
                    i === 1 ? "bg-gold" : "border border-gold bg-canvas"
                  }`}
                  style={{ marginLeft: "0.5px" }}
                />
                <p className="display italic-gold text-[clamp(30px,3.4vw,48px)] leading-none">
                  {e.y}
                </p>
                <p className="body-muted mt-5 max-w-[46ch]">{e.t}</p>
              </div>
            ))}
          </div>

          <p className="body-muted mt-16 max-w-[52ch] pl-12 text-[15px] md:pl-20">{t("closing")}</p>
        </div>

        {/* the manuscript, treated as an object on the desk */}
        <div className="lg:col-span-3 lg:col-start-10">
          <div className="warm-lift rotate-[0.6deg]">
            <Plate variant="manuscript" alt={t("imageAlt")} className="aspect-[3/5] w-full" />
          </div>
          <p className="deva mt-6">{t("deva")}</p>
        </div>
      </div>
    </section>
  );
}

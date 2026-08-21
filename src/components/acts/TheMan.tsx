"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import Plate from "@/components/plates/Plate";
import Rise from "@/components/site/Rise";

export default function TheMan() {
  const t = useTranslations("man");
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        image.current,
        { yPercent: -1.4 },
        {
          yPercent: 1.4,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        ".man-fade",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="act act-y">
      <p className="eyebrow mb-16">{t("eyebrow")}</p>

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-[8%]">
        <div className="lg:col-span-5">
          <div className="sticky top-[120px]">
            <div ref={image} className="warm-lift">
              <Plate variant="portrait-close" alt={t("imageAlt")} className="aspect-[3/4.3] w-full" />
            </div>
            <p className="deva mt-6">{t("deva")}</p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-[6vh]">
          <Rise as="h2" className="display text-[clamp(34px,4.4vw,58px)]">
            {t("nameLead")} <span className="italic-gold">{t("nameAccent")}</span>
          </Rise>

          <div className="mt-12 max-w-[54ch] space-y-8">
            <p className="man-fade body-muted">{t("p1")}</p>
            <p className="man-fade body-muted">{t("p2")}</p>
            <p className="man-fade body-muted">{t("p3")}</p>
            <p className="man-fade body-muted">{t("p4")}</p>
          </div>

          <div className="man-fade mt-14">
            <a href="#parampara" className="gold-link">
              {t("link")}
            </a>
          </div>

          {/* dry-brush ink signature */}
          <svg
            className="man-fade mt-16"
            width="140"
            height="52"
            viewBox="0 0 280 104"
            fill="none"
            aria-label={t("signatureAlt")}
          >
            <path
              d="M10 78 C 44 22 62 8 70 20 C 78 32 58 62 62 72 C 68 86 96 52 112 28 C 122 12 134 14 130 30 C 124 54 110 74 118 82 C 128 92 156 56 172 30 C 182 14 196 18 190 34 C 182 56 168 76 178 84 C 190 94 216 62 238 26"
              stroke="#8a6a3c"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M118 92 C 158 86 204 74 246 56"
              stroke="#c5a46e"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

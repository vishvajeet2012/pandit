"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import Plate from "@/components/plates/Plate";
import SriYantra from "@/components/site/SriYantra";
import MagneticButton from "@/components/site/MagneticButton";

export default function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line > span",
        { yPercent: 112 },
        { yPercent: 0, duration: 1.5, ease: "power3.out", stagger: 0.09, delay: 0.15 }
      );
      gsap.fromTo(
        ".hero-fade",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.12, delay: 0.9 }
      );
      gsap.to(portrait.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden pt-[76px]"
    >
      {/* full-bleed portrait, right edge */}
      <div ref={portrait} className="absolute inset-y-[-6%] right-0 h-[112%] w-[62%] md:w-[56%]">
        <Plate variant="portrait" alt={t("portraitAlt")} className="h-full w-full" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas via-canvas/25 to-transparent" />
      </div>

      {/* the yantra, mid-draw, behind him */}
      <SriYantra
        progress={0.55}
        opacity={0.34}
        className="pointer-events-none absolute right-[4%] top-1/2 hidden h-[78vh] w-[78vh] -translate-y-1/2 md:block"
      />

      <div className="act relative z-10 w-full pb-24 pt-16 md:w-[56%] md:pb-32">
        <p className="hero-fade eyebrow mb-10">{t("eyebrow")}</p>

        <h1 className="display text-[clamp(52px,9vw,160px)] leading-[0.88]">
          <span className="hero-line reveal-line">
            <span>{t("line1")}</span>
          </span>
          <span className="hero-line reveal-line">
            <span className="italic-gold">{t("line2")}</span>
          </span>
          <span className="hero-line reveal-line">
            <span>{t("line3")}</span>
          </span>
          <span className="hero-line reveal-line">
            <span>{t("line4")}</span>
          </span>
        </h1>

        <p className="hero-fade body-muted mt-10 max-w-[32ch]">{t("sub")}</p>

        <div className="hero-fade mt-12 flex flex-wrap items-center gap-x-7 gap-y-6">
          <MagneticButton
            href="/book"
            localized
            className="flex h-[54px] items-center rounded-full bg-gold px-9 text-[13px] font-medium tracking-[0.08em] text-ink"
          >
            {t("cta")}
          </MagneticButton>

          <a href="#sitting" className="flex items-center gap-3 text-[13px] tracking-[0.04em] text-ink">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="#c5a46e" aria-hidden>
              <path d="M0 0l10 6-10 6z" />
            </svg>
            <span className="border-b border-rule pb-[3px] transition-colors duration-500 hover:border-gold">
              {t("film")}
            </span>
          </a>
        </div>

        <p className="hero-fade deva mt-16">{t("deva")}</p>
      </div>
    </section>
  );
}

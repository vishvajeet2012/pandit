"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard, Parallax } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/effect-fade";

import { gsap } from "@/lib/gsap";
import SriYantra from "@/components/site/SriYantra";
import MagneticButton from "@/components/site/MagneticButton";

type Slide = {
  eyebrow: string;
  line1: string;
  accent: string;
  line2: string;
  sub: string;
  alt: string;
};

const HERO_IMAGES = [
  "/hero/satyanarayan-puja.jpg",
  "/hero/vedic-astrology.jpg",
  "/hero/vedic-sanctum.jpg",
  "/hero/vedic-lineage.jpg",
];

const DELAY = 6500;

export default function HeroCarousel() {
  const t = useTranslations("hero2");
  const slides = t.raw("slides") as Slide[];

  const root = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);

  // GSAP animation for text reveal on slide change
  const revealText = () => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero2-line > span",
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.08, overwrite: true }
      );
      gsap.fromTo(
        ".hero2-fade",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.2,
          overwrite: true,
        }
      );
    }, root);
    return () => ctx.revert();
  };

  useEffect(() => {
    if (document.documentElement.dataset.entering) {
      const run = () => revealText();
      window.addEventListener("aetheris:entered", run, { once: true });
      return () => window.removeEventListener("aetheris:entered", run);
    }
    const cleanup = revealText();
    return cleanup;
  }, []);

  const slide = slides[index] || slides[0];

  return (
    <section id="hero" ref={root} className="relative min-h-[calc(100vh-76px)] overflow-hidden mt-[76px]">
      {/* Background Photography Slider */}
      <div className="absolute inset-0 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Keyboard, Parallax]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          loop
          keyboard={{ enabled: true }}
          autoplay={{ delay: DELAY, disableOnInteraction: false }}
          onSwiper={(s) => {
            swiperRef.current = s;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) s.autoplay?.stop();
          }}
          onSlideChange={(s) => setIndex(s.realIndex)}
          onSlideChangeTransitionStart={revealText}
          onAutoplayTimeLeft={(_s, _time, percent) => {
            if (progress.current) progress.current.style.transform = `scaleX(${1 - percent})`;
          }}
          className="h-full w-full"
        >
          {slides.map((s, i) => {
            const isActive = i === index;
            const imgSrc = HERO_IMAGES[i] || HERO_IMAGES[0];
            return (
              <SwiperSlide key={s.line1 + i} className="relative h-full w-full">
                {/* Photo with slow ambient zoom */}
                <div
                  className={`absolute inset-0 h-full w-full transition-transform duration-[7000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                >
                  <Image
                    src={imgSrc}
                    alt={s.alt}
                    fill
                    priority={i === 0}
                    quality={90}
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>

                {/* 30% Solid White Overlay on Left for crisp text, 100% full vibrant image on right */}
                <div
                  className="pointer-events-none absolute inset-0 hidden md:block"
                  style={{
                    background:
                      "linear-gradient(to right, #ffffff 28%, rgba(255, 255, 255, 0.85) 42%, rgba(255, 255, 255, 0.3) 55%, transparent 70%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 md:hidden"
                  style={{
                    background:
                      "linear-gradient(to top, #ffffff 35%, rgba(255, 255, 255, 0.8) 60%, transparent 85%)",
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Sacred Geometry Sri Yantra Watermark */}
      <SriYantra
        progress={0.6}
        opacity={0.16}
        className="pointer-events-none absolute right-[3%] top-1/2 hidden h-[80vh] w-[80vh] -translate-y-1/2 md:block"
      />

      {/* Main Content / Typographic Layer */}
      <div className="act pointer-events-none relative z-10 flex min-h-[calc(100vh-76px)] w-full flex-col justify-center pb-36 pt-16 md:w-[62%] lg:w-[54%]">
        {/* Category Pill Tag */}
        <div className="hero2-fade mb-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <p className="eyebrow !text-gold-light tracking-[0.14em] uppercase">
            {slide.eyebrow.replace(/^[0-9०-९\s—–-]+/, "").trim()}
          </p>
        </div>

        {/* Hero Title */}
        <h1 className="display text-[clamp(38px,6vw,96px)] leading-[0.94] tracking-tight">
          <span className="hero2-line reveal-line block">
            <span>{slide.line1}</span>
          </span>
          <span className="hero2-line reveal-line block">
            <span className="italic-gold">{slide.accent}</span>
          </span>
          <span className="hero2-line reveal-line block">
            <span>{slide.line2}</span>
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="hero2-fade body-muted mt-8 max-w-[42ch] text-[16px] md:text-[18px] leading-relaxed text-ink/80">
          {slide.sub}
        </p>

        {/* CTA Actions */}
        <div className="hero2-fade pointer-events-auto mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
          <MagneticButton
            href="/book"
            localized
            className="flex h-[56px] items-center rounded-full bg-gold px-10 text-[14px] font-semibold tracking-[0.06em] text-ink shadow-[0_8px_30px_rgba(197,164,110,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(197,164,110,0.45)] hover:scale-[1.02]"
          >
            {t("cta")}
          </MagneticButton>

          <a
            href="#sitting"
            className="group flex items-center gap-3 rounded-full border border-rule/70 bg-surface/60 backdrop-blur-md px-6 py-3.5 text-[13px] font-medium tracking-[0.04em] text-ink transition-all duration-300 hover:border-gold hover:bg-surface/90"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold group-hover:bg-gold group-hover:text-ink transition-colors">
              <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" aria-hidden>
                <path d="M0 0l10 6-10 6z" />
              </svg>
            </span>
            <span>{t("film")}</span>
          </a>
        </div>
      </div>

      {/* Bottom Bar: Interactive Dots & Controls */}
      <div className="act absolute inset-x-0 bottom-7 z-20 flex items-center justify-between gap-6">
        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 transition-all duration-500 rounded-full ${
                i === index ? "w-8 bg-gold" : "w-2 bg-rule/70 hover:bg-gold/50"
              }`}
            />
          ))}
        </div>


        {/* Next / Prev Navigation Buttons */}
        <div className="flex items-center gap-3">
          <Control label={t("prev")} onClick={() => swiperRef.current?.slidePrev()}>
            <path d="M13 3 L6 10 L13 17" />
          </Control>
          <Control label={t("next")} onClick={() => swiperRef.current?.slideNext()}>
            <path d="M7 3 L14 10 L7 17" />
          </Control>
        </div>
      </div>
    </section>
  );
}

function Control({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-rule/80 bg-surface/70 backdrop-blur-md text-ink transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink hover:scale-105 active:scale-95 shadow-sm"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

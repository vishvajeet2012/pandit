"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CARD_IMAGES = [
  "/work/janma-kundli.jpg",
  "/work/graha-shanti.jpg",
  "/work/career-direction.jpg",
  "/work/annual-forecast.jpg",
  "/work/muhurta.jpg",
  "/work/kundli-milan.jpg",
];

type Work = { n: string; title: string; body: string; deva: string };

export default function SignatureWork() {
  const t = useTranslations("work");
  const items = t.raw("items") as Work[];
  const slugs = t.raw("slugs") as string[];
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current;
      const wrap = root.current;
      if (!el || !wrap) return;

      const distance = () => el.scrollWidth - window.innerWidth * 0.82;

      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + distance() * 1.1,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length + 0.28)));
          },
        },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [items.length]);

  // dragging sideways moves the page, which is what moves the track
  const drag = useRef<{ x: number; scroll: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const lenis = window.__lenis;
    drag.current = { x: e.clientX, scroll: lenis ? lenis.scroll : window.scrollY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const target = drag.current.scroll - dx * 1.6;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <section
      id="offerings"
      ref={root}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className="relative h-screen touch-pan-y select-none overflow-hidden"
    >
      <div className="tex-palm pointer-events-none absolute inset-0" />

      <div className="act relative z-10 flex h-full flex-col justify-center pt-[76px]">
        <div className="shrink-0">
          <p className="eyebrow mb-8">{t("eyebrow")}</p>
          <h2 className="display text-[clamp(32px,4.6vw,64px)]">
            {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span> {t("titleTail")}
          </h2>
          <div className="mt-8 h-px w-[120px] bg-gold" />
        </div>

        <div className="relative mt-16">
          <div ref={track} className="flex gap-10 will-change-transform">
            {items.map((w, i) => {
              const on = i === active;
              return (
                <article
                  key={w.n}
                  className={`relative flex h-[46vh] w-[min(560px,72vw)] shrink-0 flex-col justify-between overflow-hidden bg-surface p-12 transition-[border-color,opacity] duration-700 ${
                    on ? "border border-gold opacity-100" : "border border-rule/60 opacity-70"
                  }`}
                >
                  {/* card background image */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <Image
                      src={CARD_IMAGES[i] || CARD_IMAGES[0]}
                      alt={w.title}
                      fill
                      className="object-cover transition-opacity duration-700"
                      style={{ opacity: on ? 1 : 0.6 }}
                      sizes="(max-width: 768px) 72vw, 560px"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, white 30%, rgba(255,255,255,0.5) 55%, transparent 75%)" }} />
                  </div>

                  <span
                    className="display pointer-events-none absolute -bottom-10 right-6 select-none text-[280px] leading-none text-gold"
                    style={{ opacity: on ? 0.08 : 0.03 }}
                    aria-hidden
                  >
                    {w.n}
                  </span>

                  <div className="relative">
                    <p className="smallcaps text-gold">{w.n}</p>
                    <h3 className="display mt-6 max-w-[18ch] text-[clamp(24px,2.4vw,34px)] leading-[1.05]">
                      {w.title}
                    </h3>
                    <p className="body-muted mt-6 max-w-[38ch] text-[16px]">{w.body}</p>
                  </div>

                  <div className="relative flex items-end justify-between">
                    <Link href={`/offerings/${slugs[i]}`} className="gold-link text-[18px] font-semibold">
                      {t("cta")}
                    </Link>
                    <span className="deva">{w.deva}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

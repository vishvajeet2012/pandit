"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "@/lib/gsap";
import Plate from "@/components/plates/Plate";
import Rise from "@/components/site/Rise";

export default function Sanctum() {
  const t = useTranslations("sanctum");
  const facts = t.raw("facts") as string[];
  const root = useRef<HTMLElement>(null);
  const jaali = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      // the lattice drifts against the floor it falls on
      gsap.fromTo(
        jaali.current,
        { y: -6 },
        {
          y: 6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="sanctum" ref={root} className="relative">
      <div className="act pt-[clamp(96px,11vw,190px)]">
        <p className="eyebrow mb-8">{t("eyebrow")}</p>
        <Rise as="h2" className="display max-w-[16ch] text-[clamp(32px,4.8vw,64px)]">
          {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span>
        </Rise>
      </div>

      <div className="relative mt-20 h-[78vh] w-full overflow-hidden">
        <div ref={frame} className="absolute inset-[-4%] h-[108%] w-[108%]">
          <Plate variant="sanctum" alt={t("imageAlt")} className="h-full w-full" />
        </div>

        <div ref={jaali} className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <svg
            className="h-full w-full"
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <g transform="skewX(-13)" fill="#6b5433">
              {Array.from({ length: 6 }).map((_, r) =>
                Array.from({ length: 13 }).map((_, c) => (
                  <rect
                    key={r + "-" + c}
                    x={330 + c * (56 - r * 3) + r * 24}
                    y={512 + r * 46}
                    width={30 - r * 2}
                    height={22 - r}
                    opacity={0.6 - r * 0.08}
                  />
                ))
              )}
            </g>
          </svg>
        </div>

        {/* a dust-mote streak in the light */}
        <div className="pointer-events-none absolute left-[18%] top-[12%] h-[46%] w-px rotate-[14deg] bg-gradient-to-b from-transparent via-white/70 to-transparent" />
      </div>

      <div className="act relative z-10 -mt-[14vh] pb-[clamp(96px,11vw,190px)]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="warm-lift bg-surface p-[clamp(32px,4vw,64px)] lg:col-span-7">
            <p className="body-muted max-w-[52ch]">{t("body")}</p>
            <div className="mt-10">
              <Link href="/book" className="gold-link">
                {t("link")}
              </Link>
            </div>
          </div>

          <div className="bg-canvas p-8 lg:col-span-4 lg:col-start-9 lg:p-10">
            {facts.map((f) => (
              <div key={f}>
                <div className="hairline" />
                <p className="smallcaps py-5 text-muted">{f}</p>
              </div>
            ))}
            <div className="hairline" />
            <p className="deva mt-8">{t("deva")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

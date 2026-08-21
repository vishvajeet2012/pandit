"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Step = { n: string; label: string; line: string };

export default function Ritual() {
  const t = useTranslations("ritual");
  const steps = t.raw("steps") as Step[];
  const root = useRef<HTMLElement>(null);
  const sutra = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sutra.current, { strokeDasharray: 1, strokeDashoffset: -1 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=2200",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(sutra.current, { strokeDashoffset: Math.min(1, p * 1.35) - 1 });
          setActive(Math.min(steps.length - 1, Math.floor(p * steps.length + 0.2)));
        },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section id="ritual" ref={root} className="relative flex h-screen flex-col justify-center">
      <div className="act">
        <p className="eyebrow mb-16">{t("eyebrow")}</p>

        <div className="relative">
          {/* the sutra-line, drawn as you descend */}
          <svg
            className="pointer-events-none absolute inset-x-0 top-[52%] h-4 w-full"
            viewBox="0 0 1000 10"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={sutra}
              d="M4 5 H 996"
              pathLength={1}
              stroke="#c5a46e"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
          </svg>

          <div className="grid grid-cols-2 gap-y-20 md:grid-cols-4 md:gap-y-0">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <div key={s.n} className="relative flex flex-col items-start">
                  <span
                    className="display select-none text-[clamp(64px,11vw,168px)] leading-[0.9] transition-colors duration-700"
                    style={
                      on
                        ? { color: "#c5a46e" }
                        : { color: "transparent", WebkitTextStroke: "1px #c5a46e" }
                    }
                  >
                    {s.n}
                  </span>

                  <div
                    className="mt-10 transition-opacity duration-700"
                    style={{ opacity: on ? 1 : 0.28 }}
                  >
                    <p className="smallcaps text-ink">{s.label}</p>
                    <p className="body-muted mt-4 max-w-[26ch] text-[15px]">{s.line}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="deva mt-24">{t("deva")}</p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * A North Indian kundli: one square, both diagonals, and the rhombus through
 * the side midpoints — twelve bhavas, drawn as the reader descends.
 */

const LINES = [
  "M2 2 H198 V198 H2 Z",
  "M2 2 L100 100",
  "M198 2 L100 100",
  "M2 198 L100 100",
  "M198 198 L100 100",
  "M100 2 L2 100 L100 198 L198 100 Z",
];

/** House centres, house one at the top, running anticlockwise. */
const HOUSES: [number, number][] = [
  [100, 40], [50, 22], [24, 48], [58, 100], [24, 152], [50, 178],
  [100, 160], [150, 178], [176, 152], [142, 100], [176, 48], [150, 22],
];

export type HouseContent = { rashi: number; grahas: string[] };

type Props = {
  className?: string;
  /** House to mark with a gold dot — the ascendant. */
  lagna?: number;
  /** House numbers, already formatted for the locale. */
  labels?: string[];
  /** Rashi number and grahas per house; turns the diagram into a real chart. */
  houses?: HouseContent[];
  /** Draw immediately on mount instead of against the scroll. */
  play?: boolean;
};

export default function KundliChart({ className = "", lagna = 1, labels, houses, play = false }: Props) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const strokes = el.querySelectorAll<SVGGeometryElement>("[data-draw]");
      const marks = el.querySelectorAll("[data-house]");
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });

      if (play) {
        gsap.to(strokes, { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.9, stagger: 0.08 });
        gsap.fromTo(marks, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.04, delay: 0.5 });
        return;
      }

      gsap.to(strokes, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 45%", scrub: 1 },
      });
      gsap.fromTo(
        marks,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [houses, play]);

  return (
    <svg ref={root} viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      <g stroke="#c5a46e" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {LINES.map((d, i) => (
          <path key={i} d={d} data-draw pathLength={1} />
        ))}
      </g>

      {HOUSES.map(([x, y], i) => {
        const n = i + 1;
        const on = n === lagna;
        const content = houses?.[i];
        const grahas = content?.grahas ?? [];

        return (
          <g key={n} data-house>
            <text
              x={x}
              y={content ? y - 7 : y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={content ? 7 : 9}
              fontFamily="var(--font-inter), sans-serif"
              letterSpacing="0.12em"
              fill={content ? "#c5a46e" : on ? "#1f252e" : "#5c6675"}
              opacity={content ? 0.9 : on ? 1 : 0.55}
            >
              {content ? content.rashi : (labels?.[i] ?? n)}
            </text>

            {grahas.map((g, gi) => (
              <text
                key={g}
                x={x}
                y={y + 3 + gi * 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fontFamily="var(--font-inter), sans-serif"
                letterSpacing="0.04em"
                fill="#1f252e"
              >
                {g}
              </text>
            ))}

            {on && !content && <circle cx={x} cy={y - 15} r="2" fill="#c5a46e" />}
          </g>
        );
      })}
    </svg>
  );
}

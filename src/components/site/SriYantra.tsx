"use client";

import { useEffect, useId, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const UP = [
  "500,148 168,590 832,590",
  "500,232 196,672 804,672",
  "500,300 232,730 768,730",
  "500,392 280,800 720,800",
];

const DOWN = [
  "500,852 168,410 832,410",
  "500,780 196,340 804,340",
  "500,700 232,268 768,268",
  "500,620 280,205 720,205",
  "500,560 330,300 670,300",
];

const petals = (r: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const b = ((i + 1) / count) * Math.PI * 2;
    const p = (ang: number, rad: number) =>
      `${500 + Math.cos(ang) * rad},${500 + Math.sin(ang) * rad}`;
    const mid = (a + b) / 2;
    return `M ${p(a, r)} Q ${p(mid, r + 46)} ${p(b, r)}`;
  });

type Props = {
  /** Static draw amount, 0–1, when not scrubbed. */
  progress?: number;
  /** Draw the geometry against scroll instead of freezing it. */
  scrub?: boolean;
  /** Draw it once, on mount, over this many seconds. */
  play?: number;
  className?: string;
  opacity?: number;
};

export default function SriYantra({
  progress = 0.55,
  scrub = false,
  play,
  className = "",
  opacity = 0.5,
}: Props) {
  const root = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const strokes = el.querySelectorAll<SVGGeometryElement>("[data-draw]");
    const ctx = gsap.context(() => {
      if (play) {
        gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
        // grows from the bindu outward: the last shapes in the file are the innermost
        gsap.to(strokes, {
          strokeDashoffset: 0,
          ease: "power1.inOut",
          duration: play * 0.5,
          stagger: { each: (play * 0.5) / strokes.length, from: "end" },
        });
        return;
      }
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 - progress });
      if (!scrub) return;
      gsap.to(strokes, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 20%",
          scrub: 1,
        },
      });
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [progress, scrub, play]);

  return (
    <svg
      ref={root}
      viewBox="0 0 1000 1000"
      className={className}
      aria-hidden
      fill="none"
      stroke="#c5a46e"
      strokeWidth={1.1}
      style={{ opacity }}
    >
      <g vectorEffect="non-scaling-stroke">
        <rect data-draw pathLength={1} x="60" y="60" width="880" height="880" />
        <rect data-draw pathLength={1} x="96" y="96" width="808" height="808" />
        {petals(300, 16).map((d, i) => (
          <path data-draw pathLength={1} key={`p16-${uid}-${i}`} d={d} />
        ))}
        {petals(230, 8).map((d, i) => (
          <path data-draw pathLength={1} key={`p8-${uid}-${i}`} d={d} />
        ))}
        <circle data-draw pathLength={1} cx="500" cy="500" r="392" />
        <circle data-draw pathLength={1} cx="500" cy="500" r="366" />
        {[...UP, ...DOWN].map((pts, i) => (
          <polygon data-draw pathLength={1} key={`t-${uid}-${i}`} points={pts} />
        ))}
        <circle data-draw pathLength={1} cx="500" cy="500" r="9" />
      </g>
    </svg>
  );
}

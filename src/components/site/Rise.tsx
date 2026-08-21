"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Leaves the line short of its baseline so the reveal reads mid-flight. */
  freeze?: boolean;
};

/** A line of type rising into its final baseline behind a mask. */
export default function Rise({
  children,
  as: Tag = "span",
  className = "",
  delay = 0,
  freeze = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild;
    if (!inner) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: 108 },
        {
          yPercent: freeze ? 6 : 0,
          duration: 1.3,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay, freeze]);

  return (
    <Tag ref={ref} className={`reveal-line ${className}`}>
      <span>{children}</span>
    </Tag>
  );
}

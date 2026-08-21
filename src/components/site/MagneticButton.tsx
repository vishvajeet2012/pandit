"use client";

import { useRef, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
  /** Route through the locale-aware Link instead of a plain anchor. */
  localized?: boolean;
};

/** A control that leans toward the pointer, then releases without a bounce. */
export default function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.32,
  localized = false,
}: Props) {
  const wrap = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (wrap.current) wrap.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <span
      ref={wrap}
      data-magnetic
      onPointerMove={move}
      onPointerLeave={reset}
      className="inline-flex"
      style={{ transition: "transform .55s cubic-bezier(.22,1,.36,1)" }}
    >
      {localized ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : (
        <a href={href} className={className}>
          {children}
        </a>
      )}
    </span>
  );
}

"use client";

import { useEffect, useRef } from "react";

/** 6px charcoal dot + 28px gold hairline ring, the ring trailing at lerp 0.12. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("cursor-ready");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...target };
    let frame = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const near = !!el?.closest("a, button, [data-magnetic], [data-cursor]");
      if (near !== hovering) {
        hovering = near;
        const inner = ring.current?.firstElementChild as HTMLElement | undefined;
        if (inner) {
          inner.style.transform = near ? "scale(1.5)" : "scale(1)";
          inner.style.opacity = near ? "1" : "0.65";
        }
      }
    };

    const loop = () => {
      trail.x += (target.x - trail.x) * 0.12;
      trail.y += (target.y - trail.y) * 0.12;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x - 3}px, ${target.y - 3}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${trail.x - 14}px, ${trail.y - 14}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div ref={ring} className="absolute left-0 top-0 h-7 w-7">
        <div
          className="h-full w-full rounded-full border border-gold"
          style={{ opacity: 0.65, transition: "transform .45s cubic-bezier(.22,1,.36,1), opacity .45s ease" }}
        />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-ink" />
    </div>
  );
}

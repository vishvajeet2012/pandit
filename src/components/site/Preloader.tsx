"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import SriYantra from "./SriYantra";

/**
 * The geometry draws itself once, on the first visit of a session, and then
 * lifts. Anything less than a full page load — a route change, a second visit —
 * skips it entirely.
 */
export default function Preloader() {
  // never server-rendered (see Enter.tsx), so this can read the session directly
  const [show, setShow] = useState(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("aetheris-entered")) return false;
    sessionStorage.setItem("aetheris-entered", "1");
    return true;
  });
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.to(root.current, {
        autoAlpha: 0,
        duration: 0.7,
        delay: 1.5,
        ease: "power2.inOut",
        onComplete: () => setShow(false),
      });
      gsap.fromTo(
        ".preloader-word",
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.25, ease: "power2.out" }
      );
    }, root);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-canvas"
      aria-hidden
    >
      <SriYantra play={1.5} opacity={0.55} className="h-[44vh] w-[44vh]" />
      <p className="preloader-word font-display mt-10 text-[13px] tracking-[0.42em] text-gold">
        AETHERIS
      </p>
    </div>
  );
}

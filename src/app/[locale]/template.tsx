"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Every route change comes up out of the ivory rather than cutting to it. */
export default function Template({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "transform" }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}

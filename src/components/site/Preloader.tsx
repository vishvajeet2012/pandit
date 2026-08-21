"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import SriYantra from "./SriYantra";

/**
 * The door.
 *
 * The geometry draws itself once, on the first visit of a session, while the
 * wordmark sets and a hairline fills; then the whole sheet lifts off the page.
 * A second visit, or a reader who asked for less motion, never sees it.
 */
export default function Preloader() {
  const t = useTranslations("enter");

  // Guard against SSR – during static prerendering `window` does not exist
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("aetheris-entered")) return false;
    sessionStorage.setItem("aetheris-entered", "1");
    document.documentElement.dataset.entering = "1";
    return true;
  });

  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";

    const release = () => {
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.entering;
      window.dispatchEvent(new Event("aetheris:entered"));
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setShow(false),
      });

      // the wordmark sets letter by letter, tracking closing as it lands
      tl.fromTo(
        ".enter-letter",
        { autoAlpha: 0, yPercent: 60 },
        { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.045 },
        0.35
      )
        .fromTo(
          ".enter-mark",
          { letterSpacing: "0.62em" },
          { letterSpacing: "0.42em", duration: 1.6, ease: "power2.out" },
          0.35
        )
        .fromTo(
          ".enter-tagline",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 1 },
          0.9
        )
        .fromTo(
          ".enter-foot",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          0.6
        )
        // the hairline fills as the geometry completes
        .fromTo(
          ".enter-rule-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.9, ease: "power1.inOut" },
          0.5
        )
        .to(
          { n: 0 },
          {
            n: 100,
            duration: 1.9,
            ease: "power1.inOut",
            onUpdate() {
              const v = Math.round((this.targets()[0] as { n: number }).n);
              if (counter.current) counter.current.textContent = String(v).padStart(2, "0");
            },
          },
          0.5
        )
        // hold, then lift the sheet off the page
        .to(".enter-inner", { autoAlpha: 0, y: -16, duration: 0.7 }, 2.5)
        .to(
          root.current,
          {
            yPercent: -100,
            duration: 1.1,
            ease: "power3.inOut",
            onStart: release,
          },
          2.75
        );
    }, root);

    return () => {
      ctx.revert();
      release();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-canvas"
      aria-hidden
    >
      <div className="enter-inner flex flex-col items-center">
        <SriYantra play={2.4} opacity={0.8} className="h-[46vh] w-[46vh]" />

        <p className="enter-mark font-display mt-10 flex text-[14px] text-gold">
          {"VISH".split("").map((c, i) => (
            <span key={i} className="enter-letter inline-block">
              {c}
            </span>
          ))}
        </p>

        <p className="enter-tagline smallcaps mt-5 text-muted">{t("tagline")}</p>
      </div>

      {/* the hairline that fills while the geometry is drawn */}
      <div className="enter-foot act absolute inset-x-0 bottom-[clamp(32px,6vh,72px)] w-full">
        <div className="flex items-baseline justify-between">
          <span className="smallcaps text-muted">{t("line")}</span>
          <span className="smallcaps text-gold">
            <span ref={counter}>00</span>
          </span>
        </div>
        <div className="relative mt-4 h-px w-full bg-rule">
          <span className="enter-rule-fill absolute inset-0 block origin-left bg-gold" />
        </div>
      </div>
    </div>
  );
}

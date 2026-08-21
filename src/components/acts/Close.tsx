"use client";

import { useTranslations } from "next-intl";
import SriYantra from "@/components/site/SriYantra";
import MagneticButton from "@/components/site/MagneticButton";
import Rise from "@/components/site/Rise";

export default function Close() {
  const t = useTranslations("close");
  const prep = t.raw("prep") as string[];

  return (
    <section
      id="close"
      className="relative flex min-h-[96vh] items-center justify-center overflow-hidden"
    >
      {/* the geometry finally completes itself */}
      <SriYantra
        scrub
        progress={0.62}
        opacity={0.06}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[112vh] w-[112vh] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="act relative z-10 flex w-full flex-col items-center py-28 text-center">
        <p className="eyebrow mb-10">{t("eyebrow")}</p>

        <h2 className="display text-[clamp(34px,5.4vw,80px)] leading-[0.94]">
          <Rise>{t("line1")}</Rise>
          <Rise className="italic-gold" delay={0.06}>
            {t("line2")}
          </Rise>
        </h2>

        <p className="body-muted mt-10 max-w-[48ch]">{t("sub")}</p>

        <MagneticButton
          href="/book"
          localized
          strength={0.24}
          className="mt-14 flex h-[58px] items-center rounded-full bg-gold px-11 text-[13px] font-medium tracking-[0.08em] text-ink"
        >
          {t("cta")}
        </MagneticButton>

        {/* what to have ready before writing */}
        <div className="mt-24 w-full max-w-[900px] text-left">
          <p className="smallcaps mb-8 text-center text-muted">{t("prepTitle")}</p>
          <div className="grid gap-x-12 gap-y-0 border-t border-rule sm:grid-cols-2">
            {prep.map((p) => (
              <p key={p} className="body-muted border-b border-rule py-5 text-[15px]">
                {p}
              </p>
            ))}
          </div>
        </div>

        <p className="deva mt-16">{t("deva")}</p>
      </div>
    </section>
  );
}

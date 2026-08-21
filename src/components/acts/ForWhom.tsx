import { useTranslations } from "next-intl";
import Rise from "@/components/site/Rise";

export default function ForWhom() {
  const t = useTranslations("forwhom");
  const forList = t.raw("for") as string[];
  const notForList = t.raw("notFor") as string[];

  return (
    <section id="forwhom" className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>

      <h2 className="display text-[clamp(32px,5.4vw,84px)] leading-[0.92]">
        <Rise>{t("line1")}</Rise>
        <Rise className="italic-gold" delay={0.08}>
          {t("line2")}
        </Rise>
      </h2>

      <div className="mt-[clamp(64px,8vw,130px)] grid gap-[clamp(48px,6vw,110px)] md:grid-cols-2">
        <div className="md:pr-[clamp(24px,4vw,80px)]">
          <p className="smallcaps text-gold">{t("forTitle")}</p>
          <ul className="mt-12 space-y-9">
            {forList.map((l) => (
              <li key={l} className="flex gap-6">
                <span className="mt-[15px] block h-px w-3 shrink-0 bg-gold" />
                <span className="body-muted max-w-[34ch]">{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-rule md:border-l md:pl-[clamp(24px,4vw,80px)]">
          <p className="smallcaps text-muted">{t("notForTitle")}</p>
          <ul className="mt-12 space-y-9">
            {notForList.map((l) => (
              <li key={l} className="flex gap-6">
                <span className="mt-[15px] block h-px w-3 shrink-0 bg-ink" />
                <span className="body-muted max-w-[34ch]">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="display italic-gold mx-auto mt-[clamp(72px,9vw,150px)] max-w-[26ch] text-center text-[clamp(22px,2.6vw,36px)] leading-[1.25]">
        {t("closing")}
      </p>
    </section>
  );
}

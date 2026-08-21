import { getTranslations } from "next-intl/server";
import Rise from "@/components/site/Rise";
import PanchangGrid, { type PanchangItem } from "./PanchangGrid";
import { panchang } from "@/lib/jyotish";

/**
 * The panchang for the moment this page was rendered, computed from the
 * ephemeris in src/lib/jyotish.ts rather than typed into a dictionary.
 */
export default async function Panchang({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "panchang" });
  const labels = t.raw("items") as PanchangItem[];
  const hi = locale === "hi";

  const now = new Date();
  const p = panchang(now);

  const inJaipur = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(hi ? "hi-IN" : "en-IN", { ...opts, timeZone: "Asia/Kolkata" });

  const items: PanchangItem[] = [
    {
      label: labels[0].label,
      value: `${t(p.tithi.paksha)} ${p.tithi.name[hi ? 1 : 0]}`,
      deva: labels[0].deva,
    },
    {
      label: labels[1].label,
      value: p.nakshatra.name[hi ? 1 : 0],
      deva: labels[1].deva,
    },
    { label: labels[2].label, value: p.yoga.name[hi ? 1 : 0], deva: labels[2].deva },
    { label: labels[3].label, value: p.karana.name[hi ? 1 : 0], deva: labels[3].deva },
    {
      label: labels[4].label,
      value: inJaipur({ weekday: "long" }).format(now),
      deva: labels[4].deva,
    },
  ];

  return (
    <section id="panchang" className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Rise as="h2" className="display max-w-[16ch] text-[clamp(28px,3.6vw,50px)]">
          {t("title")}
        </Rise>
        <div className="max-w-[46ch]">
          <p className="body-muted text-[15px]">{t("note")}</p>
          <p className="smallcaps mt-5 text-gold">
            {t("asAt", { time: inJaipur({ hour: "2-digit", minute: "2-digit" }).format(now) })}
          </p>
        </div>
      </div>

      <PanchangGrid items={items} />
    </section>
  );
}

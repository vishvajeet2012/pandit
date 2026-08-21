import { useTranslations } from "next-intl";
import Rise from "@/components/site/Rise";

type Quote = { q: string; who: string; where: string };

/** Uneven placement, so three quotes never read as three columns. */
const PLACEMENT = [
  { span: "lg:col-span-4", offset: "lg:mt-0", portrait: true },
  { span: "lg:col-span-4 lg:col-start-6", offset: "lg:mt-12", portrait: false },
  { span: "lg:col-span-3 lg:col-start-10", offset: "lg:mt-6", portrait: false },
];

export default function Voices() {
  const t = useTranslations("voices");
  const quotes = t.raw("quotes") as Quote[];

  return (
    <section id="voices" className="act act-y">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>
      <Rise as="h2" className="display text-[clamp(32px,4.8vw,64px)]">
        {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span> {t("titleTail")}
      </Rise>

      <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-10">
        {quotes.map((q, i) => {
          const p = PLACEMENT[i] ?? PLACEMENT[0];
          return (
            <figure key={q.who} className={`relative ${p.span} ${p.offset}`}>
              <span
                className="display pointer-events-none absolute -left-2 -top-12 select-none text-[80px] leading-none text-gold opacity-[0.12]"
                aria-hidden
              >
                “
              </span>
              <blockquote className="display relative text-[clamp(19px,1.9vw,27px)] leading-[1.35]">
                {q.q}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                {p.portrait && (
                  <span
                    className="block h-9 w-9 shrink-0 overflow-hidden rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 34% 28%, #f4ead8 0%, #cbb492 46%, #8d7458 100%)",
                    }}
                    aria-hidden
                  />
                )}
                <span className="smallcaps text-ink">{q.who}</span>
                <span className="h-[3px] w-[3px] rounded-full bg-gold" />
                <span className="smallcaps text-muted">{q.where}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

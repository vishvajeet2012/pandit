import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";

type Section = { h: string; body: string };

/** Fees, privacy and terms all read the same way: a head and numbered clauses. */
export default async function LegalPage({
  locale,
  doc,
}: {
  locale: string;
  doc: "fees" | "privacy" | "terms";
}) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const sections = t.raw(`${doc}.sections`) as Section[];

  return (
    <main className="flex-1 pb-32">
      <header className="act pt-[clamp(120px,14vw,200px)]">
        <p className="eyebrow mb-8">{t(`${doc}.eyebrow`)}</p>
        <h1 className="display max-w-[18ch] text-[clamp(32px,4.6vw,64px)] leading-[0.98]">
          {t(`${doc}.title`)}
        </h1>
        <p className="smallcaps mt-10 text-muted">{t("updated")}</p>
      </header>

      <div className="act mt-20 max-w-[860px] border-t border-rule">
        {sections.map((s, i) => (
          <section key={s.h} className="grid grid-cols-12 gap-x-8 border-b border-rule py-10">
            <span className="smallcaps col-span-2 text-gold md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="col-span-10 md:col-span-11">
              <h2 className="display text-[clamp(19px,1.9vw,26px)] leading-tight">{s.h}</h2>
              <p className="body-muted mt-5 max-w-[62ch] text-[16px]">{s.body}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="act mt-14 flex flex-wrap items-center gap-10">
        <a href={`mailto:${site.email}`} className="gold-link">
          {site.email}
        </a>
        <Link href="/" className="smallcaps text-muted transition-colors hover:text-ink">
          {site.name} · {site.city}
        </Link>
      </div>
    </main>
  );
}

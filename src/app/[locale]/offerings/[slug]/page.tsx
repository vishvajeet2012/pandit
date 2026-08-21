import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";

type Detail = {
  lede: string;
  duration: string;
  prep: string;
  sections: { h: string; body: string }[];
};

type Item = { n: string; title: string; body: string; deva: string };

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const t = await getTranslations({ locale, namespace: "work" });
    for (const slug of t.raw("slugs") as string[]) params.push({ locale, slug });
  }
  return params;
}

async function load(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "work" });
  const slugs = t.raw("slugs") as string[];
  const index = slugs.indexOf(slug);
  if (index < 0) return null;
  return {
    t,
    index,
    slugs,
    item: (t.raw("items") as Item[])[index],
    detail: (t.raw("details") as Detail[])[index],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await load(locale, slug);
  if (!data) return {};
  return { title: `${data.item.title} — ${site.name}`, description: data.detail.lede };
}

export default async function OfferingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const data = await load(locale, slug);
  if (!data) notFound();

  const { t, item, detail, index, slugs } = data;
  const next = (t.raw("items") as Item[])[(index + 1) % slugs.length];
  const nextSlug = slugs[(index + 1) % slugs.length];

  return (
    <main className="flex-1 pb-32">
      <header className="act pt-[clamp(120px,14vw,200px)]">
        <Link href="/#offerings" className="smallcaps text-muted transition-colors hover:text-ink">
          {t("backToOfferings")}
        </Link>
        <p className="eyebrow mt-12 mb-8">
          {item.n} — {item.deva}
        </p>
        <h1 className="display max-w-[16ch] text-[clamp(34px,5vw,72px)] leading-[0.96]">
          {item.title}
        </h1>
        <p className="body-muted mt-10 max-w-[54ch]">{detail.lede}</p>
      </header>

      <div className="act mt-24 grid gap-16 lg:grid-cols-12 lg:gap-[6%]">
        {/* the standing facts */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-[120px]">
            {[
              [t("durationLabel"), detail.duration],
              [t("prepLabel"), detail.prep],
              [t("feeLabel"), t("feeValue")],
            ].map(([label, value]) => (
              <div key={label} className="border-t border-rule py-6">
                <p className="smallcaps text-gold">{label}</p>
                <p className="body-muted mt-3 text-[15px]">{value}</p>
              </div>
            ))}
            <div className="border-t border-rule" />
          </div>
        </aside>

        <div className="lg:col-span-8 lg:col-start-5">
          {detail.sections.map((s) => (
            <section key={s.h} className="mb-16">
              <h2 className="display text-[clamp(22px,2.4vw,32px)] leading-tight">{s.h}</h2>
              <p className="body-muted mt-6 max-w-[58ch]">{s.body}</p>
            </section>
          ))}

          <div className="mt-20 flex flex-wrap items-center gap-10">
            <Link
              href="/book"
              className="flex h-[54px] items-center rounded-full bg-gold px-10 text-[13px] font-medium tracking-[0.08em] text-ink"
            >
              {t("cta")}
            </Link>
            <Link href={`/offerings/${nextSlug}`} className="gold-link">
              {next.title} →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

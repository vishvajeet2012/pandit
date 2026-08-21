import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import credits from "@/config/credits.json";
import { site } from "@/config/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return { title: `${t("title")} — ${site.name}` };
}

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "credits" });

  return (
    <main className="act flex-1 pb-32 pt-32">
      <p className="eyebrow mb-8">{t("eyebrow")}</p>
      <h1 className="display text-[clamp(36px,5vw,68px)]">{t("title")}</h1>
      <p className="body-muted mt-10 max-w-[60ch]">{t("intro")}</p>

      <div className="mt-20 border-t border-rule">
        {credits.map((c) => (
          <div
            key={c.file}
            className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-rule py-7"
          >
            <p className="col-span-12 text-[16px] md:col-span-4">{c.use}</p>
            <p className="body-muted col-span-6 text-[15px] md:col-span-3">{c.author}</p>
            <p className="smallcaps col-span-6 text-muted md:col-span-2">
              {c.licenceUrl ? (
                <a href={c.licenceUrl} className="hover:text-ink" rel="license noopener">
                  {c.licence}
                </a>
              ) : (
                c.licence
              )}
            </p>
            <p className="col-span-12 md:col-span-3 md:text-right">
              <a href={c.source} className="gold-link" rel="noopener">
                {t("source")} →
              </a>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <Link href="/" className="gold-link">
          {t("back")}
        </Link>
      </div>
    </main>
  );
}

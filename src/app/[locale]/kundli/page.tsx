import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHead from "@/components/site/PageHead";
import KundliTool from "@/components/forms/KundliTool";
import { routing } from "@/i18n/routing";
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
  const t = await getTranslations({ locale, namespace: "kundli" });
  return { title: `${t("title")} — ${site.name}`, description: t("intro") };
}

export default async function KundliPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "kundli" });

  return (
    <main className="flex-1 pb-32">
      <PageHead eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
        <p className="body-muted mt-8 max-w-[58ch] border-l border-rule pl-6 text-[15px]">
          {t("disclaimer")}
        </p>
      </PageHead>
      <KundliTool />
    </main>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHead from "@/components/site/PageHead";
import BookingForm from "@/components/forms/BookingForm";
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
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: `${t("title")} — ${site.name}`, description: t("intro") };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "book" });

  return (
    <main className="flex-1 pb-32">
      <PageHead eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <div className="act">
        <BookingForm />
      </div>
    </main>
  );
}

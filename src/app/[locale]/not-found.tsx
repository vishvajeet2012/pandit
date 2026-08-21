import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SriYantra from "@/components/site/SriYantra";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="relative flex min-h-[80vh] flex-1 items-center overflow-hidden">
      <SriYantra
        progress={0.28}
        opacity={0.05}
        className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[90vh] w-[90vh] -translate-y-1/2 md:block"
      />
      <div className="act relative z-10">
        <p className="eyebrow mb-8">{t("eyebrow")}</p>
        <h1 className="display max-w-[16ch] text-[clamp(34px,5vw,72px)] leading-[0.96]">
          {t("title")}
        </h1>
        <p className="body-muted mt-10 max-w-[48ch]">{t("body")}</p>
        <div className="mt-14">
          <Link href="/" className="gold-link">
            {t("cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}

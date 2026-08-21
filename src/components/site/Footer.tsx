import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";

const ITEMS = [
  { id: "journey", href: "/#parampara" },
  { id: "offerings", href: "/#offerings" },
  { id: "sanctum", href: "/#sanctum" },
  { id: "journal", href: "/#journal" },
  { id: "kundli", href: "/kundli" },
  { id: "fees", href: "/fees" },
  { id: "privacy", href: "/privacy" },
  { id: "terms", href: "/terms" },
  { id: "credits", href: "/credits" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="act pb-16 pt-14">
      <div className="hairline" />
      <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:items-start lg:justify-between">
        <p className="smallcaps text-ink">
          {site.name}
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-gold align-middle" />
          {t("place")}
        </p>

        <nav className="flex max-w-[640px] flex-wrap gap-x-8 gap-y-3">
          {ITEMS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className="text-[12px] tracking-[0.04em] text-muted transition-colors duration-500 hover:text-ink"
            >
              {t(`items.${l.id}`)}
            </Link>
          ))}
        </nav>

        <p className="smallcaps text-muted">
          © 2026
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-gold align-middle" />
          {t("rights")}
        </p>
      </div>

      <p className="mt-10 text-center text-[11px] tracking-[0.04em] text-muted">
        Design by Vishvajeet Shukla
      </p>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useActiveChapter } from "@/lib/useActiveChapter";
import { LOCALE_LABELS, routing, type Locale } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";
import MagneticButton from "./MagneticButton";

const LINKS = [
  { id: "about", href: "/#about" },
  { id: "offerings", href: "/#offerings" },
  { id: "sanctum", href: "/#sanctum" },
  { id: "journal", href: "/#journal" },
  { id: "kundli", href: "/kundli" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = useActiveChapter();
  const [lifted, setLifted] = useState(false);
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] transition-colors duration-700 ${
        lifted || !onHome ? "bg-canvas/80 backdrop-blur-[6px]" : "bg-transparent"
      }`}
    >
      <div className="flex h-[76px] items-center justify-between px-[clamp(24px,7.2vw,140px)]">
        <Link
          href="/"
          className="font-display text-[18px] tracking-[0.34em] text-gold"
          aria-label={t("home")}
        >
          AETHERIS
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => {
            const on = l.href.startsWith("/#")
              ? onHome && active === l.id
              : pathname.startsWith(l.href);
            return (
              <Link
                key={l.id}
                href={l.href}
                className={`relative pb-1 text-[12px] tracking-[0.06em] transition-colors duration-500 ${
                  on ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {t(l.id)}
                <span
                  className="absolute inset-x-0 -bottom-px h-px origin-left bg-gold transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ transform: `scaleX(${on ? 1 : 0})` }}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <MagneticButton
            href="/book"
            localized
            className="flex h-11 items-center rounded-full bg-gold px-7 text-[12px] font-medium tracking-[0.08em] text-ink"
          >
            {t("book")}
          </MagneticButton>
          <LocaleSwitch label={t("language")} />
        </div>
      </div>
      <div className="h-px w-full bg-rule/60" />
    </header>
  );
}

function LocaleSwitch({ label }: { label: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-2 sm:flex" aria-label={label}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="h-[3px] w-[3px] rounded-full bg-rule" />}
          <Link
            href={pathname}
            locale={l}
            hrefLang={l}
            className={`text-[11px] tracking-[0.18em] transition-colors duration-500 ${
              l === locale ? "text-gold" : "text-muted hover:text-ink"
            }`}
          >
            {LOCALE_LABELS[l].short}
          </Link>
        </span>
      ))}
    </div>
  );
}

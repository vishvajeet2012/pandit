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
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[90] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="flex h-[68px] items-center justify-between px-6 sm:px-[clamp(24px,7.2vw,140px)] lg:h-[76px]">
        <Link
          href="/"
          className="font-display text-[16px] tracking-[0.34em] text-gold sm:text-[18px]"
          aria-label={t("home")}
        >
          VISH
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

        <div className="hidden items-center gap-6 lg:flex">
          <MagneticButton
            href="/book"
            localized
            className="flex h-11 items-center rounded-full bg-gold px-7 text-[12px] font-medium tracking-[0.08em] text-ink"
          >
            {t("book")}
          </MagneticButton>
          <LocaleSwitch label={t("language")} />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className="absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                transform: menuOpen ? "translateY(7.5px) rotate(45deg)" : "translateY(0) rotate(0deg)",
              }}
            />
            <span
              className="absolute left-0 bottom-0 h-px w-5 bg-ink transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                transform: menuOpen ? "translateY(-7.5px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
              }}
            />
          </span>
        </button>
      </div>
      <div className="h-px w-full bg-rule/60" />

      <div
        className="grid overflow-hidden bg-white transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden"
        style={{ gridTemplateRows: menuOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 px-6 pb-8 pt-4">
            {LINKS.map((l) => {
              const on = l.href.startsWith("/#")
                ? onHome && active === l.id
                : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.id}
                  href={l.href}
                  className={`border-b border-rule/60 py-4 text-[15px] tracking-[0.04em] transition-colors duration-500 ${
                    on ? "text-gold" : "text-ink"
                  }`}
                >
                  {t(l.id)}
                </Link>
              );
            })}

            <MagneticButton
              href="/book"
              localized
              className="mt-6 flex h-12 items-center justify-center rounded-full bg-gold px-7 text-[12px] font-medium tracking-[0.08em] text-ink"
            >
              {t("book")}
            </MagneticButton>

            <div className="mt-6 flex items-center gap-3">
              <LocaleSwitch label={t("language")} className="flex" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function LocaleSwitch({ label, className }: { label: string; className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className={className ?? "hidden items-center gap-2 sm:flex"} aria-label={label}>
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

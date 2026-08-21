import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Playfair_Display,
  Inter,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from "next/font/google";

import "../globals.css";
import { routing } from "@/i18n/routing";
import SmoothScroll from "@/components/site/SmoothScroll";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Cursor from "@/components/site/Cursor";
import Grain from "@/components/site/Grain";
import Enter from "@/components/site/Enter";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const devaSans = Noto_Sans_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari"],
  weight: ["300", "400"],
  display: "swap",
});

const devaSerif = Noto_Serif_Devanagari({
  variable: "--font-deva-serif",
  subsets: ["devanagari"],
  weight: ["400", "500"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable} ${devaSans.variable} ${devaSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <NextIntlClientProvider>
          <SmoothScroll />
          <Cursor />
          <Grain />
          <Enter />
          <Nav />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

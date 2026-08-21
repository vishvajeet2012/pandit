import { setRequestLocale } from "next-intl/server";

import ChapterTicks from "@/components/site/ChapterTicks";
import { site } from "@/config/site";

import Hero from "@/components/acts/Hero";
import HeroCarousel from "@/components/acts/HeroCarousel";
import TheMan from "@/components/acts/TheMan";
import SignatureWork from "@/components/acts/SignatureWork";
import Panchang from "@/components/acts/Panchang";
import Ritual from "@/components/acts/Ritual";
import WhatIsRead from "@/components/acts/WhatIsRead";
import Houses from "@/components/acts/Houses";
import Sanctum from "@/components/acts/Sanctum";
import Parampara from "@/components/acts/Parampara";
import ForWhom from "@/components/acts/ForWhom";
import ASitting from "@/components/acts/ASitting";
import Voices from "@/components/acts/Voices";
import Journal from "@/components/acts/Journal";
import Faq from "@/components/acts/Faq";
import Close from "@/components/acts/Close";

/** The panchang is live, so the page is rebuilt every half hour. */
export const revalidate = 1800;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ChapterTicks />

      <main className="flex-1">
        {site.hero === "carousel" ? <HeroCarousel /> : <Hero />}
        <TheMan />
        <SignatureWork />
        <Panchang locale={locale} />
        {/* <Ritual /> */}
        <WhatIsRead />
        <Houses />
        <Sanctum />
        <Parampara />
        <ForWhom />
        <ASitting />
        <Voices />
        <Journal />
        <Faq />
        <Close />
      </main>
    </>
  );
}

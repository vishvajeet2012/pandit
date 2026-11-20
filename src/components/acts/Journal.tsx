"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "@/lib/gsap";
import Plate, { type PlateVariant } from "@/components/plates/Plate";

const VARIANTS: PlateVariant[] = ["palm-leaf", "diya", "corridor"];
const SHIFT = [-10, 10, -6];

type Entry = { title: string; alt: string };
type PostCard = { slug: string; title: string; read: string; coverUrl?: string };

export default function Journal({ posts }: { posts: PostCard[] }) {
  const t = useTranslations("journal");
  const entries = t.raw("entries") as Entry[];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".strip-frame").forEach((el) => {
        const shift = Number(el.dataset.shift ?? 0);
        gsap.fromTo(
          el,
          { y: -shift },
          {
            y: shift,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journal" ref={root} className="act-y relative">
      <div className="act">
        <p className="eyebrow mb-8">{t("eyebrow")}</p>
        <h2 className="display text-[clamp(32px,4.8vw,64px)]">
          {t("titleLead")} <span className="italic-gold">{t("titleAccent")}</span>
        </h2>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-2 md:grid-cols-3">
        {posts.map((post, i) => (
          <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
            <div className="strip-frame relative overflow-hidden" data-shift={SHIFT[i % SHIFT.length]}>
              {post.coverUrl ? (
                <img src={post.coverUrl} alt={entries[i]?.alt ?? post.title} className="aspect-[4/5] w-full object-cover" />
              ) : (
                <Plate
                  variant={VARIANTS[i % VARIANTS.length]}
                  alt={entries[i]?.alt ?? post.title}
                  className={`aspect-[4/5] w-full transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] ${
                    i === 1 ? "scale-[1.03]" : ""
                  }`}
                />
              )}
            </div>
            <div className="mt-7 px-6">
              <h3 className="display max-w-[22ch] text-[clamp(19px,1.7vw,26px)] leading-[1.2]">
                {post.title}
              </h3>
              <p className="smallcaps mt-4 text-gold">{post.read}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

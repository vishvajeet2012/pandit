import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Plate, { type PlateVariant } from "@/components/plates/Plate";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";

type Post = {
  slug: string;
  title: string;
  dek: string;
  read: string;
  body: string[];
  pull: string;
};

/** The three journal stills, in the order the posts are written. */
const PLATES: PlateVariant[] = ["palm-leaf", "diya", "corridor"];

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const t = await getTranslations({ locale, namespace: "journal" });
    for (const post of t.raw("posts") as Post[]) params.push({ locale, slug: post.slug });
  }
  return params;
}

async function load(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "journal" });
  const posts = t.raw("posts") as Post[];
  const index = posts.findIndex((p) => p.slug === slug);
  if (index < 0) return null;
  return { t, posts, index, post: posts[index] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await load(locale, slug);
  if (!data) return {};
  return { title: `${data.post.title} — ${site.name}`, description: data.post.dek };
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const data = await load(locale, slug);
  if (!data) notFound();

  const { t, post, posts, index } = data;
  const entries = t.raw("entries") as { title: string; alt: string }[];
  const next = posts[(index + 1) % posts.length];

  const half = Math.ceil(post.body.length / 2);

  return (
    <main className="flex-1 pb-32">
      <header className="act pt-[clamp(120px,14vw,200px)]">
        <Link href="/#journal" className="smallcaps text-muted transition-colors hover:text-ink">
          {t("backToJournal")}
        </Link>
        <h1 className="display mt-12 max-w-[20ch] text-[clamp(32px,4.6vw,64px)] leading-[0.98]">
          {post.title}
        </h1>
        <div className="mt-8 flex items-center gap-4">
          <span className="smallcaps text-gold">{post.read}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-gold" />
          <span className="smallcaps text-muted">{post.dek}</span>
        </div>
      </header>

      <div className="mt-20">
        <Plate
          variant={PLATES[index] ?? "palm-leaf"}
          alt={entries[index]?.alt ?? post.title}
          className="h-[52vh] w-full"
          sizes="100vw"
        />
      </div>

      <article className="act mt-24">
        <div className="mx-auto max-w-[64ch]">
          {post.body.slice(0, half).map((p, i) => (
            <p key={i} className="body-muted mb-8 text-[17px]">
              {p}
            </p>
          ))}

          <blockquote className="display my-16 border-l border-gold pl-8 text-[clamp(22px,2.4vw,32px)] leading-[1.3]">
            {post.pull}
          </blockquote>

          {post.body.slice(half).map((p, i) => (
            <p key={i} className="body-muted mb-8 text-[17px]">
              {p}
            </p>
          ))}
        </div>

        <div className="mx-auto mt-20 flex max-w-[64ch] flex-wrap items-center justify-between gap-8 border-t border-rule pt-10">
          <Link href={`/journal/${next.slug}`} className="gold-link">
            {next.title} →
          </Link>
          <Link href="/book" className="smallcaps text-muted transition-colors hover:text-ink">
            {t("backToJournal")}
          </Link>
        </div>
      </article>
    </main>
  );
}

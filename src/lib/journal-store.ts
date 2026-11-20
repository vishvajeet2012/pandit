import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type JournalPost = {
  id: string;
  locale: "en" | "hi";
  slug: string;
  title: string;
  dek: string;
  read: string;
  body: string[];
  pull: string;
  coverUrl: string;
  published: boolean;
  updatedAt: string;
};

const FILE = path.join(process.cwd(), "data", "journal-posts.json");

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) throw new Error("Slug is empty. Use letters or numbers.");
  return slug;
}

async function seedFromMessages(): Promise<JournalPost[]> {
  const posts: JournalPost[] = [];
  for (const locale of ["en", "hi"] as const) {
    const raw = await readFile(path.join(process.cwd(), "messages", `${locale}.json`), "utf8");
    const parsed = JSON.parse(raw) as { journal: { posts: Omit<JournalPost, "id" | "locale" | "coverUrl" | "published" | "updatedAt">[] } };
    for (const post of parsed.journal.posts) {
      posts.push({
        id: randomUUID(),
        locale,
        slug: post.slug,
        title: post.title,
        dek: post.dek,
        read: post.read,
        body: post.body,
        pull: post.pull,
        coverUrl: "",
        published: true,
        updatedAt: "2026-11-20T00:00:00.000Z",
      });
    }
  }
  return posts;
}

async function readAll(): Promise<JournalPost[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as JournalPost[];
    if (!Array.isArray(parsed)) throw new Error("Journal file is not a list.");
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const seeded = await seedFromMessages();
    await writeAll(seeded);
    return seeded;
  }
}

async function writeAll(posts: JournalPost[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(posts, null, 2), "utf8");
}

function same(post: JournalPost, locale: string, slug: string) {
  return post.locale === locale && post.slug === slug;
}

export async function readAllPosts() {
  return readAll();
}

export async function listPosts(locale?: string) {
  const posts = await readAll();
  return posts
    .filter((post) => !locale || post.locale === locale)
    .map(({ id, locale: loc, slug, title, dek, read, coverUrl, published, updatedAt }) => ({
      id,
      locale: loc,
      slug,
      title,
      dek,
      read,
      coverUrl,
      published,
      updatedAt,
    }));
}

export async function getPost(locale: string, slug: string) {
  const post = (await readAll()).find((item) => same(item, locale, slug));
  if (!post) throw new Error(`No ${locale} post with slug "${slug}".`);
  return post;
}

export async function createPost(input: {
  locale?: "en" | "hi";
  title: string;
  slug?: string;
  dek: string;
  body: string;
  pull?: string;
  read?: string;
  coverUrl?: string;
  published?: boolean;
}) {
  const posts = await readAll();
  const locale = input.locale ?? "en";
  const slug = slugify(input.slug || input.title);
  if (posts.some((item) => same(item, locale, slug))) {
    throw new Error(`Slug "${slug}" already exists for ${locale}. Use update_post.`);
  }
  const body = input.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const post: JournalPost = {
    id: randomUUID(),
    locale,
    slug,
    title: input.title.trim(),
    dek: input.dek.trim(),
    read: input.read?.trim() || "6 min read",
    body,
    pull: input.pull?.trim() || body[0]?.slice(0, 140) || "",
    coverUrl: input.coverUrl?.trim() || "",
    published: input.published ?? true,
    updatedAt: new Date().toISOString(),
  };
  posts.unshift(post);
  await writeAll(posts);
  return post;
}

export async function updatePost(
  locale: string,
  slug: string,
  patch: Partial<Pick<JournalPost, "title" | "dek" | "read" | "pull" | "published" | "slug">> & { body?: string },
) {
  const posts = await readAll();
  const index = posts.findIndex((item) => same(item, locale, slug));
  if (index < 0) throw new Error(`No ${locale} post with slug "${slug}".`);
  const nextSlug = patch.slug ? slugify(patch.slug) : posts[index].slug;
  if (nextSlug !== slug && posts.some((item) => same(item, locale, nextSlug))) {
    throw new Error(`Slug "${nextSlug}" is already used for ${locale}.`);
  }
  const current = posts[index];
  posts[index] = {
    ...current,
    title: patch.title?.trim() || current.title,
    dek: patch.dek === undefined ? current.dek : patch.dek.trim(),
    read: patch.read?.trim() || current.read,
    pull: patch.pull === undefined ? current.pull : patch.pull.trim(),
    published: patch.published ?? current.published,
    slug: nextSlug,
    body: patch.body === undefined ? current.body : patch.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean),
    updatedAt: new Date().toISOString(),
  };
  await writeAll(posts);
  return posts[index];
}

export async function updateCover(locale: string, slug: string, coverUrl: string) {
  const posts = await readAll();
  const index = posts.findIndex((item) => same(item, locale, slug));
  if (index < 0) throw new Error(`No ${locale} post with slug "${slug}".`);
  posts[index] = { ...posts[index], coverUrl: coverUrl.trim(), updatedAt: new Date().toISOString() };
  await writeAll(posts);
  return posts[index];
}

export async function deletePost(locale: string, slug: string) {
  const posts = await readAll();
  const next = posts.filter((item) => !same(item, locale, slug));
  if (next.length === posts.length) throw new Error(`No ${locale} post with slug "${slug}".`);
  await writeAll(next);
  return { locale, slug, deleted: true };
}

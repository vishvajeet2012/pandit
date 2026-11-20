import { AsyncLocalStorage } from "node:async_hooks";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { createBlogRuleVersion, currentRules, getRuleVersion, listRuleVersions, updateBlogRules } from "@/lib/blog-rules";
import { createPost, deletePost, getPost, listPosts, readAllPosts, updateCover, updatePost } from "@/lib/journal-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_EMAIL = "vishvajeet4711@gmail.com";
const FALLBACK_PASSWORD = "12345678";
const authStore = new AsyncLocalStorage<{ ok: boolean }>();

function mcpEmail() {
  return process.env.BLOG_MCP_EMAIL || FALLBACK_EMAIL;
}

function mcpPassword() {
  return process.env.BLOG_MCP_PASSWORD || FALLBACK_PASSWORD;
}

function authorized(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
  const splitAt = decoded.indexOf(":");
  if (splitAt < 0) return false;
  return decoded.slice(0, splitAt) === mcpEmail() && decoded.slice(splitAt + 1) === mcpPassword();
}

function assertWriter() {
  if (!authStore.getStore()?.ok) {
    throw new Error("Unauthorized. Send Authorization: Basic with the blog email and password.");
  }
}

function text(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

const locale = z.enum(["en", "hi"]).optional();

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "blog_rules",
      {
        title: "Blog rules",
        description: "Active journal rules, version, and author. Call this before writing.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      async () => text(await currentRules()),
    );
    server.registerTool(
      "list_rule_versions",
      {
        title: "List rule versions",
        description: "Every journal rule version and who wrote it.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      async () => text(await listRuleVersions()),
    );
    server.registerTool(
      "get_rule_version",
      {
        title: "Get rule version",
        description: "One numbered rule version.",
        inputSchema: z.object({ version: z.number().int().positive() }),
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      async ({ version }) => text(await getRuleVersion(version)),
    );
    server.registerTool(
      "update_blog_rules",
      {
        title: "Edit active rules",
        description: "Replace the current rule text. editorName is who edited it.",
        inputSchema: z.object({ rules: z.string().min(1), editorName: z.string().min(1), note: z.string().optional() }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async (input) => {
        assertWriter();
        return text(await updateBlogRules(input));
      },
    );
    server.registerTool(
      "create_blog_rule_version",
      {
        title: "New rule version",
        description: "Save a new rule version and make it active. authorName is who created it.",
        inputSchema: z.object({ rules: z.string().min(1), authorName: z.string().min(1), note: z.string().optional() }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      },
      async (input) => {
        assertWriter();
        return text(await createBlogRuleVersion(input));
      },
    );
    server.registerTool(
      "read_all_posts",
      {
        title: "Read all posts",
        description: "Every journal post in English and Hindi, including drafts.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      async () => text(await readAllPosts()),
    );
    server.registerTool(
      "list_posts",
      {
        title: "List posts",
        description: "Short list. Pass locale en or hi, or omit it for both.",
        inputSchema: z.object({ locale }),
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      async ({ locale: loc }) => text(await listPosts(loc)),
    );
    server.registerTool(
      "get_post",
      {
        title: "Get post",
        description: "One post by locale and slug.",
        inputSchema: z.object({ locale: z.enum(["en", "hi"]), slug: z.string().min(1) }),
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      async ({ locale: loc, slug }) => text(await getPost(loc, slug)),
    );
    server.registerTool(
      "create_post",
      {
        title: "Create post",
        description: "Add a journal post. locale is en or hi. Body paragraphs are separated by a blank line.",
        inputSchema: z.object({
          locale,
          title: z.string().min(1),
          slug: z.string().min(1).optional(),
          dek: z.string().min(1),
          body: z.string().min(1),
          pull: z.string().optional(),
          read: z.string().optional(),
          coverUrl: z.string().optional(),
          published: z.boolean().optional(),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      },
      async (input) => {
        assertWriter();
        return text(await createPost(input));
      },
    );
    server.registerTool(
      "update_post",
      {
        title: "Update post",
        description: "Edit one locale and slug. Send only the fields that should change.",
        inputSchema: z.object({
          locale: z.enum(["en", "hi"]),
          slug: z.string().min(1),
          title: z.string().min(1).optional(),
          newSlug: z.string().min(1).optional(),
          dek: z.string().optional(),
          body: z.string().optional(),
          pull: z.string().optional(),
          read: z.string().optional(),
          published: z.boolean().optional(),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ locale: loc, slug, newSlug, ...patch }) => {
        assertWriter();
        return text(await updatePost(loc, slug, { ...patch, slug: newSlug }));
      },
    );
    server.registerTool(
      "update_cover",
      {
        title: "Update cover",
        description: "Replace only the cover URL for one locale and slug.",
        inputSchema: z.object({
          locale: z.enum(["en", "hi"]),
          slug: z.string().min(1),
          coverUrl: z.string().min(1),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ locale: loc, slug, coverUrl }) => {
        assertWriter();
        return text(await updateCover(loc, slug, coverUrl));
      },
    );
    server.registerTool(
      "delete_post",
      {
        title: "Delete post",
        description: "Delete one journal post by locale and slug.",
        inputSchema: z.object({ locale: z.enum(["en", "hi"]), slug: z.string().min(1) }),
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      },
      async ({ locale: loc, slug }) => {
        assertWriter();
        return text(await deletePost(loc, slug));
      },
    );
  },
  {
    serverInfo: { name: "acharya-journal", version: "1.0.0" },
    instructions:
      "You edit the journal on acharyakrishnakant.com. Call blog_rules, then read_all_posts, before writing. Posts are locale plus slug. Follow the active rule version. Writes need Authorization: Basic.",
  },
);

async function handle(request: Request) {
  if (!authorized(request)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="acharya-journal"' },
    });
  }
  return authStore.run({ ok: true }, () => handler(request));
}

export { handle as GET, handle as POST, handle as DELETE };

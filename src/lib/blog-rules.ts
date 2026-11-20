import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type BlogRuleVersion = {
  id: string;
  version: number;
  rules: string;
  authorName: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

type RuleFile = { currentVersion: number; versions: BlogRuleVersion[] };

const FILE = path.join(process.cwd(), "data", "blog-rules.json");

const FIRST_RULES = `1. The writer is the voice of this practice: calm, plain, and specific. No scare language.
2. Write the post in the locale you were given. English posts use locale en. Hindi posts use locale hi.
3. A graha is timing, not a verdict and not a curse. Do not promise an outcome or name a year of death.
4. Do not tell the reader to buy a stone, a locket, or a ritual.
5. Do not invent a client, a review, a quote, or a number.
6. Do not publish birth details, a phone number, or a private sitting.
7. One post, one idea. A new post needs title, dek, and body. Body paragraphs are separated by a blank line.
8. Do not change an existing slug unless asked. Delete only when that locale and slug were named.
9. update_post changes only the fields you send. update_cover changes only the cover URL.
10. After a write, call get_post and confirm the title and dek.`;

function seed(): RuleFile {
  const now = "2026-11-20T00:00:00.000Z";
  return {
    currentVersion: 1,
    versions: [
      {
        id: "rule-v1",
        version: 1,
        rules: FIRST_RULES,
        authorName: "Acharya Krishna Kant",
        note: "First journal rules",
        createdAt: now,
        updatedAt: now,
        updatedBy: "Acharya Krishna Kant",
      },
    ],
  };
}

async function readStore(): Promise<RuleFile> {
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as RuleFile;
    if (!parsed.versions?.length) throw new Error("No blog rule versions.");
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const initial = seed();
    await writeStore(initial);
    return initial;
  }
}

async function writeStore(data: RuleFile) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function currentRules() {
  const data = await readStore();
  const current = data.versions.find((item) => item.version === data.currentVersion);
  if (!current) throw new Error("Current blog rule version is missing.");
  return current;
}

export async function listRuleVersions() {
  const data = await readStore();
  return data.versions
    .slice()
    .sort((a, b) => b.version - a.version)
    .map((item) => ({
      version: item.version,
      authorName: item.authorName,
      note: item.note,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      updatedBy: item.updatedBy,
      current: item.version === data.currentVersion,
    }));
}

export async function getRuleVersion(version: number) {
  const data = await readStore();
  const found = data.versions.find((item) => item.version === version);
  if (!found) throw new Error(`No blog rule version ${version}.`);
  return { ...found, current: found.version === data.currentVersion };
}

export async function updateBlogRules(input: { rules: string; editorName: string; note?: string }) {
  const rules = input.rules.trim();
  const editorName = input.editorName.trim();
  if (!rules || !editorName) throw new Error("Rules text and editor name are required.");
  const data = await readStore();
  const index = data.versions.findIndex((item) => item.version === data.currentVersion);
  if (index < 0) throw new Error("Current blog rule version is missing.");
  data.versions[index] = {
    ...data.versions[index],
    rules,
    note: input.note?.trim() || data.versions[index].note,
    updatedAt: new Date().toISOString(),
    updatedBy: editorName,
  };
  await writeStore(data);
  return { ...data.versions[index], current: true };
}

export async function createBlogRuleVersion(input: { rules: string; authorName: string; note?: string }) {
  const rules = input.rules.trim();
  const authorName = input.authorName.trim();
  if (!rules || !authorName) throw new Error("Rules text and author name are required.");
  const data = await readStore();
  const now = new Date().toISOString();
  const created: BlogRuleVersion = {
    id: randomUUID(),
    version: Math.max(...data.versions.map((item) => item.version)) + 1,
    rules,
    authorName,
    note: input.note?.trim() || "",
    createdAt: now,
    updatedAt: now,
    updatedBy: authorName,
  };
  data.versions.push(created);
  data.currentVersion = created.version;
  await writeStore(data);
  return { ...created, current: true };
}

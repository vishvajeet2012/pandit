import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { site } from "@/config/site";

export type ConsultationRequest = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  tob: string;
  pob: string;
  reading: string;
  question: string;
  locale: string;
  receivedAt: string;
};

const STORE = path.join(process.cwd(), ".data", "requests.jsonl");

/**
 * Where a consultation request goes.
 *
 * With RESEND_API_KEY set it is emailed to the practice. Without it — and
 * always, as a record — the request is appended to .data/requests.jsonl, which
 * is gitignored. On a read-only filesystem the write is skipped rather than
 * failing the submission.
 */
export async function deliverRequest(request: ConsultationRequest): Promise<void> {
  await Promise.allSettled([appendToFile(request), emailRequest(request)]);
}

async function appendToFile(request: ConsultationRequest) {
  try {
    await fs.mkdir(path.dirname(STORE), { recursive: true });
    await fs.appendFile(STORE, JSON.stringify(request) + "\n", "utf8");
  } catch {
    // read-only filesystem (most hosts) — the email is the real delivery
  }
}

async function emailRequest(request: ConsultationRequest) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const to = process.env.CONSULTATION_INBOX ?? site.email;
  const from = process.env.CONSULTATION_FROM ?? "VISH <onboarding@resend.dev>";

  const lines = [
    `Name:      ${request.name}`,
    `Email:     ${request.email}`,
    `Phone:     ${request.phone || "—"}`,
    `Born:      ${request.dob} ${request.tob || "(time not given)"}`,
    `Place:     ${request.pob}`,
    `Reading:   ${request.reading}`,
    `Language:  ${request.locale}`,
    "",
    request.question,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: request.email,
      subject: `Consultation request — ${request.name}`,
      text: lines,
    }),
  });

  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

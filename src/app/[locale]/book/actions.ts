"use server";

import { deliverRequest, type ConsultationRequest } from "@/lib/requests";
import type { BookingState } from "@/lib/booking";

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function submitBooking(
  _prev: BookingState,
  form: FormData
): Promise<BookingState> {
  const request: ConsultationRequest = {
    name: str(form, "name"),
    email: str(form, "email"),
    phone: str(form, "phone"),
    dob: str(form, "dob"),
    tob: str(form, "tob"),
    pob: str(form, "pob"),
    reading: str(form, "reading"),
    question: str(form, "question"),
    locale: str(form, "locale") || "en",
    receivedAt: new Date().toISOString(),
  };

  const errors: BookingState["errors"] = {};
  for (const key of ["name", "email", "dob", "pob", "question"] as const) {
    if (!request[key]) errors[key] = "required";
  }
  if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(request.email)) {
    errors.email = "email";
  }

  // a hidden field no person fills in
  if (str(form, "company")) return { status: "sent", errors: {} };

  if (Object.keys(errors).length) return { status: "idle", errors };

  try {
    await deliverRequest(request);
    return { status: "sent", errors: {} };
  } catch {
    return { status: "error", errors: {} };
  }
}

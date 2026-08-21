"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitBooking } from "@/app/[locale]/book/actions";
import { EMPTY_BOOKING } from "@/lib/booking";

const FIELD = "w-full border-b border-rule bg-transparent pb-3 pt-2 text-[16px] text-ink outline-none transition-colors duration-500 focus:border-gold placeholder:text-muted/50";

export default function BookingForm() {
  const t = useTranslations("book");
  const work = useTranslations("work");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitBooking, EMPTY_BOOKING);

  const readings = work.raw("items") as { title: string }[];
  const err = (key: string) =>
    state.errors[key] ? t(`errors.${state.errors[key]}`) : null;

  if (state.status === "sent") {
    return (
      <div className="mt-16 max-w-[52ch]">
        <p className="display text-[clamp(26px,3vw,40px)]">{t("successTitle")}</p>
        <p className="body-muted mt-6">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-16 max-w-[860px]">
      <input type="hidden" name="locale" value={locale} />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
        <Field label={t("fields.name")} error={err("name")}>
          <input name="name" required className={FIELD} autoComplete="name" />
        </Field>

        <Field label={t("fields.email")} error={err("email")}>
          <input name="email" type="email" required className={FIELD} autoComplete="email" />
        </Field>

        <Field label={t("fields.phone")}>
          <input name="phone" className={FIELD} autoComplete="tel" />
        </Field>

        <Field label={t("fields.reading")}>
          <select name="reading" className={FIELD} defaultValue="">
            <option value="">{t("readingUnsure")}</option>
            {readings.map((r) => (
              <option key={r.title} value={r.title}>
                {r.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("fields.dob")} error={err("dob")}>
          <input name="dob" type="date" required className={FIELD} />
        </Field>

        <Field label={t("fields.tob")} help={t("help.tob")}>
          <input name="tob" type="time" className={FIELD} />
        </Field>

        <div className="sm:col-span-2">
          <Field label={t("fields.pob")} help={t("help.pob")} error={err("pob")}>
            <input name="pob" required className={FIELD} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label={t("fields.question")} help={t("help.question")} error={err("question")}>
            <textarea name="question" required rows={4} className={`${FIELD} resize-none`} />
          </Field>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-8">
        <button
          type="submit"
          disabled={pending}
          className="flex h-[54px] items-center rounded-full bg-gold px-10 text-[13px] font-medium tracking-[0.08em] text-ink transition-opacity duration-500 disabled:opacity-50"
        >
          {pending ? t("sending") : t("submit")}
        </button>
        <p className="smallcaps max-w-[38ch] text-muted">{t("privacyNote")}</p>
      </div>

      {state.status === "error" && (
        <p className="mt-8 text-[15px] text-[#9d3b30]">{t("errors.generic")}</p>
      )}
    </form>
  );
}

function Field({
  label,
  help,
  error,
  children,
}: {
  label: string;
  help?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="smallcaps text-muted">{label}</span>
      <span className="mt-3 block">{children}</span>
      {help && <span className="mt-3 block text-[13px] leading-relaxed text-muted/80">{help}</span>}
      {error && <span className="mt-3 block text-[13px] text-[#9d3b30]">{error}</span>}
    </label>
  );
}

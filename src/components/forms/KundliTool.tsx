"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import KundliChart, { type HouseContent } from "@/components/site/KundliChart";
import RashiGlyph, { RASHIS } from "@/components/site/RashiGlyph";
import { PLACES, TZ_OFFSETS, formatOffset } from "@/config/places";
import {
  natalChart,
  vimshottari,
  GRAHA_NAMES,
  NAKSHATRA_NAMES,
  RASHI_NAMES,
  type Chart,
} from "@/lib/jyotish";

const FIELD =
  "w-full border-b border-rule bg-transparent pb-3 pt-2 text-[16px] text-ink outline-none transition-colors duration-500 focus:border-gold";

export default function KundliTool() {
  const t = useTranslations("kundli");
  const locale = useLocale();
  const hi = locale === "hi";

  const [date, setDate] = useState("1984-03-15");
  const [time, setTime] = useState("07:20");
  const [placeId, setPlaceId] = useState("jaipur");
  const [lat, setLat] = useState("26.9124");
  const [lon, setLon] = useState("75.7873");
  const [tz, setTz] = useState(330);
  const [chart, setChart] = useState<Chart | null>(null);
  const [birth, setBirth] = useState<Date | null>(null);
  const [now, setNow] = useState(0);

  const custom = placeId === "custom";
  const place = PLACES.find((p) => p.id === placeId);

  const draw = (e: React.FormEvent) => {
    e.preventDefault();
    const latitude = custom ? Number(lat) : (place?.lat ?? 0);
    const longitude = custom ? Number(lon) : (place?.lon ?? 0);
    const offset = custom ? tz : (place?.tz ?? 0);

    // the entered wall-clock time, carried back to UTC
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = (time || "12:00").split(":").map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d, hh, mm) - offset * 60000);

    setBirth(utc);
    setNow(Date.now());
    setChart(natalChart(utc, latitude, longitude));
  };

  const houses: HouseContent[] | undefined = useMemo(() => {
    if (!chart) return undefined;
    return Array.from({ length: 12 }, (_, i) => {
      const rashi = ((chart.lagna.rashi + i) % 12) + 1;
      return {
        rashi,
        grahas: chart.placements
          .filter((p) => p.house === i + 1)
          .map((p) => GRAHA_NAMES[p.graha][hi ? 3 : 2] + (p.retrograde ? "·R" : "")),
      };
    });
  }, [chart, hi]);

  const dasha = useMemo(
    () => (chart && birth ? vimshottari(chart, birth, 9) : []),
    [chart, birth]
  );

  const fmtDate = new Intl.DateTimeFormat(hi ? "hi-IN" : "en-GB", {
    year: "numeric",
    month: "short",
  });

  return (
    <div className="act">
      <form onSubmit={draw} className="mt-16 max-w-[860px]">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="smallcaps text-muted">{t("fields.date")}</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`mt-3 ${FIELD}`}
            />
          </label>

          <label className="block">
            <span className="smallcaps text-muted">{t("fields.time")}</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className={`mt-3 ${FIELD}`}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="smallcaps text-muted">{t("fields.place")}</span>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className={`mt-3 ${FIELD}`}
            >
              {PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {hi ? p.deva : p.name}
                </option>
              ))}
              <option value="custom">{t("customPlace")}</option>
            </select>
          </label>

          {custom && (
            <>
              <label className="block">
                <span className="smallcaps text-muted">{t("fields.lat")}</span>
                <input value={lat} onChange={(e) => setLat(e.target.value)} className={`mt-3 ${FIELD}`} />
              </label>
              <label className="block">
                <span className="smallcaps text-muted">{t("fields.lon")}</span>
                <input value={lon} onChange={(e) => setLon(e.target.value)} className={`mt-3 ${FIELD}`} />
              </label>
              <label className="block sm:col-span-2">
                <span className="smallcaps text-muted">{t("fields.tz")}</span>
                <select
                  value={tz}
                  onChange={(e) => setTz(Number(e.target.value))}
                  className={`mt-3 ${FIELD}`}
                >
                  {TZ_OFFSETS.map((o) => (
                    <option key={o} value={o}>
                      {formatOffset(o)}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>

        <button
          type="submit"
          className="mt-14 flex h-[54px] items-center rounded-full bg-gold px-10 text-[13px] font-medium tracking-[0.08em] text-ink"
        >
          {t("submit")}
        </button>
      </form>

      {chart && (
        <div className="mt-28">
          {/* the two facts that matter first */}
          <div className="grid gap-10 border-t border-rule pt-10 sm:grid-cols-3">
            <div>
              <p className="smallcaps text-muted">{t("result.lagna")}</p>
              <p className="display mt-4 flex items-baseline gap-3 text-[clamp(22px,2.2vw,30px)] leading-none">
                <RashiGlyph
                  sign={RASHIS[chart.lagna.rashi]}
                  className="h-6 w-6 shrink-0 self-center text-gold"
                  strokeWidth={2.4}
                />
                {RASHI_NAMES[chart.lagna.rashi][hi ? 1 : 0]}
              </p>
              <p className="deva mt-3">{chart.lagna.degreeInRashi.toFixed(2)}°</p>
            </div>
            <div>
              <p className="smallcaps text-muted">{t("result.moon")}</p>
              <p className="display mt-4 text-[clamp(22px,2.2vw,30px)] leading-none">
                {NAKSHATRA_NAMES[chart.moonNakshatra.index - 1][hi ? 1 : 0]}
              </p>
              <p className="deva mt-3">
                {t("result.pada")} {chart.moonNakshatra.pada}
              </p>
            </div>
            <div>
              <p className="smallcaps text-muted">{t("result.ayanamsha")}</p>
              <p className="display mt-4 text-[clamp(22px,2.2vw,30px)] leading-none">
                {chart.ayanamsha.toFixed(3)}°
              </p>
              <p className="deva mt-3">Lahiri</p>
            </div>
          </div>

          <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-[6%]">
            {/* the chart */}
            <div className="lg:col-span-5">
              <p className="smallcaps mb-8 text-gold">{t("result.chart")}</p>
              <KundliChart className="w-full max-w-[440px]" houses={houses} play />
            </div>

            {/* the grahas */}
            <div className="lg:col-span-7">
              <p className="smallcaps mb-8 text-gold">{t("result.grahas")}</p>
              <div className="border-t border-rule">
                <div className="grid grid-cols-12 gap-4 border-b border-rule py-3">
                  <span className="smallcaps col-span-3 text-muted">{t("result.colGraha")}</span>
                  <span className="smallcaps col-span-3 text-muted">{t("result.colRashi")}</span>
                  <span className="smallcaps col-span-2 text-muted">{t("result.colDegree")}</span>
                  <span className="smallcaps col-span-1 text-muted">{t("result.colHouse")}</span>
                  <span className="smallcaps col-span-3 text-muted">{t("result.colNakshatra")}</span>
                </div>
                {chart.placements.map((p) => (
                  <div key={p.graha} className="grid grid-cols-12 items-baseline gap-4 border-b border-rule py-4">
                    <span className="col-span-3 text-[15px]">
                      {GRAHA_NAMES[p.graha][hi ? 1 : 0]}
                      {p.retrograde && (
                        <span className="smallcaps ml-2 text-gold">{t("result.retro")}</span>
                      )}
                    </span>
                    <span className="col-span-3 text-[15px] text-muted">
                      {RASHI_NAMES[p.rashi][hi ? 1 : 0]}
                    </span>
                    <span className="col-span-2 text-[15px] text-muted tabular-nums">
                      {p.degreeInRashi.toFixed(2)}°
                    </span>
                    <span className="col-span-1 text-[15px] text-muted tabular-nums">{p.house}</span>
                    <span className="col-span-3 text-[15px] text-muted">
                      {NAKSHATRA_NAMES[p.nakshatra - 1][hi ? 1 : 0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* the dasha sequence */}
          <div className="mt-24">
            <p className="smallcaps mb-8 text-gold">{t("result.dasha")}</p>
            <div className="border-t border-rule">
              {dasha.map((d) => {
                const running = d.start.getTime() <= now && now < d.end.getTime();
                return (
                  <div
                    key={d.graha + d.start.toISOString()}
                    className="grid grid-cols-12 items-center gap-4 border-b border-rule py-4"
                  >
                    <span className={`col-span-3 text-[15px] ${running ? "text-ink" : "text-muted"}`}>
                      {GRAHA_NAMES[d.graha][hi ? 1 : 0]}
                    </span>
                    <span className="col-span-4 text-[14px] text-muted tabular-nums">
                      {fmtDate.format(d.start)} — {fmtDate.format(d.end)}
                    </span>
                    <span className="col-span-2 text-[14px] text-muted tabular-nums">
                      {d.years}
                    </span>
                    <span className="col-span-3">
                      <span
                        className="block h-px w-full"
                        style={{ background: running ? "#c5a46e" : "#e8dfd0" }}
                      />
                      {running && (
                        <span className="smallcaps mt-2 block text-gold">{t("result.current")}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center gap-10">
            <Link
              href="/book"
              className="flex h-[54px] items-center rounded-full bg-gold px-10 text-[13px] font-medium tracking-[0.08em] text-ink"
            >
              {t("cta")}
            </Link>
            <button
              type="button"
              onClick={() => setChart(null)}
              className="gold-link"
            >
              {t("reset")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

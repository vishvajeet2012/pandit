/**
 * A small sidereal ephemeris — enough for a panchang and a natal chart, and
 * honest about what it is.
 *
 * Sun and Moon follow Meeus (Astronomical Algorithms, ch. 25 and 47, truncated
 * series); the five visible planets use the JPL approximate elements valid
 * 1800–2050; Rahu is the mean lunar node. Sidereal longitudes use a linear
 * Lahiri ayanamsha. Expect a few arc-minutes of error — right for a chart you
 * read, not for an eclipse you time.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const sin = (deg: number) => Math.sin(deg * D2R);
const cos = (deg: number) => Math.cos(deg * D2R);
const tan = (deg: number) => Math.tan(deg * D2R);

/** Julian Day from a JS Date (which is always UTC underneath). */
export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

const centuries = (jd: number) => (jd - 2451545) / 36525;

/** Apparent geocentric longitude of the Sun, tropical, in degrees. */
export function sunLongitude(jd: number): number {
  const T = centuries(jd);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M);
  const omega = 125.04 - 1934.136 * T;
  return norm360(L0 + C - 0.00569 - 0.00478 * sin(omega));
}

/** Geocentric longitude of the Moon, tropical, in degrees (~0.02°). */
export function moonLongitude(jd: number): number {
  const T = centuries(jd);
  const Lp =
    218.3164477 +
    481267.88123421 * T -
    0.0015786 * T * T +
    (T * T * T) / 538841 -
    (T * T * T * T) / 65194000;
  const D =
    297.8501921 +
    445267.1114034 * T -
    0.0018819 * T * T +
    (T * T * T) / 545868 -
    (T * T * T * T) / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000;
  const Mp =
    134.9633964 +
    477198.8675055 * T +
    0.0087414 * T * T +
    (T * T * T) / 69699 -
    (T * T * T * T) / 14712000;
  const F =
    93.272095 +
    483202.0175233 * T -
    0.0036539 * T * T -
    (T * T * T) / 3526000 +
    (T * T * T * T) / 863310000;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  // [coefficient, D, M, M', F, power of E]
  const terms: [number, number, number, number, number, number][] = [
    [6.288774, 0, 0, 1, 0, 0],
    [1.274027, 2, 0, -1, 0, 0],
    [0.658314, 2, 0, 0, 0, 0],
    [0.213618, 0, 0, 2, 0, 0],
    [-0.185116, 0, 1, 0, 0, 1],
    [-0.114332, 0, 0, 0, 2, 0],
    [0.058793, 2, 0, -2, 0, 0],
    [0.057066, 2, -1, -1, 0, 1],
    [0.053322, 2, 0, 1, 0, 0],
    [0.045758, 2, -1, 0, 0, 1],
    [-0.040923, 0, 1, -1, 0, 1],
    [-0.03472, 1, 0, 0, 0, 0],
    [-0.030383, 0, 1, 1, 0, 1],
    [0.015327, 2, 0, 0, -2, 0],
    [-0.012528, 0, 0, 1, 2, 0],
    [0.01098, 0, 0, 1, -2, 0],
    [0.010675, 4, 0, -1, 0, 0],
    [0.010034, 0, 0, 3, 0, 0],
    [0.008548, 4, 0, -2, 0, 0],
    [-0.007888, 2, 1, -1, 0, 1],
    [-0.006766, 2, 1, 0, 0, 1],
    [-0.005163, 1, 0, -1, 0, 0],
    [0.004987, 1, 1, 0, 0, 1],
    [0.004036, 2, -1, 1, 0, 1],
    [0.003994, 2, 0, 2, 0, 0],
    [0.003861, 4, 0, 0, 0, 0],
    [0.003665, 2, 0, -3, 0, 0],
    [-0.002689, 0, 1, -2, 0, 1],
    [-0.002602, 2, 0, -1, 2, 0],
    [0.002390, 2, -1, -2, 0, 1],
    [-0.002348, 1, 0, 1, 0, 0],
    [0.002236, 2, -2, 0, 0, 2],
    [-0.002120, 0, 1, 2, 0, 1],
    [-0.002069, 0, 2, 0, 0, 2],
    [0.002048, 2, -2, -1, 0, 2],
    [-0.001773, 2, 0, 1, -2, 0],
    [-0.001595, 2, 0, 0, 2, 0],
    [0.001215, 4, -1, -1, 0, 1],
    [-0.001110, 0, 0, 2, 2, 0],
  ];

  let sum = 0;
  for (const [coef, cD, cM, cMp, cF, ePow] of terms) {
    const arg = cD * D + cM * M + cMp * Mp + cF * F;
    sum += coef * Math.pow(E, ePow) * sin(arg);
  }

  return norm360(Lp + sum);
}

/** Mean longitude of the ascending lunar node (Rahu), tropical, in degrees. */
export function rahuLongitude(jd: number): number {
  const T = centuries(jd);
  return norm360(
    125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441
  );
}

/** JPL approximate elements, valid 1800–2050. */
type Elements = {
  a: number; e: number; i: number; L: number; peri: number; node: number;
  da: number; de: number; di: number; dL: number; dperi: number; dnode: number;
};

const PLANET_ELEMENTS: Record<string, Elements> = {
  mercury: { a: 0.38709927, e: 0.20563593, i: 7.00497902, L: 252.2503235, peri: 77.45779628, node: 48.33076593, da: 0.00000037, de: 0.00001906, di: -0.00594749, dL: 149472.67411175, dperi: 0.16047689, dnode: -0.12534081 },
  venus: { a: 0.72333566, e: 0.00677672, i: 3.39467605, L: 181.9790995, peri: 131.60246718, node: 76.67984255, da: 0.0000039, de: -0.00004107, di: -0.0007889, dL: 58517.81538729, dperi: 0.00268329, dnode: -0.27769418 },
  earth: { a: 1.00000261, e: 0.01671123, i: -0.00001531, L: 100.46457166, peri: 102.93768193, node: 0, da: 0.00000562, de: -0.00004392, di: -0.01294668, dL: 35999.37244981, dperi: 0.32327364, dnode: 0 },
  mars: { a: 1.52371034, e: 0.0933941, i: 1.84969142, L: -4.55343205, peri: -23.94362959, node: 49.55953891, da: 0.00001847, de: 0.00007882, di: -0.00813131, dL: 19140.30268499, dperi: 0.44441088, dnode: -0.29257343 },
  jupiter: { a: 5.202887, e: 0.04838624, i: 1.30439695, L: 34.39644051, peri: 14.72847983, node: 100.47390909, da: -0.00011607, de: -0.00013253, di: -0.00183714, dL: 3034.74612775, dperi: 0.21252668, dnode: 0.20469106 },
  saturn: { a: 9.53667594, e: 0.05386179, i: 2.48599187, L: 49.95424423, peri: 92.59887831, node: 113.66242448, da: -0.0012506, de: -0.00050991, di: 0.00193609, dL: 1222.49362201, dperi: -0.41897216, dnode: -0.28867794 },
};

/** Heliocentric ecliptic rectangular coordinates, in AU. */
function heliocentric(el: Elements, T: number): [number, number, number] {
  const a = el.a + el.da * T;
  const e = el.e + el.de * T;
  const i = el.i + el.di * T;
  const L = el.L + el.dL * T;
  const peri = el.peri + el.dperi * T;
  const node = el.node + el.dnode * T;

  const argPeri = peri - node;
  let M = norm360(L - peri);
  if (M > 180) M -= 360;

  // Kepler, Newton–Raphson in radians
  const Mr = M * D2R;
  let E = Mr + e * Math.sin(Mr);
  for (let n = 0; n < 12; n++) {
    const dE = (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-11) break;
  }

  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cosNode = cos(node), sinNode = sin(node);
  const cosPeri = cos(argPeri), sinPeri = sin(argPeri);
  const cosI = cos(i), sinI = sin(i);

  const x = (cosPeri * cosNode - sinPeri * sinNode * cosI) * xv + (-sinPeri * cosNode - cosPeri * sinNode * cosI) * yv;
  const y = (cosPeri * sinNode + sinPeri * cosNode * cosI) * xv + (-sinPeri * sinNode + cosPeri * cosNode * cosI) * yv;
  const z = sinPeri * sinI * xv + cosPeri * sinI * yv;
  return [x, y, z];
}

/** Geocentric tropical longitude of a planet, in degrees. */
export function planetLongitude(planet: keyof typeof PLANET_ELEMENTS, jd: number): number {
  const T = centuries(jd);
  const [px, py, pz] = heliocentric(PLANET_ELEMENTS[planet], T);
  const [ex, ey, ez] = heliocentric(PLANET_ELEMENTS.earth, T);
  const x = px - ex, y = py - ey, z = pz - ez;
  void z;
  return norm360(Math.atan2(y, x) * R2D);
}

/** Lahiri ayanamsha, linear about J2000 (23°51'11" drifting ~50.29"/yr). */
export function ayanamsha(jd: number): number {
  return 23.8531 + ((jd - 2451545) / 365.25) * (50.2888 / 3600);
}

/** Greenwich mean sidereal time in degrees. */
function gmst(jd: number): number {
  const T = centuries(jd);
  return norm360(
    280.46061837 +
      360.98564736629 * (jd - 2451545) +
      0.000387933 * T * T -
      (T * T * T) / 38710000
  );
}

/** Tropical longitude of the rising degree, in degrees. */
export function ascendant(jd: number, latitude: number, longitude: number): number {
  const T = centuries(jd);
  const eps = 23.439291 - 0.0130042 * T;
  const ramc = norm360(gmst(jd) + longitude);
  const y = cos(ramc);
  const x = -(sin(ramc) * cos(eps) + tan(latitude) * sin(eps));
  return norm360(Math.atan2(y, x) * R2D);
}

/* ——— naming ——— */

export const RASHI_NAMES = [
  ["Mesha", "मेष"], ["Vrishabha", "वृषभ"], ["Mithuna", "मिथुन"], ["Karka", "कर्क"],
  ["Simha", "सिंह"], ["Kanya", "कन्या"], ["Tula", "तुला"], ["Vrishchika", "वृश्चिक"],
  ["Dhanu", "धनु"], ["Makara", "मकर"], ["Kumbha", "कुम्भ"], ["Meena", "मीन"],
] as const;

export const NAKSHATRA_NAMES = [
  ["Ashwini", "अश्विनी"], ["Bharani", "भरणी"], ["Krittika", "कृत्तिका"], ["Rohini", "रोहिणी"],
  ["Mrigashira", "मृगशिरा"], ["Ardra", "आर्द्रा"], ["Punarvasu", "पुनर्वसु"], ["Pushya", "पुष्य"],
  ["Ashlesha", "आश्लेषा"], ["Magha", "मघा"], ["Purva Phalguni", "पूर्व फाल्गुनी"], ["Uttara Phalguni", "उत्तर फाल्गुनी"],
  ["Hasta", "हस्त"], ["Chitra", "चित्रा"], ["Swati", "स्वाति"], ["Vishakha", "विशाखा"],
  ["Anuradha", "अनुराधा"], ["Jyeshtha", "ज्येष्ठा"], ["Mula", "मूल"], ["Purva Ashadha", "पूर्वाषाढ़ा"],
  ["Uttara Ashadha", "उत्तराषाढ़ा"], ["Shravana", "श्रवण"], ["Dhanishtha", "धनिष्ठा"], ["Shatabhisha", "शतभिषा"],
  ["Purva Bhadrapada", "पूर्व भाद्रपद"], ["Uttara Bhadrapada", "उत्तर भाद्रपद"], ["Revati", "रेवती"],
] as const;

export const YOGA_NAMES = [
  ["Vishkambha", "विष्कम्भ"], ["Priti", "प्रीति"], ["Ayushman", "आयुष्मान्"], ["Saubhagya", "सौभाग्य"],
  ["Shobhana", "शोभन"], ["Atiganda", "अतिगण्ड"], ["Sukarman", "सुकर्मा"], ["Dhriti", "धृति"],
  ["Shula", "शूल"], ["Ganda", "गण्ड"], ["Vriddhi", "वृद्धि"], ["Dhruva", "ध्रुव"],
  ["Vyaghata", "व्याघात"], ["Harshana", "हर्षण"], ["Vajra", "वज्र"], ["Siddhi", "सिद्धि"],
  ["Vyatipata", "व्यतीपात"], ["Variyan", "वरीयान्"], ["Parigha", "परिघ"], ["Shiva", "शिव"],
  ["Siddha", "सिद्ध"], ["Sadhya", "साध्य"], ["Shubha", "शुभ"], ["Shukla", "शुक्ल"],
  ["Brahma", "ब्रह्म"], ["Indra", "इन्द्र"], ["Vaidhriti", "वैधृति"],
] as const;

export const TITHI_NAMES = [
  ["Pratipada", "प्रतिपदा"], ["Dwitiya", "द्वितीया"], ["Tritiya", "तृतीया"], ["Chaturthi", "चतुर्थी"],
  ["Panchami", "पञ्चमी"], ["Shashthi", "षष्ठी"], ["Saptami", "सप्तमी"], ["Ashtami", "अष्टमी"],
  ["Navami", "नवमी"], ["Dashami", "दशमी"], ["Ekadashi", "एकादशी"], ["Dwadashi", "द्वादशी"],
  ["Trayodashi", "त्रयोदशी"], ["Chaturdashi", "चतुर्दशी"], ["Purnima", "पूर्णिमा"],
] as const;

export const KARANA_NAMES = [
  ["Bava", "बव"], ["Balava", "बालव"], ["Kaulava", "कौलव"], ["Taitila", "तैतिल"],
  ["Gara", "गर"], ["Vanija", "वणिज"], ["Vishti", "विष्टि"], ["Shakuni", "शकुनि"],
  ["Chatushpada", "चतुष्पद"], ["Naga", "नाग"], ["Kimstughna", "किंस्तुघ्न"],
] as const;

/** [name, Devanagari name, Latin short, Devanagari short] */
export const GRAHA_NAMES = {
  sun: ["Sun", "सूर्य", "Su", "सू"],
  moon: ["Moon", "चन्द्र", "Mo", "चं"],
  mars: ["Mars", "मंगल", "Ma", "मं"],
  mercury: ["Mercury", "बुध", "Me", "बु"],
  jupiter: ["Jupiter", "गुरु", "Ju", "गु"],
  venus: ["Venus", "शुक्र", "Ve", "शु"],
  saturn: ["Saturn", "शनि", "Sa", "श"],
  rahu: ["Rahu", "राहु", "Ra", "रा"],
  ketu: ["Ketu", "केतु", "Ke", "के"],
} as const;

export type Graha = keyof typeof GRAHA_NAMES;
export const GRAHA_ORDER: Graha[] = [
  "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu",
];

/* ——— panchang ——— */

export type Panchang = {
  tithi: { index: number; paksha: "shukla" | "krishna"; name: readonly [string, string]; percent: number };
  nakshatra: { index: number; name: readonly [string, string]; pada: number };
  yoga: { index: number; name: readonly [string, string] };
  karana: { index: number; name: readonly [string, string] };
  sunRashi: number;
  moonRashi: number;
  ayanamsha: number;
};

export function panchang(date: Date): Panchang {
  const jd = julianDay(date);
  const ayan = ayanamsha(jd);
  const sun = norm360(sunLongitude(jd) - ayan);
  const moon = norm360(moonLongitude(jd) - ayan);

  const elong = norm360(moon - sun);
  const tithiIndex = Math.floor(elong / 12); // 0–29
  const paksha = tithiIndex < 15 ? "shukla" : "krishna";
  const inPaksha = tithiIndex % 15;

  const nakIndex = Math.floor(moon / (360 / 27));
  const pada = Math.floor((moon % (360 / 27)) / (360 / 108)) + 1;

  const yogaIndex = Math.floor(norm360(sun + moon) / (360 / 27));

  // 60 half-tithis: first is Kimstughna, then Bava…Vishti repeating, last three fixed
  const half = Math.floor(elong / 6);
  let karanaIndex: number;
  if (half === 0) karanaIndex = 10;
  else if (half >= 57) karanaIndex = 7 + (half - 57);
  else karanaIndex = (half - 1) % 7;

  return {
    tithi: {
      index: tithiIndex + 1,
      paksha,
      name: TITHI_NAMES[Math.min(inPaksha, 14)],
      percent: ((elong % 12) / 12) * 100,
    },
    nakshatra: { index: nakIndex + 1, name: NAKSHATRA_NAMES[nakIndex], pada },
    yoga: { index: yogaIndex + 1, name: YOGA_NAMES[yogaIndex] },
    karana: { index: karanaIndex + 1, name: KARANA_NAMES[karanaIndex] },
    sunRashi: Math.floor(sun / 30),
    moonRashi: Math.floor(moon / 30),
    ayanamsha: ayan,
  };
}

/* ——— natal chart ——— */

export type Placement = {
  graha: Graha;
  longitude: number;
  rashi: number;
  degreeInRashi: number;
  nakshatra: number;
  pada: number;
  retrograde: boolean;
  house: number;
};

export type Chart = {
  lagna: { longitude: number; rashi: number; degreeInRashi: number };
  placements: Placement[];
  moonNakshatra: { index: number; pada: number; fraction: number };
  ayanamsha: number;
  jd: number;
};

function siderealOf(jd: number, graha: Graha): number {
  const ayan = ayanamsha(jd);
  switch (graha) {
    case "sun": return norm360(sunLongitude(jd) - ayan);
    case "moon": return norm360(moonLongitude(jd) - ayan);
    case "rahu": return norm360(rahuLongitude(jd) - ayan);
    case "ketu": return norm360(rahuLongitude(jd) + 180 - ayan);
    default: return norm360(planetLongitude(graha, jd) - ayan);
  }
}

/**
 * A whole-sign natal chart, the way a North Indian kundli is drawn: house one
 * is the whole rashi the lagna falls in.
 */
export function natalChart(date: Date, latitude: number, longitude: number): Chart {
  const jd = julianDay(date);
  const ayan = ayanamsha(jd);
  const lagnaLon = norm360(ascendant(jd, latitude, longitude) - ayan);
  const lagnaRashi = Math.floor(lagnaLon / 30);

  const placements: Placement[] = GRAHA_ORDER.map((graha) => {
    const lon = siderealOf(jd, graha);
    // a day either side tells us which way it is moving
    const ahead = siderealOf(jd + 1, graha);
    const delta = ((ahead - lon + 540) % 360) - 180;
    const rashi = Math.floor(lon / 30);
    return {
      graha,
      longitude: lon,
      rashi,
      degreeInRashi: lon % 30,
      nakshatra: Math.floor(lon / (360 / 27)) + 1,
      pada: Math.floor((lon % (360 / 27)) / (360 / 108)) + 1,
      retrograde: delta < 0,
      house: ((rashi - lagnaRashi + 12) % 12) + 1,
    };
  });

  const moon = placements.find((p) => p.graha === "moon")!;
  const nakSpan = 360 / 27;

  return {
    lagna: { longitude: lagnaLon, rashi: lagnaRashi, degreeInRashi: lagnaLon % 30 },
    placements,
    moonNakshatra: {
      index: moon.nakshatra,
      pada: moon.pada,
      fraction: (moon.longitude % nakSpan) / nakSpan,
    },
    ayanamsha: ayan,
    jd,
  };
}

/* ——— vimshottari dasha ——— */

const DASHA_LORDS: { graha: Graha; years: number }[] = [
  { graha: "ketu", years: 7 },
  { graha: "venus", years: 20 },
  { graha: "sun", years: 6 },
  { graha: "moon", years: 10 },
  { graha: "mars", years: 7 },
  { graha: "rahu", years: 18 },
  { graha: "jupiter", years: 16 },
  { graha: "saturn", years: 19 },
  { graha: "mercury", years: 17 },
];

export type MahaDasha = { graha: Graha; start: Date; end: Date; years: number };

/** The Vimshottari sequence from birth, starting mid-period in the birth lord. */
export function vimshottari(chart: Chart, birth: Date, count = 9): MahaDasha[] {
  const nakIndex = chart.moonNakshatra.index - 1;
  const startLord = nakIndex % 9;
  const elapsed = chart.moonNakshatra.fraction;

  const out: MahaDasha[] = [];
  const YEAR_MS = 365.2425 * 86400000;

  let cursor = new Date(birth.getTime() - DASHA_LORDS[startLord].years * elapsed * YEAR_MS);
  for (let n = 0; n < count; n++) {
    const lord = DASHA_LORDS[(startLord + n) % 9];
    const end = new Date(cursor.getTime() + lord.years * YEAR_MS);
    out.push({ graha: lord.graha, start: cursor, end, years: lord.years });
    cursor = end;
  }
  return out;
}

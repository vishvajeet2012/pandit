/**
 * The twelve rashis, drawn as hairline line-art rather than a font glyph or an
 * icon set — one stroke weight, one viewBox, so a row of them reads as a set.
 */

export const RASHIS = [
  "mesha",
  "vrishabha",
  "mithuna",
  "karka",
  "simha",
  "kanya",
  "tula",
  "vrishchika",
  "dhanu",
  "makara",
  "kumbha",
  "meena",
] as const;

export type Rashi = (typeof RASHIS)[number];

const PATHS: Record<Rashi, string[]> = {
  mesha: ["M20 70 C 20 34 42 24 50 52 C 58 24 80 34 80 70"],
  vrishabha: [
    "M28 44 C 30 20 70 20 72 44",
    "M33 66 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0",
  ],
  mithuna: ["M30 22 H70", "M30 78 H70", "M42 22 V78", "M58 22 V78"],
  karka: [
    "M23 45 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
    "M63 55 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
    "M37 41 C 50 30 68 32 76 44",
    "M63 59 C 50 70 32 68 24 56",
  ],
  simha: [
    "M21 66 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0",
    "M45 60 C 40 40 50 26 62 28 C 76 30 76 50 68 60 C 62 68 68 74 76 70",
  ],
  kanya: [
    "M22 32 V72",
    "M22 36 C 25 28 34 28 37 36 V72",
    "M37 36 C 40 28 49 28 52 36 V64 C 52 74 62 78 70 70",
    "M58 56 C 72 54 78 68 66 74",
  ],
  tula: ["M20 74 H80", "M20 58 H32", "M68 58 H80", "M32 58 C 32 40 68 40 68 58"],
  vrishchika: [
    "M18 34 V70",
    "M18 38 C 21 30 30 30 33 38 V70",
    "M33 38 C 36 30 45 30 48 38 V70",
    "M48 38 C 51 30 60 30 63 38 V64 L78 78",
    "M78 78 V64",
    "M78 78 H64",
  ],
  dhanu: ["M24 76 L76 24", "M54 24 H76 V46", "M38 44 L56 62"],
  makara: [
    "M20 34 C 26 54 34 64 44 62 C 34 44 40 28 50 32 C 60 36 58 54 54 66",
    "M54 66 C 64 68 74 62 72 50 C 70 40 58 42 58 52",
  ],
  kumbha: ["M18 46 L32 34 L46 46 L60 34 L74 46", "M18 66 L32 54 L46 66 L60 54 L74 66"],
  meena: ["M32 22 C 20 42 20 58 32 78", "M70 22 C 82 42 82 58 70 78", "M22 50 H80"],
};

type Props = {
  sign: Rashi;
  className?: string;
  strokeWidth?: number;
};

export default function RashiGlyph({ sign, className = "", strokeWidth = 2 }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[sign].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

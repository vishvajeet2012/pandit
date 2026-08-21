import Image from "next/image";
import { PHOTOGRAPHY, PLATE_GRADE } from "@/config/photography";

/**
 * A photographic plate.
 *
 * Drop a real photograph in by passing `src` — the art direction for each
 * variant lives in README.md. With no `src` the component renders a tonal
 * stand-in built from SVG light, so the layout keeps its weight and warmth
 * instead of a grey box.
 */

export type PlateVariant =
  | "portrait"
  | "portrait-close"
  | "sanctum"
  | "manuscript"
  | "tea"
  | "hand"
  | "chair"
  | "page"
  | "palm-leaf"
  | "diya"
  | "corridor";

type Props = {
  variant: PlateVariant;
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function Plate({ variant, src, alt, className = "", priority, sizes }: Props) {
  const photo = src ? { src, position: "50% 50%" } : PHOTOGRAPHY[variant];

  return (
    <div
      className={`relative overflow-hidden bg-[#efe8da] ${className}`}
      role="img"
      aria-label={alt}
    >
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes ?? "100vw"}
            className="object-cover"
            style={{ objectPosition: photo.position, filter: PLATE_GRADE }}
          />
          {/* the house grade: warm light poured over every photograph */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: "linear-gradient(150deg, #fff6e6 0%, #c9a86e 58%, #6b4f28 100%)", opacity: 0.5 }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(120% 90% at 50% 42%, rgba(247,243,235,0) 45%, rgba(107,79,40,0.22) 100%)" }}
          />
        </>
      ) : (
        <Stand variant={variant} />
      )}
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply" />
    </div>
  );
}

const DUST: [number, number, number][] = [
  [180, 240, 2.2],
  [242, 331, 1.4],
  [318, 196, 1.8],
  [402, 288, 1.2],
  [151, 402, 1.6],
  [286, 448, 2.4],
  [365, 520, 1.3],
  [214, 566, 1.7],
  [455, 172, 1.5],
  [520, 330, 1.1],
  [612, 244, 1.9],
  [688, 402, 1.3],
];

/** Variants that read as photographs rather than documents. */
const LENS = new Set<PlateVariant>(["tea", "hand", "chair", "page", "diya", "corridor"]);

function Stand({ variant }: { variant: PlateVariant }) {
  const id = variant;
  return (
    <svg
      viewBox="0 0 1000 1200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={id + "-wall"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf7ef" />
          <stop offset="52%" stopColor="#efe6d6" />
          <stop offset="100%" stopColor="#ddd0ba" />
        </linearGradient>
        <radialGradient id={id + "-light"} cx="18%" cy="14%" r="78%">
          <stop offset="0%" stopColor="#fffdf8" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#f4ecdd" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c9b491" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id + "-teak"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a7247" />
          <stop offset="100%" stopColor="#6b4b2c" />
        </linearGradient>
        <filter id={id + "-soft"}>
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={id + "-soft-s"}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id + "-photo"}>
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
        <filter id={id + "-lens"}>
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <radialGradient id={id + "-vig"} cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#7a5c30" stopOpacity="0" />
          <stop offset="72%" stopColor="#7a5c30" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6b4f28" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      <rect width="1000" height="1200" fill={"url(#" + id + "-wall)"} />
      <rect width="1000" height="1200" fill={"url(#" + id + "-light)"} />

      {LENS.has(variant) ? (
        <g filter={"url(#" + id + "-lens)"}>
          <Scene variant={variant} id={id} />
        </g>
      ) : (
        <Scene variant={variant} id={id} />
      )}

      <rect width="1000" height="1200" fill={"url(#" + id + "-vig)"} />

      <g fill="#fffaf0" opacity="0.55">
        {DUST.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}

function Scene({ variant, id }: { variant: PlateVariant; id: string }) {
  const teak = "url(#" + id + "-teak)";
  const soft = "url(#" + id + "-soft)";
  const softS = "url(#" + id + "-soft-s)";
  const photo = "url(#" + id + "-photo)";

  switch (variant) {
    case "portrait":
      return (
        <g>
          {/* window light falling in from the left */}
          <rect x="-60" y="-60" width="440" height="1320" fill="#fffdf6" opacity="0.55" filter={soft} />
          {/* the sitter — a low-contrast tonal mass at f/2, never a cut-out */}
          <g filter={soft} opacity="0.5">
            <ellipse cx="648" cy="500" rx="146" ry="184" fill="#7f6647" />
            <path d="M300 1200 C 340 900 480 726 648 726 C 826 726 946 902 986 1200 Z" fill="#7f6647" />
          </g>
          {/* raw silk catching the light along the near shoulder */}
          <g filter={soft} opacity="0.55">
            <path d="M320 1200 C 366 924 486 762 618 748 L 618 1200 Z" fill="#fdf8ee" />
          </g>
          {/* the room falling away behind him */}
          <rect x="0" y="1010" width="1000" height="190" fill="#c6ae87" opacity="0.35" filter={soft} />
        </g>
      );

    case "portrait-close":
      return (
        <g>
          <rect x="-60" y="-60" width="400" height="1320" fill="#fffdf6" opacity="0.5" filter={soft} />
          {/* the fall of a cream kurta, no face in frame */}
          <g filter={soft} opacity="0.5">
            <path d="M60 560 C 150 240 340 60 520 60 C 740 60 890 260 950 560 Z" fill="#fdf8ee" />
            <path d="M60 560 C 160 280 330 110 500 96 L 500 560 Z" fill="#ffffff" opacity="0.7" />
          </g>
          {/* teak, and the chart lying on it */}
          <rect x="0" y="600" width="1000" height="600" fill={teak} />
          <rect x="0" y="600" width="1000" height="26" fill="#b98f5c" opacity="0.5" />
          <g transform="rotate(-1.4 500 900)">
            <rect x="130" y="700" width="760" height="460" fill="#f6efe0" />
            <g stroke="#3a3227" strokeWidth="2.4" opacity="0.55" fill="none">
              <rect x="190" y="750" width="230" height="230" />
              <path d="M190 750 L420 980 M420 750 L190 980 M305 750 L190 865 L305 980 L420 865 Z" />
              <path d="M480 776 h330 M480 820 h270 M480 864 h340 M480 908 h210 M480 952 h290" opacity="0.5" />
            </g>
          </g>
          {/* hands at rest on the table edge */}
          <g fill="#c2a179" filter={softS} opacity="0.95">
            <ellipse cx="320" cy="588" rx="176" ry="66" />
            <rect x="180" y="562" width="290" height="50" rx="25" />
            <ellipse cx="712" cy="574" rx="158" ry="58" />
          </g>
        </g>
      );

    case "sanctum":
      return (
        <g>
          {/* wall, then floor */}
          <rect x="0" y="0" width="1000" height="812" fill="#f2ebdc" />
          <rect x="0" y="812" width="1000" height="388" fill="#dbc9ab" />
          <rect x="0" y="806" width="1000" height="10" fill="#cfbc9c" opacity="0.7" />

          <g filter={photo}>
            {/* the north-facing window */}
            <rect x="648" y="176" width="286" height="452" fill="#fffdf8" />
            <rect x="640" y="168" width="302" height="468" fill="none" stroke="#cbb692" strokeWidth="6" />
            <rect x="120" y="120" width="420" height="700" fill="#fffdf6" opacity="0.35" filter={soft} />

            {/* jaali light thrown across the floor, in perspective */}
            <g opacity="0.5">
              {Array.from({ length: 7 }).map((_, r) =>
                Array.from({ length: 11 }).map((_, c) => (
                  <rect
                    key={r + "-" + c}
                    x={210 + c * (58 - r * 3) + r * 26}
                    y={840 + r * 46}
                    width={34 - r * 2}
                    height={24 - r}
                    fill="#c3ad89"
                    opacity={0.62 - r * 0.07}
                    transform="skewX(-13)"
                  />
                ))
              )}
            </g>

            {/* two low chairs */}
            <path d="M92 700 h132 v54 h-132 z" fill="#cdb894" />
            <path d="M104 754 h108 v112 h-108 z" fill="#c2ab86" opacity="0.9" />
            <path d="M792 700 h132 v54 h-132 z" fill="#cdb894" />
            <path d="M804 754 h108 v112 h-108 z" fill="#c2ab86" opacity="0.9" />

            {/* the table throws its weight onto the floor */}
            <ellipse cx="500" cy="880" rx="300" ry="40" fill="#4a3418" opacity="0.16" filter={soft} />

            {/* one teak table */}
            <path d="M262 706 L742 706 L724 730 L280 730 Z" fill="#8a6339" />
            <path d="M280 730 h444 v10 h-444 z" fill="#6f4d2b" />
            <rect x="308" y="740" width="16" height="132" fill="#6f4d2b" />
            <rect x="682" y="740" width="16" height="132" fill="#6f4d2b" />

            {/* a brass diya, unlit */}
            <ellipse cx="502" cy="700" rx="38" ry="12" fill="#c5a46e" />
            <path d="M466 700 q36 28 72 0 z" fill="#a98a54" />
          </g>

          {/* warm vignette, only temperature */}
          <rect x="0" y="0" width="1000" height="1200" fill={"url(#" + id + "-light)"} opacity="0.6" />
        </g>
      );

    case "manuscript":
    case "palm-leaf":
      return (
        <g>
          <rect x="60" y="80" width="880" height="1040" fill="#e9dcbd" />
          <rect x="60" y="80" width="880" height="1040" fill="none" stroke="#c2ab84" strokeWidth="2" />
          <g stroke="#2b2419" strokeWidth="2.2" opacity="0.6">
            {Array.from({ length: 17 }).map((_, i) => (
              <line
                key={i}
                x1={132 + (i % 3) * 9}
                y1={186 + i * 34}
                x2={846 - ((i * 7) % 5) * 62}
                y2={186 + i * 34}
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={"b" + i} x1="132" y1={792 + i * 34} x2={520 - ((i * 3) % 4) * 44} y2={792 + i * 34} />
            ))}
          </g>
          <line x1="132" y1="150" x2="868" y2="150" stroke="#8a6a3c" strokeWidth="2" opacity="0.5" />
          <g stroke="#2b2419" strokeWidth="3" fill="none" opacity="0.7">
            <rect x="600" y="820" width="230" height="230" />
            <path d="M600 820 L830 1050 M830 820 L600 1050 M715 820 L600 935 L715 1050 L830 935 Z" />
          </g>
          {/* foxing */}
          <g fill="#b79a6c" opacity="0.28">
            <circle cx="220" cy="940" r="34" />
            <circle cx="300" cy="1010" r="19" />
            <circle cx="820" cy="220" r="26" />
          </g>
        </g>
      );

    case "tea":
      return (
        <g>
          <rect x="0" y="640" width="1000" height="560" fill={teak} />
          <g transform="rotate(-2 340 910)">
            <rect x="80" y="700" width="520" height="420" fill="#f6efe0" />
            <g stroke="#3a3227" strokeWidth="2.4" fill="none" opacity="0.55">
              <rect x="150" y="760" width="220" height="220" />
              <path d="M150 760 L370 980 M370 760 L150 980" />
            </g>
          </g>
          <ellipse cx="740" cy="800" rx="120" ry="44" fill="#fffdf7" />
          <ellipse cx="740" cy="792" rx="96" ry="34" fill="#e3d6be" />
          <path d="M858 786 q54 26 0 52" stroke="#fffdf7" strokeWidth="14" fill="none" />
        </g>
      );

    case "hand":
      return (
        <g>
          <rect x="0" y="560" width="1000" height="640" fill={teak} />
          <g stroke="#2b2419" strokeWidth="2.6" fill="none" opacity="0.65">
            <rect x="120" y="620" width="300" height="300" fill="#f6efe0" />
            <path d="M120 620 L420 920 M420 620 L120 920 M270 620 L120 770 L270 920 L420 770 Z" />
          </g>
          {/* a hand at rest, not pointing */}
          <g fill="#c2a179" filter={softS}>
            <ellipse cx="700" cy="820" rx="150" ry="74" />
            <rect x="590" y="800" width="230" height="52" rx="26" />
          </g>
          {/* brass compass, red pencil */}
          <circle cx="520" cy="1030" r="46" fill="#c5a46e" />
          <circle cx="520" cy="1030" r="28" fill="#fffdf7" />
          <rect x="640" y="1010" width="240" height="12" rx="6" fill="#9d3b30" transform="rotate(-8 760 1016)" />
        </g>
      );

    case "chair":
      return (
        <g>
          <rect x="600" y="120" width="330" height="470" fill="#fffdf7" />
          <g opacity="0.45">
            {Array.from({ length: 7 }).map((_, r) =>
              Array.from({ length: 10 }).map((_, c) => (
                <rect
                  key={r + "-" + c}
                  x={120 + c * 70 + r * 12}
                  y={800 + r * 52}
                  width="34"
                  height="24"
                  fill="#b49f7e"
                  opacity={0.5 - r * 0.05}
                />
              ))
            )}
          </g>
          <rect x="230" y="560" width="300" height="60" rx="10" fill="#c9b596" />
          <rect x="248" y="380" width="264" height="190" rx="14" fill="#d6c5a6" />
          <rect x="256" y="620" width="18" height="180" fill={teak} />
          <rect x="488" y="620" width="18" height="180" fill={teak} />
        </g>
      );

    case "page":
      return (
        <g>
          <rect x="0" y="520" width="1000" height="680" fill={teak} />
          <g transform="rotate(1.2 500 840)">
            <rect x="220" y="600" width="560" height="480" fill="#f8f2e5" />
            <path d="M220 840 h560" stroke="#ddd0b6" strokeWidth="3" />
            <g stroke="#3a3227" strokeWidth="3" opacity="0.5">
              <line x1="300" y1="700" x2="640" y2="700" />
              <line x1="300" y1="748" x2="580" y2="748" />
              <line x1="300" y1="960" x2="520" y2="960" />
            </g>
          </g>
          <rect x="452" y="566" width="96" height="58" rx="6" fill="#26292c" />
        </g>
      );

    case "diya":
      return (
        <g>
          <rect x="0" y="0" width="1000" height="830" fill="#f2ebdb" />
          <rect x="0" y="830" width="1000" height="370" fill={teak} opacity="0.9" />
          <rect x="120" y="60" width="380" height="660" fill="#fffdf7" opacity="0.85" filter={soft} />
          {/* the brass throws a long warm shadow */}
          <ellipse cx="700" cy="880" rx="260" ry="44" fill="#4a3418" opacity="0.22" filter={soft} />
          <ellipse cx="560" cy="838" rx="176" ry="50" fill="#c5a46e" />
          <path d="M402 836 q158 116 316 0 z" fill="#a98a54" />
          <ellipse cx="560" cy="822" rx="118" ry="29" fill="#8f7440" />
          <ellipse cx="512" cy="812" rx="52" ry="14" fill="#e0c793" opacity="0.8" />
        </g>
      );

    case "corridor":
      return (
        <g>
          <rect x="0" y="0" width="1000" height="1200" fill="#e6d6bd" />
          <rect x="0" y="0" width="380" height="1200" fill="#d8c4a4" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={0.75 - i * 0.12}>
              <rect x={140 + i * 190} y={220 + i * 60} width="120" height={620 - i * 110} fill="#f7efe0" />
              <path d={"M" + (140 + i * 190) + " " + (220 + i * 60) + " q60 -80 120 0"} fill="#f7efe0" />
            </g>
          ))}
          <rect x="0" y="900" width="1000" height="300" fill="#c9b391" opacity="0.6" />
          <rect x="0" y="892" width="1000" height="14" fill="#a68b63" opacity="0.45" />
          <rect x="0" y="0" width="1000" height="1200" fill="#8a6a3c" opacity="0.1" />
        </g>
      );

    default:
      return null;
  }
}

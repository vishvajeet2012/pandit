# AETHERIS

The private Vedic practice of Acharya Rishi Devansh — a single, scroll-driven landing page built as a digital atelier rather than a SaaS page.

Next.js 16.3 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · next-intl.

```bash
npm run dev     # http://localhost:3000 → redirects to /en
npm run build
npm start
```

## Languages

English is the default and every URL carries its locale: `/en`, `/hi`. `/` redirects to `/en`.

- Copy lives in [messages/en.json](messages/en.json) and [messages/hi.json](messages/hi.json) — one namespace per act. Nothing user-facing is hard-coded in a component.
- Routing config: [src/i18n/routing.ts](src/i18n/routing.ts). Add a locale there, add the matching `messages/<locale>.json`, and the nav switcher picks it up.
- The locale switcher in the nav keeps the current path, so `/hi` ↔ `/en` never loses the reader's place.
- Hindi gets its own faces — Noto Serif Devanagari for display, Noto Sans Devanagari for body — with looser leading and no italics (Devanagari has none). Those rules live under `html[lang="hi"]` in [src/app/globals.css](src/app/globals.css).

## Favicon

One global setting: the `favicon` block in [src/config/site.ts](src/config/site.ts).

```ts
favicon: { glyph: "A", background: "#1F252E", foreground: "#C5A46E", radius: 0.28, scale: 0.62, … }
```

[src/app/icon.tsx](src/app/icon.tsx) and [src/app/apple-icon.tsx](src/app/apple-icon.tsx) render from it at build time, so changing the glyph or the colours updates the browser tab and the touch icon together. There is no `favicon.ico` in the repo — the Next.js default was removed on purpose.

## Design system

Tokens are defined once, in `@theme` in [src/app/globals.css](src/app/globals.css):

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#F7F3EB` | page ground |
| `surface` | `#FFFFFF` | slabs, chapter panels |
| `ink` | `#1F252E` | primary type |
| `muted` | `#5C6675` | body copy |
| `gold` | `#C5A46E` | gold leaf — wordmark, one italic word per act, rules, one button |
| `rule` | `#E8DFD0` | hairlines |

Editorial primitives (`.display`, `.eyebrow`, `.smallcaps`, `.body-muted`, `.gold-link`, `.deva`, `.act`) sit in `@layer components`, so any Tailwind utility still overrides them inline.

Shadows are temperature only (`.warm-lift`), never grey. Grain is a fixed 3% overlay.

## The acts

`src/app/[locale]/page.tsx` composes sixteen sections in order: hero · press band · the Acharya · signature work (pinned horizontal track) · panchang · the ritual (pinned numerals) · what is read · the twelve houses · the sanctum · parampara · for whom · a sitting · voices · journal · asked often · close.

Motion, all in [src/components/site](src/components/site) and each act:

- **Lenis** smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync.
- **Custom cursor** — 6px charcoal dot, 28px gold ring trailing at lerp 0.12.
- **Sri Yantra** drawn with `pathLength`-normalised strokes: frozen at 55% behind the hero, scrubbed to complete in the closing act.
- **Kundli and the twelve rashis** — [KundliChart.tsx](src/components/site/KundliChart.tsx) draws a North Indian twelve-house chart line by line as you descend; [RashiGlyph.tsx](src/components/site/RashiGlyph.tsx) holds the twelve signs as hairline SVG paths in one viewBox at one stroke weight. No icon font, no image.
- **Pinned horizontal track** for the offerings; **pinned numerals** with a gold sutra-line for the ritual.
- Parallax on the portraits, the sanctum frame, the jaali shadow, and the journal film-strip.
- **Drag-to-scrub** on the offerings track — a sideways drag moves the page through the Lenis instance, which is what moves the track.
- **The entrance** ([Preloader.tsx](src/components/site/Preloader.tsx)) draws the Sri Yantra once per session, then lifts. Never server-rendered, skipped on a second visit and under reduced motion.
- **Route changes** come up out of the ivory rather than cutting, via [template.tsx](src/app/[locale]/template.tsx).
- Everything respects `prefers-reduced-motion`.

## Routes

| Route | What it is |
| --- | --- |
| `/[locale]` | The landing page, sixteen acts |
| `/[locale]/book` | Consultation request form (server action) |
| `/[locale]/kundli` | The free chart tool |
| `/[locale]/offerings/[slug]` | Six reading pages |
| `/[locale]/journal/[slug]` | Three essays |
| `/[locale]/fees` · `/privacy` · `/terms` | The plain terms of the work |
| `/[locale]/credits` | Photography attribution |
| `not-found` | Both locale-aware and root-level |

## The ephemeris

[src/lib/jyotish.ts](src/lib/jyotish.ts) is a small sidereal ephemeris written for this site — no API key, no network, no Swiss Ephemeris binary.

- Sun and Moon follow Meeus (ch. 25 and 47, truncated series); the five visible planets use the JPL approximate elements valid 1800–2050; Rahu is the mean node; the ayanamsha is a linear Lahiri.
- Checked against known events: the new moon of 2000-01-06 18:14 UT and the eclipse of 2009-07-22 02:35 UT both come out at an elongation within 0.02° of zero, and the full moons of 2000-01-21 and 2025-01-13 within 0.02° of 180°.
- **Expect a few arc-minutes of error.** That is right for reading the shape of a chart and wrong for timing an event — the tool says so on the page. Swap in Swiss Ephemeris if the practice ever needs muhurta-grade precision.

It drives two things: the panchang act, computed at render time for Jaipur (the landing page revalidates every half hour), and the kundli tool, which computes entirely in the browser and sends nothing anywhere.

## The consultation form

`/[locale]/book` posts to a server action ([actions.ts](src/app/[locale]/book/actions.ts)), which validates, drops obvious bots via a honeypot field, and hands off to [src/lib/requests.ts](src/lib/requests.ts).

Every request is appended to `.data/requests.jsonl` (gitignored, skipped silently on a read-only host). Set `RESEND_API_KEY` — see [.env.example](.env.example) — and each request is emailed as well, with the sender's address as reply-to.

## Legal copy

`fees`, `privacy` and `terms` are written to match the practice described on the site, and they are **drafts, not legal advice**. Have a lawyer read them before the site goes live, particularly the privacy page if requests will be stored anywhere but the practice's own machine.

## Photography

Eleven photographs live in [public/photography/](public/photography/), all from Wikimedia Commons. [src/config/photography.ts](src/config/photography.ts) maps each plate variant to its file, its focal point, and the one house grade every image is put through — a warm sepia filter plus a soft-light wash, so red sandstone, brass and palm leaf all sit in the same ivory-and-gold room.

```ts
portrait: { src: "/photography/hero-yantra.jpg", position: "52% 50%" },
```

Change or delete an entry and that plate follows: [Plate.tsx](src/components/plates/Plate.tsx) falls back to a tonal SVG stand-in when a variant has no photograph, so the layout never collapses into a grey box. Passing `src` directly to a `<Plate>` still wins over the map — that is how a real commissioned shoot would drop in.

| Plate | Subject |
| --- | --- |
| `portrait` | The Nadivalaya Yantra dial at the Jaipur Jantar Mantar |
| `portrait-close` | A brass astrolabe |
| `sanctum` | A jali screen at Amber Fort |
| `manuscript` | The Brihat Samhita of Varahamihira, on paper |
| `tea` · `hand` · `chair` · `page` | Kulhar chai · a copper Sri Yantra · a jali screen · a palm-leaf manuscript |
| `palm-leaf` · `diya` · `corridor` | Two Jantar Mantar instruments · a carved temple corridor |

**Licences.** Most files are CC BY-SA or CC BY, which require the photographer and licence to stay visible wherever the image is published. [public/photography/CREDITS.md](public/photography/CREDITS.md) and `src/config/credits.json` are both generated with the downloads, and the site carries them at `/en/credits` and `/hi/credits`, linked from the footer. Keep that page up if you keep the photographs. Note that the astrolabe is Persian rather than Indian — swap it if the practice wants strict provenance.

## Content notes

The panchang values in `messages/*.json` are static placeholders (`Shukla Panchami`, `Rohini`, …). If the practice wants them live, replace the `panchang.items` values from a panchang API at request time — the act reads whatever the dictionary holds.

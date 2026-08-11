# PROGRESS — TC GHG Accounting Dashboard

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 1 — first build complete and deployed
**Last updated:** 2026-08-11 — by Claude Code
**Live URL:** https://tc-ghg-dashboard.netlify.app

## Current state
The dashboard is fully built and verified against every Section 13 control total.
- React + Vite + Tailwind single-page app. The six source CSVs are bundled from
  `src/data/` (imported `?raw`, parsed at runtime, never mutated).
- Calculation engine (`src/lib/calc.js`) implements plant-aware factor matching
  (all five conditions), `applies_to` normalisation, per-scope / per-category /
  per-plant / all-plants aggregation, and the provisional / Montreal Protocol /
  unmatched / multi-match edge cases. All-plants totals reproduce exactly:
  Scope 1 = 19,383.5 · Scope 2 = 32,471.7 · Combined = 51,855.1 tCO₂e, and every
  per-plant total matches criteria 4–8.
- UI: header band (logo + title + methodology + 2026 Q1 badge), plant selector
  defaulting to "All Plants (Total)", headline Scope 1 / Scope 2 / Combined
  metrics, by-category chart + table (Recharts, Sage & Oak palette), emission-
  factor sources panel, data-quality flags panel, export controls, footer. The
  selector re-scopes every panel.
- Exports (browser-only): CSV = full result set (all plants + total, 1 dp) with
  plant/scope/category/tCO₂e/period/sources columns; PDF = branded A4 snapshot of
  the current selection via a dedicated off-screen print surface (html2canvas +
  jsPDF), ~0.5 MB.
- Sage & Oak branding applied (palette, Open Sans / EB Garamond web fonts, logo
  extracted from the branding template into `public/assets/`). Responsive on
  desktop and mobile. Live on Netlify at https://tc-ghg-dashboard.netlify.app,
  which auto-rebuilds on every push to `main` (build `npm run build`, publish
  `dist`; settings mirrored in `netlify.toml`, `vite.config.js` base `/`).

## Last session
Session 1: ran First Session Setup (organised spec/data/branding/logo), built the
calc engine and verified all 18 acceptance criteria in a headless browser, built
the dashboard UI + both exports, applied branding, confirmed desktop + mobile
render, merged to `main` (PR #1), and deployed to Netlify — confirmed live and
working. Build complete.

## Remaining work
- [ ] Nothing outstanding for v1.0. Next quarter: replace the six bundled CSVs in
      `src/data/` on a fresh branch off `main`, verify the new totals, open a PR,
      merge — Netlify redeploys automatically.
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- CSVs imported with Vite `?raw` and parsed by a small quote-aware parser
  (`src/lib/csv.js`) — keeps the six files read-only, bundled at build time.
- Recharts for the category bar chart; html2canvas + jsPDF for the browser-side
  PDF; no chart/PDF server or third-party service.
- Built lightweight Tailwind components instead of full shadcn/ui — same clean
  editorial feel with fewer dependencies for a single-screen tool.
- Totals accumulated in kg then converted to tonnes; display rounded to 1 dp.
  Category rows rounded to 1 dp may sum to ±0.1 of a scope headline (standard
  display-rounding artifact) — headlines use full precision, never tuned.
- PDF image embedded as JPEG q0.95 at scale 2 to keep the file ~0.5 MB.
- Category → colour map is fixed in `src/lib/ui.js` so each category keeps the
  same Sage & Oak colour in chart, table swatch, and PDF.

## Known issues
- Century Gothic / Garamond are not web fonts; Open Sans and EB Garamond are the
  intended substitutes and render cleanly.
- The Netlify URL will be public and unauthenticated — The Corporate's plant-level
  activity data and computed emissions will be world-readable to anyone with the
  link. Confirm the client is comfortable before sharing; restricting access would
  require login and a different tier.
- Production JS bundle is ~1.1 MB (Recharts + jsPDF + html2canvas). Acceptable for
  a single-viewer internal tool; could be code-split later if needed.

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]

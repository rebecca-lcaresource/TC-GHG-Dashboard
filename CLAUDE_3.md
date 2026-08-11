# TC GHG Accounting Dashboard

## Identity
A single-page dashboard that displays The Corporate's calculated Scope 1 and Scope 2 emissions for five manufacturing plants for the 2026 Q1 reporting period, used by one viewer — the sustainability consultant preparing the inventory — at a public URL with no login.
Tier: 1 — the dataset is bundled into the app at build time; no database, no authentication (D1+A1)
Spec version governed: v1.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone — shares no database with any other tool in The Corporate suite.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line above, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If it is missing, recreate it with the structure below, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point — after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one — an ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md and LCA_CO_TEMPLATE_NewBranding.docx into it.
2. Move the six data files (TC-FAC-001_2026_Q1.csv … TC-FAC-005_2026_Q1.csv and emission_factor_register_2025.csv) into src/data/ — they are the tool's bundled dataset.
3. Announce what moved, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npm install
npm run dev
npm run build
```

## Tech Stack
React · Vite · Tailwind CSS · shadcn/ui · Netlify
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is active — create the site and deploy via MCP. No manual repo connection is needed.

## Arms
Export — browser only, no server function — PDF: branded snapshot of the current on-screen selection, design per the spec's Arms section. CSV: always the full result set (all five plants plus the total), never only the on-screen selection.

## Hard Rules
- This build uses no API keys, credentials, or environment variables of any kind. If a change appears to require one, stop and raise it with the builder rather than introducing it.
- No database. Do not add Supabase, browser storage persistence, or any backend. The dataset is bundled at build time; a change to the data model goes back to the Tool Architect.
- Netlify Identity: never. This tool has no authentication of any kind.
- Both exports are generated entirely in the browser. Never add a server function or third-party service to produce the PDF or CSV.
- The six source CSVs are read-only inputs. Never edit, clean, or correct a value inside them. If a value looks wrong, flag it to the builder instead.
- The control totals in the spec's Acceptance Criteria section are the pass/fail test for the calculation. Never tune a calculation to force a match — if computed output differs, report the discrepancy with row-level detail.

## Brand
No brand skill yet — the LCA Resource "Sage & Oak" identity is defined inline below, sourced from docs/LCA_CO_TEMPLATE_NewBranding.docx. These rules apply until a brand skill is added to the repo (then install it at .claude/skills/ and defer to it):
- Primary `#295A66` dark teal for headings and primary UI — never Tailwind blue defaults. Page ground and panels `#E4E3E2` warm light grey — never plain white or Tailwind gray defaults. Body text `#4C483D` warm charcoal.
- Chart and accent series in this order: `#8DBB70` sage, `#D0A06F` oak, `#F0BB44` gold, `#61ADBF` teal, `#A3648B` plum, `#F8943F` orange.
- Fonts: headings Century Gothic with Open Sans as the web fallback; body Garamond with a web-safe serif fallback.
- Logo: extract the header image from docs/LCA_CO_TEMPLATE_NewBranding.docx into /public/assets and use it in the dashboard header and the PDF export. If extraction is not clean, stop and ask the builder for the logo file.
- Visual feel: clean, warm, editorial. Generous whitespace, restrained accent use, numbers presented large and legibly. Not a dense corporate data-wall.

## Business Rules
- Row emissions = `quantity × ef_kgco2e` in kg CO₂e. Display in tonnes (÷ 1000) as tCO₂e, rounded to 1 decimal place.
- Factor matching is plant-aware and all five conditions must hold: `factor.category == activity.category`, `factor.fuel_or_substance == activity.fuel_or_substance`, `factor.unit == activity.unit` (exact string match — units like `"kWh (Gross CV)"` must match character for character), `factor.ef_state == "Active"`, and the plant is within `factor.applies_to`. Never match on category + fuel + unit alone: plant scoping is what resolves each plant's country-specific grid electricity factor, and without it the match is ambiguous and wrong.
- Parse `applies_to` as either `"All plants"` (matches all five) or a comma-separated list whose tokens may be a full ID (`TC-FAC-001`) or a bare suffix (`003`) inheriting the `TC-FAC-` prefix. Normalise every token to a full `TC-FAC-00X` ID before comparing.
- Plant identity and the reporting period (2026 Q1) come from the CSV filename, never from a column inside the file.
- Scope 1 total = sum of rows where `factor.scope == "Scope 1"`; Scope 2 total = the same for `"Scope 2"`; category total = sum grouped by `category`; any all-plants figure = the sum of that figure across the five plants. Scope 2 is location-based only and must be labelled as such on screen and in both exports.
- Unmatched activity row (no Active factor matches for that plant): never dropped, never treated as zero. List it in the data-quality panel as "unmatched — no factor applied", naming the plant, category, fuel, and unit. If more than one Active factor ever matches a single row, flag it there rather than picking one.
- A factor with `status == "Provisional"` or `reporting_treatment == "Montreal Protocol"` is included in the totals and flagged in the data-quality panel — the first with its `provisional_rationale`, the second with a note that the substance falls under Montreal Protocol reporting treatment — each with the tCO₂e it contributes.
- The plant selector defaults to "All Plants (Total)" and re-scopes every panel below it: headline metrics, category breakdown, sources panel, and data-quality flags. Categories with no activity for the selected plant are absent from the breakdown, not shown as zero.

Out of scope — do not build:
- Per-plant data-collection dashboards, any live or persisted data feed, and in-tool CSV upload through the UI — all belong to the separate later data-collection project. For a new quarter in this version, the builder replaces the bundled files and the app is rebuilt.
- Market-based Scope 2 reporting, multi-quarter trends or period comparison, and Scope 3.

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full UI structure, calculation detail, export design intent, acceptance criteria
- docs/LCA_CO_TEMPLATE_NewBranding.docx — brand source and logo
Project structure is left to your judgment, with two fixed locations: the six CSVs live in src/data/ and the extracted logo in /public/assets.
PROGRESS.md in the root is read at every session start per the Session Protocol.

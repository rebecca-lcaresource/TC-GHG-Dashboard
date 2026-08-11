# PROGRESS — TC GHG Accounting Dashboard

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 0 — build not started
**Last updated:** 2026-08-10 — by Project Governor, pre-build
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
Nothing built. Repo contains CLAUDE.md, PROGRESS.md, product-spec.md, the six data files (TC-FAC-001_2026_Q1.csv … TC-FAC-005_2026_Q1.csv, emission_factor_register_2025.csv), and LCA_CO_TEMPLATE_NewBranding.docx.
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
None — the first build session has not happened yet.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] Builder: create the GitHub repo and upload CLAUDE.md, PROGRESS.md, product-spec.md, the six CSVs, and LCA_CO_TEMPLATE_NewBranding.docx to the root
- [ ] First Session Setup: create docs/, move the spec and branding template into it, move the six CSVs into src/data/, commit (see CLAUDE.md Session Protocol)
- [ ] Extract the LCA Resource logo from the branding template into /public/assets — ask the builder for the file if extraction is not clean
- [ ] Build the calculation engine: parse the six CSVs, apply plant-aware factor matching, aggregate by scope, category, plant, and all-plants total (spec Section 9)
- [ ] Build the Main Dashboard — header band, plant selector defaulting to "All Plants (Total)", headline Scope 1 / Scope 2 / Combined metrics, by-category chart and table, emission-factor sources panel, data-quality flags panel, export controls, footer (spec Section 8)
- [ ] Wire the Export arm: browser-side PDF snapshot of the current selection and CSV of the full result set (spec Section 3)
- [ ] Apply Sage & Oak branding — palette, fonts, logo, editorial layout (CLAUDE.md Brand)
- [ ] Local test pass — plant selector re-scopes every panel, both exports download correctly, desktop and mobile
- [ ] Acceptance criteria pass — verify all 18 criteria in spec Section 13, including the all-plants control totals (Scope 1 = 19,383.5 · Scope 2 = 32,471.7 · Combined = 51,855.1 tCO₂e) and every per-plant total, before deploy
- [ ] Deploy to Netlify via MCP — create the site and publish
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
None yet.
[Rule: one line per decision made during the build that is not in the spec — prompt structures, field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
- Logo extraction from LCA_CO_TEMPLATE_NewBranding.docx may not be clean — fallback is for the builder to supply the logo image file directly (spec Section 15).
- Century Gothic and Garamond are not reliably available as web fonts — Open Sans and a web-safe serif are the intended substitutes. Confirm the rendered result looks right before first deployment.
- Display unit is tCO₂e throughout. Change only if the builder decides otherwise.
- The Netlify URL is public and unauthenticated, so The Corporate's plant-level activity data and computed emissions will be world-readable to anyone with the link. Confirm the client is comfortable with that before sharing the URL; restricting access would require login and therefore a different tier.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]

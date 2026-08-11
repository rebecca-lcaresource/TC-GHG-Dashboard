# Product Spec — TC GHG Accounting Dashboard

**Version:** 1.0
**Date:** 2026-08-10
**Author:** Rebecca LeBlanc — LCA Resource
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** TC GHG Accounting Dashboard

**What it does:** Displays the calculated Scope 1 and Scope 2 greenhouse gas emissions for The Corporate's five manufacturing plants for the 2026 Q1 reporting period. It applies the plant activity data against a register of emission factors, following the GHG Protocol Corporate Standard, and presents the results as an all-plants total and per-plant breakdowns.

**Who uses it:** Rebecca LeBlanc (LCA Resource), the sustainability consultant preparing The Corporate's corporate GHG inventory. Single viewer — no other users.

**Why it exists:** It turns raw plant fuel, refrigerant, electricity, and heat activity data into a clear, sourced, audit-legible emissions result that can be reviewed at a glance — both in total and plant by plant — with the emission-factor provenance and any data-quality caveats shown alongside the numbers, so the consultant can judge where more accurate factors are needed.

**Build status:** First build — no prior version. This is a new tool within The Corporate suite (which already includes the Supplier Sustainability Scorecard and the Supplier Engagement Portal).

---

## Section 2 — Classification

### Data Model

**Decision:** D1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. The tool displays what the developer put in. | **Yes** |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | No |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | No |

**Reason:** The five plant activity files and the emission factor register are a fixed dataset for 2026 Q1, supplied by the builder and read at build time. Nothing is entered by a user and nothing needs to persist — the dashboard simply displays computed results from bundled data.

**D3 is triggered if any of the following are true — check all that apply:**
- [ ] Data must be retrievable after the session ends
- [ ] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [ ] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

None apply. Data is fixed and bundled.

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | **Yes** |
| A2 — Authentication | Users must log in. All logged-in users see the same thing and have the same permissions. | No |
| A3 — Authorization | Users must log in and have different roles. Different roles see different data or have different permissions. | No |

**Reason:** The tool is for the builder's own use only and displays no personal or confidential third-party data through any input; a plain public URL with no login is sufficient.

> **Promotion rule:** Auth requires a database. If the access model is A2 or A3, the data model is D3 — even when all displayed content is fixed. D1/D2 combined with A2/A3 are not valid classifications; they resolve to D3.

Not applicable — this tool is A1.

---

### If Access Model is A2 — complete both questions

Not applicable — A1.

### If Access Model is A3 — define all roles

Not applicable — A1.

---

### Tier

**Tier:** 1

| Tier | D+A combination | Stack | Deployment |
|------|----------------|-------|------------|
| 1 | **D1+A1** or D2+A1 | Netlify only | Netlify |
| 2 | D3+A1 | Netlify + Supabase (no auth) | Netlify |
| 3 | D3+A2 or D3+A3 | Netlify + Supabase (auth + RLS) | Netlify |

D1 + A1 → **Tier 1**: no login and no database. The simplest tier — same class as the Supplier Sustainability Scorecard.

---

### Standalone or Stack

**This tool is:** Standalone — it does not share a database with any other tool.

> Note on the future roadmap: five per-plant *data-collection* dashboards are planned as a **separate later project**. That project will introduce a Supabase database that eventually feeds a future version of this results dashboard. Those tools are explicitly out of scope for this build (see Section 12). This v1.0 is standalone with bundled data.

---

## Section 3 — Arms

### AI API Arm

**Active:** No

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | Both — PDF and CSV |
| What is exported | **PDF:** a branded snapshot of whatever scope is currently on screen (all-plants total or the selected single plant) — headline Scope 1 / Scope 2 / combined totals, the by-category breakdown, the reporting period label, the emission-factor source list, and the data-quality flags. **CSV:** the calculated totals as a table — one section for all-plants and one row-set per plant, with columns for plant, scope, category, emissions (tCO₂e), reporting period, and the factor source(s) applied. The CSV always contains the full result set (all plants + total), not just the on-screen selection. |
| PDF design intent | Branded to the LCA Resource "Sage & Oak" identity (see Section 10). Portrait, print-friendly (A4/Letter). Layout top to bottom: (1) header band with the LCA Resource logo, tool title, and "2026 Q1" period label; (2) methodology line — "GHG Protocol Corporate Standard · Scope 2 location-based"; (3) headline totals block — Scope 1, Scope 2, Combined in tCO₂e; (4) by-category breakdown table (and the on-screen category chart if it renders cleanly to PDF); (5) emission-factor sources list; (6) data-quality flags section with rationale; (7) footer with generation date and the scope shown (all-plants or plant ID). Generated entirely in the browser — no server, no keys. |

### Email Arm

**Active:** No

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | React + Vite + Tailwind — the tool has interactive state (the plant selector) and renders charts and export outputs, so the default interactive stack applies. Consistent with the rest of The Corporate suite. |
| Deployment target | Netlify |
| Netlify MCP | **Active** — the Netlify connector is active in the builder's Claude Desktop Connectors panel. No Netlify site exists for this dashboard yet; Claude Code will create a new site, set any configuration, and deploy automatically during the build session. |

**GitHub — pre-build requirement for all Tier 1, 2, and 3 tools:**
The user creates the GitHub repo before the first Claude Code session. The `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md` must be uploaded to the repo root before Claude Code opens. Claude Code assumes the repo exists, commits changes regularly, and pushes to main. It does not create or configure the repo.

**Bundled data files — upload to the repo root alongside the spec:**
The five activity files (`TC-FAC-001_2026_Q1.csv` … `TC-FAC-005_2026_Q1.csv`) and `emission_factor_register_2025.csv` are the tool's dataset. Upload all six to the repo. Claude Code reads them at build time and bundles the computed results (or the parsed data) into the app. The LCA Resource branding template `LCA_CO_TEMPLATE_NewBranding.docx` should also be uploaded so Claude Code can extract the logo (see Section 10).

---

### CONDITIONAL: Supabase project — only complete if Tier 2 or Tier 3

Not applicable — Tier 1, no database.

### CONDITIONAL: Only complete if this tool is part of a stack

Not applicable — standalone.

---

## Section 5 — Data Architecture

### CONDITIONAL: Only complete if Data Model is D3

Not applicable — D1. No database, no stored fields. The tool's data source is the six bundled CSV files described in Section 4 and the calculation described in Section 9.

---

## Section 6 — Access and Permissions

### CONDITIONAL: Only complete if Access Model is A2 or A3

Not applicable — A1. No authentication, no roles, no RLS.

---

## Section 7 — GDPR

**GDPR outcome:** Not applicable.

This is not a D3 tool. It has no database, collects no personal data through any form or upload, and stores nothing. There is no personal or identifiable information anywhere in the tool. (The plant activity data is operational fuel/energy/refrigerant quantities, not personal data.) Confirmed not applicable during the interview.

---

## Section 8 — Screen and UI Structure

The tool is a single-page dashboard. There is no landing page and no navigation — it opens directly to the results.

### Main Dashboard

- **Purpose:** Show the calculated Scope 1 and Scope 2 emissions for 2026 Q1, either totalled across all five plants or for one selected plant.
- **What is visible:**
  - **Header band:** LCA Resource logo, tool title ("TC GHG Accounting Dashboard"), and the reporting period label **"2026 Q1"**. A methodology line reads: "Calculated per the GHG Protocol Corporate Standard · Scope 2 reported location-based."
  - **Plant selector (dropdown):** default option **"All Plants (Total)"**, followed by the five plants (TC-FAC-001 through TC-FAC-005). Changing it re-scopes every element below.
  - **Headline metrics:** three figures in tonnes CO₂e (tCO₂e) — **Scope 1 total**, **Scope 2 total**, **Combined total** — for the current selection.
  - **By-category breakdown:** a chart plus an accompanying table showing emissions per category — Stationary Combustion, Mobile Combustion, Fugitive Emissions (Scope 1); Purchased Electricity, Purchased Heat (Scope 2) — for the current selection. Category series use the Sage & Oak secondary palette (Section 10). Categories with no activity for the selected plant are simply absent (e.g. Purchased Heat appears only for TC-FAC-004).
  - **Emission-factor sources panel:** lists the distinct sources behind the factors applied to the current selection — e.g. DEFRA 2025; IPCC AR5 GWP; national grid factors by country (Vietnam / Mexico / China / Poland / India); interim source (district heating). Each source shown with the factor(s) it backs.
  - **Data-quality flags panel:** surfaces any factor used in the current selection that is not a standard verified factor — specifically the **Provisional** district-heating factor (TC-FAC-004) and the **Montreal Protocol** reporting-treatment note on R-22 (TC-FAC-005) — each shown with its rationale and the tCO₂e it contributes, so the viewer can decide whether a more accurate factor is warranted. If any activity row ever fails to match a factor, it is listed here as an "unmatched — no factor applied" warning rather than being silently dropped.
  - **Export controls:** two buttons — **"Download PDF snapshot"** and **"Download CSV of totals"**.
  - **Footer:** methodology note (GHG Protocol Corporate Standard; Scope 2 location-based; factors from the 2025 register; period 2026 Q1) and the generation date.
- **User actions:** select a plant (or "All Plants (Total)") from the dropdown; click either export button.
- **What happens next:** selecting a plant instantly recomputes/re-filters the headline metrics, category breakdown, sources panel, and data-quality flags to that scope. Export buttons generate and download the PDF or CSV described in Section 3.

---

## Section 9 — Logic and Calculations

**What is calculated or scored:** Greenhouse gas emissions in kg CO₂e (displayed as tonnes CO₂e), per the GHG Protocol Corporate Standard, for each plant and in aggregate, split into Scope 1 and Scope 2 and broken down by category.

**Inputs:**
- **Activity data** — one CSV per plant (`TC-FAC-00X_2026_Q1.csv`), each with columns: `category`, `fuel_or_substance`, `unit`, `quantity`. The **plant identity** and the **reporting period (2026 Q1)** are taken from the filename, not from a column inside the file.
- **Emission factor register** — `emission_factor_register_2025.csv`, with columns: `ef_id`, `ef_year`, `scope`, `category`, `fuel_or_substance`, `unit`, `ef_kgco2e`, `reporting_treatment`, `status`, `provisional_rationale`, `source`, `applies_to`, `ef_state`.

**Formula or rules:**

1. **Row emissions.** For each activity row of plant *P*:
   `emissions_kgco2e = quantity × ef_kgco2e` of the matching factor.
   Display value: `emissions_tco2e = emissions_kgco2e ÷ 1000`.

2. **Factor matching (plant-aware — this is critical).** A factor matches an activity row only when **all** of these hold:
   - `factor.category` == `activity.category`, **and**
   - `factor.fuel_or_substance` == `activity.fuel_or_substance`, **and**
   - `factor.unit` == `activity.unit` (exact string match — note units like `"kWh (Gross CV)"` must match exactly), **and**
   - `factor.ef_state` == `"Active"`, **and**
   - plant *P* is within `factor.applies_to`.

   This plant-awareness is what makes the country-specific grid electricity factors correct: every plant uses "Purchased Electricity / Grid electricity / kWh", but each resolves to a *different* factor via `applies_to` (TC-FAC-001 → 0.681 Vietnam; 002 → 0.444 Mexico; 003 → 0.5306 China; 004 → 0.597 Poland; 005 → 0.7117 India). A naive match on category+fuel+unit alone would be ambiguous and wrong. Plant scoping is mandatory.

3. **Parsing `applies_to`.** The value is one of:
   - `"All plants"` → matches all five plants; **or**
   - a comma-separated list whose tokens may be a full ID (`"TC-FAC-001"`) **or** a bare numeric suffix (`"003"`) that inherits the `TC-FAC-` prefix. Example: `"TC-FAC-001, 003, 004, 005"` expands to {TC-FAC-001, TC-FAC-003, TC-FAC-004, TC-FAC-005}. Normalise every token to a full `TC-FAC-00X` ID before comparing.

4. **Aggregation.**
   - `Scope 1 total (plant)` = Σ row emissions where `factor.scope == "Scope 1"`.
   - `Scope 2 total (plant)` = Σ row emissions where `factor.scope == "Scope 2"`.
   - `Category total (plant)` = Σ row emissions grouped by `category`.
   - `All-plants total` for any figure = Σ of that figure across the five plants.

5. **Scope 2 basis.** Location-based only. The register supplies location-based grid and district-heating factors; there are no market-based factors, so the dashboard reports Scope 2 location-based and labels it as such.

**Output:** Scope 1, Scope 2, and combined totals in tCO₂e, plus a per-category breakdown, for each plant and for all plants combined.

**Edge cases:**
- **Unmatched activity row** (no Active factor matches for that plant): do **not** drop silently and do **not** treat as zero without notice. List it in the data-quality flags panel as "unmatched — no factor applied", naming the plant, category, fuel, and unit. *(With the supplied 2026 Q1 data and the 2025 register, every row matches exactly one factor — but the tool must handle this defensively for future data.)*
- **Provisional factor** (`status == "Provisional"`): the resulting figure is included in the totals **and** flagged in the data-quality panel with its `provisional_rationale`. Applies to EF-S2-DH01 (District heating, TC-FAC-004).
- **Montreal Protocol treatment** (`reporting_treatment == "Montreal Protocol"`): included in the totals **and** flagged with a note that the substance falls under Montreal Protocol reporting treatment, so the viewer can decide how to treat it. Applies to EF-S1-010 (R-22, TC-FAC-005).
- **Multiple matching factors** for one row: not expected with this data, but if it ever occurs, flag it rather than picking arbitrarily.

---

## Section 10 — Brand and Visual Direction

**Brand reference:** No brand skill file. Brand is described below and drawn from the builder's LCA Resource template `LCA_CO_TEMPLATE_NewBranding.docx` (the "Sage & Oak" identity), which is uploaded to the repo.

- **Primary colour:** Dark teal `#295A66` (headings / primary UI).
- **Secondary colours (data series + accents):** Sage green `#8DBB70`, Oak/tan `#D0A06F`, Gold `#F0BB44`, Teal `#61ADBF`, Plum `#A3648B`, Orange `#F8943F`. Use these for the category chart series.
- **Neutrals:** Warm charcoal `#4C483D` (body text), warm light grey `#E4E3E2` (page ground / panels).
- **Font:** Headings — Century Gothic (with Open Sans as the practical web fallback, matching the applied styling in the template); body — Garamond. On the web, load web-safe equivalents where the exact faces aren't available.
- **Logo:** Available — embedded in `LCA_CO_TEMPLATE_NewBranding.docx`. Claude Code should extract the logo image from that file (it is the picture in the template header) and use it in the dashboard header and PDF export. If extraction is impractical, prompt the builder to drop the logo file into the repo.

**Visual feel:** Clean, warm, and editorial — professional but human. Generous whitespace, restrained use of the accent palette, numbers presented clearly. Not a dense corporate data-wall; a legible, well-branded results page.

**Reference or inspiration:** The LCA Resource "Sage & Oak" template; consistent in spirit with the existing Corporate suite tools (Supplier Scorecard, Engagement Portal).

---

## Section 11 — API and Credentials

This tool connects to **no external services**. There is no database, no AI API, no email service, and export is generated entirely in the browser.

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| — | None | None | None |

**Credentials readiness:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| None | N/A — no external services | N/A |

> No API keys, tokens, or credentials of any kind are required for this build. Nothing sensitive is committed to the repo.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Five per-plant **data-collection dashboards** | Separate later project. They introduce the Supabase database that will eventually feed this results dashboard. Validate this results view first. |
| **Live / persisted data feed** (Supabase-backed) | Arrives with the data-collection project above. This v1.0 uses fixed bundled data for 2026 Q1. |
| **In-tool CSV upload** (user drops in a new quarter's files through the UI) | Not needed for a single-viewer results view of a fixed period; belongs with the data-collection project. For a new quarter in this version, the builder replaces the bundled files and Claude Code rebuilds. |
| **Market-based Scope 2** reporting | Only location-based factors were supplied. Requires market-based factors / supplier-specific or residual-mix data to add. |
| **Multi-quarter trends / period comparison** | Only 2026 Q1 data exists at this stage. |
| **Scope 3** | Not in scope for this inventory view. |

---

## Section 13 — Acceptance Criteria

Control totals below are computed from the supplied 2026 Q1 files and the 2025 register using the matching and aggregation rules in Section 9 (Scope 2 location-based; all values tCO₂e, rounded to 1 dp). The build must reproduce these.

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Dashboard loads directly with "All Plants (Total)" selected | Header, period label "2026 Q1", headline metrics, category breakdown, sources panel, data-quality panel, and both export buttons all render | [ ] |
| 2 | All-plants headline totals | **Scope 1 = 19,383.5**, **Scope 2 = 32,471.7**, **Combined = 51,855.1** tCO₂e | [ ] |
| 3 | Plant selector re-scopes the whole page | Selecting a plant updates every panel to that plant only; re-selecting "All Plants (Total)" restores the aggregate | [ ] |
| 4 | TC-FAC-001 totals | Scope 1 = 3,874.9 · Scope 2 = 7,218.2 · Total = 11,093.1 tCO₂e | [ ] |
| 5 | TC-FAC-002 totals | Scope 1 = 2,455.9 · Scope 2 = 4,139.9 · Total = 6,595.8 tCO₂e | [ ] |
| 6 | TC-FAC-003 totals | Scope 1 = 2,909.1 · Scope 2 = 4,704.4 · Total = 7,613.5 tCO₂e | [ ] |
| 7 | TC-FAC-004 totals (includes Purchased Heat) | Scope 1 = 6,351.4 · Scope 2 = 9,943.7 · Total = 16,295.1 tCO₂e; Purchased Heat category = 2,584.7 | [ ] |
| 8 | TC-FAC-005 totals | Scope 1 = 3,792.1 · Scope 2 = 6,465.5 · Total = 10,257.6 tCO₂e | [ ] |
| 9 | Country-specific electricity factors resolve correctly | Each plant's Purchased Electricity uses its own grid factor via `applies_to` (e.g. 001 = 7,218.2 tCO₂e at 0.681; 005 = 6,465.5 at 0.7117) | [ ] |
| 10 | Category breakdown per plant | Categories sum to the plant's scope totals; a plant shows only categories with activity (e.g. Purchased Heat appears only for TC-FAC-004) | [ ] |
| 11 | Emission-factor sources panel | Lists the distinct sources applied to the current selection (DEFRA 2025, IPCC AR5 GWP, national grid factors by country, interim source) | [ ] |
| 12 | Data-quality flag — Provisional | TC-FAC-004 district heating flagged as Provisional with its rationale; contributes 2,584.7 tCO₂e | [ ] |
| 13 | Data-quality flag — Montreal Protocol | TC-FAC-005 R-22 flagged as Montreal Protocol treatment; contributes 159.3 tCO₂e | [ ] |
| 14 | Unmatched-row handling | If any activity row has no matching active factor for its plant, it is listed as "unmatched — no factor applied" and not silently dropped (no such rows in the supplied data) | [ ] |
| 15 | CSV export | Downloads the full result set (all plants + total), with plant, scope, category, tCO₂e, period, and source columns | [ ] |
| 16 | PDF export | Downloads a Sage & Oak-branded snapshot of the current selection with logo, period, headline totals, category breakdown, sources, and data-quality flags | [ ] |
| 17 | Branding applied | Sage & Oak palette, fonts, and LCA Resource logo present; clean editorial feel | [ ] |
| 18 | Deploys and loads at the Netlify URL | Live URL renders correctly on desktop and mobile | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 1

### Pre-build steps — complete these before opening Claude Code

- [ ] Tool Architect skill — interview complete, this spec is written and confirmed by the builder ✅ (this document)
- [ ] Project Governor skill — CLAUDE.md and PROGRESS.md produced from this spec
- [ ] GitHub repo created by the builder
- [ ] product-spec.md uploaded to the GitHub repo root
- [ ] CLAUDE.md uploaded to the GitHub repo root
- [ ] PROGRESS.md uploaded to the GitHub repo root
- [ ] Six data files uploaded to the repo root (`TC-FAC-001…005_2026_Q1.csv` + `emission_factor_register_2025.csv`)
- [ ] `LCA_CO_TEMPLATE_NewBranding.docx` uploaded to the repo root (for logo extraction) — or the logo image file directly
- [ ] Netlify MCP active — no manual Netlify connection needed (skip the manual repo-connect step)
- [ ] No credentials required — nothing to prepare

> Claude Code organizes these files into the correct folder structure (docs/, .claude/skills/) automatically at the start of the first session.

---

### Tier 1 — build session

- [ ] Open Claude Code in the project folder (GitHub repo connected to Netlify)
- [ ] Claude Code runs First Session Setup: creates docs/, moves reference files, installs brand skill if provided
- [ ] Claude Code reads product-spec.md, CLAUDE.md, and PROGRESS.md
- [ ] Claude Code parses the six CSVs, implements the Section 9 calculation, and builds the dashboard and exports
- [ ] Verify the build against the Section 13 control totals
- [ ] Test locally before deploying
- [ ] **Netlify MCP active:** Claude Code creates the site and deploys automatically

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Logo extraction from the `.docx` — if Claude Code cannot cleanly pull the embedded logo image, the builder supplies the logo file directly | Builder / Claude Code | No — can resolve during build |
| Display unit is tonnes CO₂e (tCO₂e). If kg CO₂e is preferred anywhere, note it | Builder | No — confirmed as tCO₂e; change only if desired |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 2026-08-10 | Initial build |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*

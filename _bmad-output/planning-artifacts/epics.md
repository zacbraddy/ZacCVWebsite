---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: '2026-06-25'
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-project-ariadne-2026-06-23/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/mockups/backroom-mock.html
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/mockups/console-egg-mock.html
  - _bmad-output/project-context.md
---

# Zac's CV Website — Project Ariadne - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Project Ariadne, decomposing the requirements from the PRD, UX Design (DESIGN.md + EXPERIENCE.md), and Architecture into implementable stories.

Ariadne is a **time-boxed, additive feature project** on the already-complete Theseus codebase (Next.js 16 / React 19 / TS strict / Tailwind v4 / static export). It does two things: (1) restores the site to **CV parity** (current photo, CV, copy) so it is the canonical CV home again, and (2) opens a **Backroom** — an opt-in reading room where a technical evaluator can read how the modernisation decisions were made. The defining discipline is **delivery-first pragmatism**: representative-and-strong over comprehensive; over-investment (backroom + easter-egg rabbit holes) is the named failure mode.

**Architectural anchor:** there is **no project-init story** — every starter-level decision is locked from Theseus. First work is the content refresh; the one new architectural piece is the Velite + Shiki markdown pipeline.

## Requirements Inventory

### Functional Requirements

**Feature 4.1 — Content Refresh (restore Canonical CV home):**

- **FR-1:** Update the portrait photo. Replace the site's portrait with the new staged image (`scratch/avatar pic zac.jpg`), served through the existing `next/image` + Netlify-loader path. Appears wherever the old one rendered (home / about-me).
- **FR-2:** Replace the downloadable CV. Replace the downloadable CV asset with `Zac-Braddy-20260522.pdf`; the download link resolves to the new PDF; the old PDF is removed (not orphaned in the bundle).
- **FR-3:** Bring roles/experience and job titles to CV parity. Update roles/experience and the rotating job titles in `src/config/index.ts` to match the current CV; tweakable values changed in config, not hardcoded; British spelling preserved.
- **FR-4:** Refresh the About-me stats and summary. Correct the Age stat (39 → 41); review other stats for currency; rewrite the lead summary from the old CTO/"strategic vision" positioning to the current We Right Code positioning (Builder → Modernisation → Strategy; strategy as a quality of how he builds, never a standalone service). Rest of About-me (testimonials, what-I-do, things-I-like) out of scope.
- **FR-5:** Prune stale entries. Remove the Twitter social link + unused `faTwitter` import from `socials.tsx`; remove "The Reactionary" content item + dead `theReactionary` thumbnail mapping from `content/page.tsx`; remove the dead `creator: '@zackerthehacker'` handle from all `twitter:` card metadata (re-grep for `@zackerthehacker`/`creator:` rather than trust the file list), keeping the rest of each card. Build + lint stay green (no unused-import errors).

**Feature 4.2 — Public Docs Derivation (curate the Representative first cut):**

- **FR-6:** Curate Public docs from the Decision trail. Produce a set of polished markdown Public docs in `docs/public/`, derived (one-way) from the Theseus Decision trail (`_bmad-output/archive/project-theseus/`), covering the Representative first cut: at minimum the framework decision (and why not Astro) and the headline pragmatism call(s); at least part of the set makes the AI-augmented / BMAD way of working visible. Polished public-facing prose (British spelling, no internal audit noise), each carrying valid frontmatter per the `docs/public/` contract.

**Feature 4.3 — The Backroom (render Public docs):**

- **FR-7:** Render Public docs to themed HTML. Each Public doc renders as a themed HTML page in the Backroom, generated at build time from `docs/public/` markdown via the Velite pipeline. Every doc produces a statically-exported route (`○ (Static)`, no `.func`); rendered pages use CSS-variable theme tokens and respond to the dark/light toggle; markdown features (headings, lists, links, tables, code) render correctly; Backroom routes covered by the existing GA setup (no new wiring).
- **FR-8:** Navigate between Public docs. The Backroom presents a sectioned list/index of available docs and lets the visitor open any of them; navigation works within the static export (no server routing).
- **FR-9:** Syntax-highlight code blocks. Fenced code blocks render syntax-highlighted; highlighting present in the prerendered HTML (works without client JS where feasible) and theme-consistent.

**Feature 4.4 — Entry Points (Entry link & Console easter egg):**

- **FR-10:** Entry link from Front-of-house. A _"More interested in how this site is built?"_ link, present but visually understated, navigating to the Backroom; keyboard-accessible; works in the static export; never competes with the flash.
- **FR-11:** Console easter egg. On page load, an ASCII-art message is emitted to the browser console with clickable links to the Backroom and the public GitHub repo; present whenever a visitor opens dev tools (including after page load — relies on browser console-buffer retention; dev-tools-detection re-emit only as an evidence-driven fallback). Single static message, no multi-stage sequence.

### NonFunctional Requirements

- **NFR-1 — Static-export compatibility (hard constraint):** The Backroom and markdown pipeline must render fully at build time to `out/`. No server runtime, API routes, SSR/ISR, or middleware (`output: 'export'`). Markdown → HTML happens at build time only.
- **NFR-2 — Zero Front-of-house regression:** Visual and functional parity with the live site; flash intact; mobile flawless; route-transition animations preserved. Every Backroom change is additive.
- **NFR-3 — Theming & structure:** Backroom uses the CSS-variable theme tokens (dark default + `.light`), supports the toggle, follows the atomic-design tiers — no hardcoded colours, no styled-components, components in the correct tier.
- **NFR-4 — Performance:** No material Lighthouse/perf regression; modest client-JS budget; favour build-time rendering and static highlighting (Shiki baked into the HTML, zero client JS for docs).
- **NFR-5 — Accessibility:** Backroom pages use semantic HTML, are readable/keyboard-navigable; `aria-current="page"` on the active nav row; the Entry link is keyboard-accessible and clears AA on the page gradient in both themes.
- **NFR-6 — Analytics continuity & coverage:** The existing GA (`G-F98QXJC4S0` via `@next/third-parties` in the root layout) keeps working and covers new Backroom routes automatically (same root layout); verify page-views fire for Backroom routes; no custom events, no re-architecture.
- **NFR-7 — Dependency restraint:** Prefer existing libraries; the markdown pipeline + highlighter are the one expected new dependency, flagged and justified; nothing else added casually; nothing ships to the client beyond the existing budget.

### Additional Requirements

_Technical requirements from the Architecture document that shape implementation._

- **AR-1 — No starter template / no project-init story.** Ariadne extends the existing scaffolded codebase; every starter-level decision is locked from Theseus. First implementation work is the content refresh; do not re-scaffold.
- **AR-2 — Markdown pipeline: Velite (D1).** `docs/public/*.md` → Velite → typed, build-time data. Velite owns parse, frontmatter validation (Zod), remark/rehype rendering, Shiki highlighting, and typed-data output. react-markdown rejected (sync engine can't host async Shiki); next-mdx-remote/MDX rejected (JSX-in-markdown is a v1 NON-GOAL + async friction).
- **AR-3 — Syntax highlighting: Shiki (D1).** Via `@shikijs/rehype` + `createCssVariablesTheme()`; `--shiki-*` CSS vars in `globals.css` mapped to theme tokens (+ `code-surface`), flipping with `.light`. Highlighting baked into build-time HTML → zero client JS.
- **AR-4 — `docs/public/` source contract + frontmatter Zod schema (D2).** Backroom renders `docs/public/*.md` only; `docs/decisions/` ADRs stay internal/unrendered. Frontmatter fields: `title` (string), `section` (enum `Overview | Decisions | Pragmatism & process`), `order` (number), `teaser` (string), optional `adr` (number, only meaningful for Decisions). Tile derived (no glyph field): Overview → ★ gold, Pragmatism & process → ◆ gold, Decisions → `adr` number cyan. Slug = filename (kebab-case); no `slug` field. Empty sections omitted from nav. Invalid/missing frontmatter fails the Velite build with a clear error. Order collisions / duplicate `adr` → stable secondary sort by filename.
- **AR-5 — Routing & data consumption (D3).** `/backroom` = Overview ("Start here"); `/backroom/[slug]` = each doc. `generateStaticParams` maps over Velite's generated `docs` array; `export const dynamicParams = false`. Page renders `doc` HTML via `dangerouslySetInnerHTML` (first-party trusted content). Sectioned nav built from the same typed array grouped by `section`. No hand-rolled fs loader, no `gray-matter`.
- **AR-6 — Build integration (Turbopack-safe).** `next.config.ts` awaits Velite's `build()` before Next compiles (official Next-config approach, not the legacy webpack plugin). No `npm-run-all`, no `netlify.toml` change. Velite emits typed data to `.velite/` (gitignored) with a generated `.d.ts`. `.gitignore` adds `.velite/`. Dev: Velite watch mode + Next dev.
- **AR-7 — Layout restructure into route groups (D4).** Split the current root `layout.tsx`: root layout → global chrome only (`<html>/<body>`, fonts, `Providers`, `ThemeToggle`, `LoadingSpinner`, `GoogleAnalytics`, console-egg). `(site)/layout.tsx` → FoH shell moved **verbatim** (sidebar/portrait/hero/nav/`ContentTransition`/FrozenRouter) + the FoH-only Entry link; FoH pages move into `(site)/`. `backroom/layout.tsx` → two-pane reading room. URLs unchanged (route groups URL-invisible). `MenuProvider` stays global; each room supplies its own `MobileMenu` contents into the shared vaul drawer. **Highest-attention zero-regression gate (G1):** relocate verbatim, verify with build + side-by-side visual diff.
- **AR-8 — Backroom route-transition gate (conditional, D4/G4).** Implementer takes the path of least resistance — no special work to add _or_ remove the route transition. Likely outcome: no inter-doc transition (fresh Backroom layout omits `ContentTransition`/FrozenRouter). **If** least-resistance leaves transitions → Zac reviews (approve-with-transitions or require removal); **if** none → ship as-is. Do not fight the default.
- **AR-9 — Console easter egg mechanism (D5).** A `'use client'` component in the **root** layout (fires on any page), emitting ASCII art via `console` on mount, returns `null` (no DOM). On-load emit primary; dev-tools-detection re-emit is an evidence-driven fallback only (G3 — verify buffer retention across target browsers).
- **AR-10 — New dependencies (flagged).** `velite` (devDependency); `@shikijs/rehype` / `shiki`. Pinned `velite@0.4.0`, `@shikijs/rehype@4.3.0` against Next `16.2.9` / React `19.2.7`. Net line-item count lower than hand-assembly; nothing ships to the client.
- **AR-11 — ADR 0027 (already authored).** `docs/decisions/0027-markdown-pipeline-velite-shiki.md` was authored 2026-06-25 (decision locked in `architecture.md`; indexed in the decisions README; resolves the previously-open AR20 pipeline item). It captures the decision and trail (why react-markdown rejected, why hand-assembly rejected, Turbopack/`next.config` integration, Shiki CSS-variables theming). Story 2.3 implements _per_ this ADR and amends it only if the as-built pipeline diverges. (Meta-note: this ADR is itself prime Backroom material.)
- **AR-12 — Theme-token discipline for rendered output (cross-cutting).** The doc renderer and the Shiki theme emit theme-token-mapped colours (incl. new `code-surface`, `text-dim`) responding to the toggle; no hardcoded hex, no raw Tailwind palette. Velite-rendered HTML is styled via a single scoped prose block (`doc-content.module.css`) using theme tokens, capped to the 64ch reading measure — Tailwind utilities cannot hang on injected HTML.
- **AR-13 — Internal doc-to-doc link resolution.** Internal links use absolute Backroom paths (`[text](/backroom/<slug>)`), never `./file.md`, so they resolve in the static export. A missing target must not break the build (verify during the story).
- **AR-14 — Component placement (atomic tiers).** atoms: `number-tile`, `glyph-tile`, `section-label`, `back-link`, `entry-link`, `console-egg` (client, returns null). molecules: `backroom-nav-row` (whole row is one `<Link>`, `aria-current="page"` when selected). organisms: `backroom-nav` (sectioned list), `doc-content` (renders the markdown HTML). Backroom layout/pages under `src/app/(backroom)/` (note: arch tree shows `src/app/backroom/` for pages — resolve the exact group path in the story; URLs unchanged either way).
- **AR-15 — Verification (no test suite).** `npm run build` green, every route `○ (Static)` incl. `/backroom` + each `/backroom/<slug>`, no `.func`; `npm run lint` clean; manual preview for FoH zero-regression, theme toggle in the Backroom, Shiki highlighting in both themes, console egg. Do not fabricate test runs.

### UX Design Requirements

_First-class actionable work items from DESIGN.md + EXPERIENCE.md (visual identity, behaviour, IA, states, accessibility). Mockups are composition reference; the spines win on conflict._

- **UX-DR1 — New theme tokens.** Add `text-dim` (`#b9bcc0` dark / supporting voice) and `code-surface` (`#1e1e1e`, both themes) as `--color-*` CSS vars in BOTH `:root` and `.light` (code-surface constant across themes), with matching `@utility` blocks in `globals.css`. Plus the `--shiki-*` variable mappings in `@layer base` (+ `.light` override).
- **UX-DR2 — Two-pane reading-room layout (lg+).** Near-full-bleed two-pane shell inside a 48px gradient frame on all sides: left nav panel 320px `bg-primary-200` (scrolls independently); content pane flexible `bg-primary-400`, 56px horizontal padding, reading column capped at 64ch and left-aligned. Single soft drop shadow to lift the shell off the gradient permitted; flat/tonal otherwise (one-step tonal difference, no heavy borders/shadow).
- **UX-DR3 — Responsive collapse (< lg).** Single column; nav panel hidden in portal, its entire contents (back link + sections + rows) move into the existing vaul hamburger drawer (`MobileMenu`); content full-width; Entry link relocates into the drawer as a quiet item. Mirrors the FoH mobile pattern. `xs: 410px` custom breakpoint applies.
- **UX-DR4 — Nav row component (molecule).** "LinkedIn job-row in our colours": 40px tile + two-line text (title + one teaser line), 12px tile-to-text gap, 8px radius. Whole row is one `<Link>` to its doc route. Hover: faint light wash (`rgba(250,250,250,0.06)`). Selected: cyan-tint bg (`rgba(4,180,224,0.14)`) + left cyan accent bar + tile inverts to solid cyan fill; `aria-current="page"`. Keyboard-focusable; Enter/click navigates.
- **UX-DR5 — Number tile (atom).** 40px cyan-bordered square (`bg-primary-400`, `text-secondary` fg, `1px rgba(4,180,224,0.4)` border, 8px radius) holding the ADR number; selected → solid cyan fill with `bg-primary-400` fg.
- **UX-DR6 — Glyph tile (atom).** As number-tile but gold (`text-tertiary` fg, `1px rgba(224,180,4,0.45)` border) — ◆ for Pragmatism & process, ★ for Overview. The tile is what distinguishes the three nav sections at a glance.
- **UX-DR7 — Section label (atom).** Tiny heavily-tracked dim caps (`OVERVIEW` / `DECISIONS` / `PRAGMATISM & PROCESS`), `text-dim` at ~0.7 opacity. Structural, not loud.
- **UX-DR8 — Back link (atom).** `◀ back to the site`, `text-dim`, cyan on hover; top of the nav; the single exit affordance inside the Backroom; returns to front-of-house (default home).
- **UX-DR9 — Entry link (atom).** `More interested in how this site is built? →`, front-of-house only, pinned bottom-left page chrome on the gradient, mirrors the top-left theme toggle. Understated: dotted underline + subtle text-shadow, ~0.82 opacity, `text-primary`. Must clear AA across the full gradient in BOTH themes (verify against the gold/terracotta end). Never shown inside the Backroom.
- **UX-DR10 — Doc renderer (organism).** Eyebrow (cyan section name) + Permanent-Marker doc title (38px, once per page) + meta line, then Roboto prose at 1.7 line-height capped to 64ch, `h2` subheads, inline cyan links, gold pragmatism call-outs, syntax-highlighted code blocks. Permanent Marker used exactly once per doc.
- **UX-DR11 — Pragmatism call-out.** A markdown blockquote (`> …`) renders as a left gold bar + faint gold wash (`rgba(224,180,4,0.08)`), radius `0 8px 8px 0`. No plugin, no custom syntax.
- **UX-DR12 — Code block styling.** `code-surface` near-black background, 8px radius, hair-thin light border (`1px rgba(255,255,255,0.06)`), monospace 12.5px / 1.6; Shiki highlighting present in prerendered HTML, legible in both themes.
- **UX-DR13 — Console easter egg visual + copy.** Cyan ASCII wizard + speech bubble + two clickable links (Backroom route, public GitHub repo) + a dim wink line. Casual, charming-not-cringe (e.g. "Ah, I see you're also a tech wizard. Well — while you're here, you may as well come in."); structure locked, exact wording an implementation tweak; both links must stay. See `console-egg-mock.html`.
- **UX-DR14 — Backroom Overview ("Start here") content + framing.** The Overview is the landing surface: explains what the Backroom is + the sales-pitch framing ("Here's how the decisions were actually made — trade-offs and all."), with its nav row selected by default. Rendered from `docs/public/start-here.md`.
- **UX-DR15 — Sectioned nav ordering & empty-section handling (organism).** Static grouping Overview → Decisions (ADRs by number) → Pragmatism & process. Built from Velite typed data; new `docs/public/` file slots into its section on next build with no manual nav edit; sections with no docs are omitted.
- **UX-DR16 — Typography scale.** Apply the Backroom type scale: doc-title (Permanent Marker 38px/1.1), doc-h2 (Roboto 19px/500), eyebrow (13px/600, 0.04em), body (16px/400/1.7), nav-row-title (14px/500), nav-row-teaser (12px/400, `text-dim`), section-label (10.5px/700, 0.14em), number-tile (15px/700), code (12.5px/1.6). Radius working value 8px (`rounded.md`).
- **UX-DR17 — Microcopy & voice.** British spelling throughout; competent-and-candid, judgement-forward, never bragging. Specific strings: Entry link, `◀ back to the site`, section labels, teasers ("Why Next.js — and why not Astro"), the source/repo link ("→ The source"), pragmatism call-out tone. Per the Do/Don't voice table in EXPERIENCE.md.
- **UX-DR18 — Accessibility floor.** Semantic HTML (headings in order, `nav`, `main`, lists, `<a>`); nav is a labelled landmark; active row `aria-current="page"`; Entry link a real keyboard-accessible link with discernible text; code blocks remain readable as text (highlighting presentational only); tab order matches reading order; focus visible (inherits site styles); mobile drawer keyboard-operable.
- **UX-DR19 — Theme toggle continuity.** The toggle stays in its top-left chrome position site-wide including the Backroom; all Backroom surfaces respond; no hardcoded colours.

### FR Coverage Map

| FR    | Epic   | Description                                                 |
| ----- | ------ | ----------------------------------------------------------- |
| FR-1  | Epic 1 | Portrait photo swap                                         |
| FR-2  | Epic 1 | Downloadable CV PDF replacement                             |
| FR-3  | Epic 1 | Roles/job-titles to CV parity (`src/config`)                |
| FR-4  | Epic 1 | About-me stats (39→41) + summary reposition                 |
| FR-5  | Epic 1 | Prune stale entries (Twitter, The Reactionary, dead handle) |
| FR-6  | Epic 2 | Curate Public docs into `docs/public/`                      |
| FR-7  | Epic 2 | Render docs to themed HTML (Velite)                         |
| FR-8  | Epic 2 | Sectioned in-Backroom navigation                            |
| FR-9  | Epic 2 | Shiki syntax highlighting                                   |
| FR-10 | Epic 2 | Entry link from front-of-house                              |
| FR-11 | Epic 2 | Console easter egg                                          |

All 11 FRs mapped. NFR-1–7, AR-1–15, and UX-DR1–19 are predominantly Epic 2 (the Backroom build); **NFR-2 (zero front-of-house regression) spans both epics**.

## Epic List

### Epic 1: Restore the Canonical CV Home

Bring front-of-house to CV parity so the site is once again the current, authoritative place Zac points people to — current photo, current downloadable CV, current roles/titles, refreshed About-me positioning, stale entries pruned — with **zero change to structure, design, or flash**. Pure data/config/asset/copy edits, no redesign. Realises UJ-1.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5
**Standalone:** Yes — no Backroom dependency; the architecture's recommended safest first slice. Discipline: stay thin, do not gold-plate.

### Epic 2: Open the Backroom

Stand up the opt-in Backroom end-to-end so a technical evaluator can discover a way in, reach curated docs, and read how the modernisation decisions were actually made — and so Zac can extend it later by dropping a markdown file into `docs/public/`. Curate the Representative first cut; restructure the layout into route groups (verbatim front-of-house relocation — the G1 zero-regression gate); build the Velite + Shiki pipeline and the two-pane reading room with sectioned nav and highlighted code; add the two understated entry points (Entry link + console easter egg). Author ADR 0027. Realises UJ-2 and UJ-3.
**FRs covered:** FR-6, FR-7, FR-8, FR-9, FR-10, FR-11
**Standalone:** Yes — builds on the existing codebase, does not require Epic 1. Minor merge-ordering note only: doing Epic 1 first means Epic 2's layout split relocates the already-edited front-of-house pages — clean either way.

## Epic 1: Restore the Canonical CV Home

Bring front-of-house to CV parity so the site is once again the current, authoritative place Zac points people to — with **zero change to structure, design, or flash**. This epic is data/config/asset/copy edits only; the discipline is to stay thin and not gold-plate. All file paths below are the **current** locations (pre-Epic-2 layout split); Epic 2 later relocates these pages verbatim into `(site)/`. Realises UJ-1. Covers FR-1–FR-5. Verification throughout (no test suite): `npm run build` green + clean static export (every route `○ (Static)`), `npm run lint` clean, manual deploy-preview check.

### Story 1.1: Swap in the current photo and CV

As Zac, the maintainer,
I want the site to serve my current portrait photo and current downloadable CV,
So that a recruiter clearing the credibility gate sees the real, current me and grabs an up-to-date CV (UJ-1).

**Acceptance Criteria:**

**Given** the staged assets `scratch/avatar pic zac.jpg` (new portrait) and `scratch/Zac-Braddy-20260522.pdf` (current CV)
**When** the portrait is published into the existing image path consumed by `atoms/portrait-image.tsx` (`/images/zac-portrait.jpg`)
**Then** the new portrait renders everywhere the old one did — the home/about-me portrait via `next/image` (not a raw `<img>`) and the OG/Twitter `images: ['/images/zac-portrait.jpg']` references across `layout.tsx`, `page.tsx`, `about-me/page.tsx`, `resume/page.tsx`, `content/page.tsx`
**And** no stale/old portrait file is left orphaned in `public/`.

**Given** the current CV download link `nav-links.tsx:30 → href="/pdfs/zac-braddy.pdf"`
**When** the staged CV PDF is published so that link resolves to the current document
**Then** clicking the CV download link serves the current CV (the 2026-05-22 document) in a deploy/preview build
**And** the previous CV PDF is not left orphaned in the bundle.

**Given** the asset swaps are complete
**When** `npm run build` and `npm run lint` are run
**Then** the build is a clean static export (every route `○ (Static)`, no `.func`) and lint is clean
**And** the new portrait renders correctly through the Netlify image CDN in a deploy preview (the dev loader returns the raw `src`).

### Story 1.2: Update roles and rotating job titles to CV parity

As Zac, the maintainer,
I want the site's roles/experience and rotating job titles to match my current CV,
So that the site is honest and current as my canonical CV home, with no missing recent roles (UJ-1).

**Acceptance Criteria:**

**Given** the staged CV `scratch/Zac-Braddy-20260522.pdf` as the source of truth
**When** the on-site copy delta is enumerated by reading that PDF (the exact delta is determined here, not pre-listed)
**Then** the rotating job title values (`JOB_TITLE` / `JOB_TITLES`) are updated in `src/config/index.ts` — changed in config, never hardcoded into components.

**Given** the experience/roles shown on-site (the experience organism(s))
**When** they are compared against the roles in the staged CV
**Then** the on-site experience matches the CV with no missing recent roles
**And** British spelling is preserved throughout.

**Given** the edits are complete
**When** `npm run build` and `npm run lint` are run
**Then** the build is a clean static export and lint is clean
**And** the rotating-title animation still behaves exactly as before (no front-of-house regression).

### Story 1.3: Reposition the About-me stats and summary

As Zac, the maintainer,
I want the About-me stats corrected and the lead summary rewritten to my current positioning,
So that a visitor reads an accurate reflection of what I build now, not the old CTO framing (UJ-1).

**Acceptance Criteria:**

**Given** the About-me page (`src/app/about-me/page.tsx`) and organism (`src/components/organisms/about-me.tsx`)
**When** the stat row is reviewed for currency
**Then** the Age stat is corrected (39 → 41) and any other stale stat is corrected
**And** the stats remain factually accurate.

**Given** the current lead summary copy (which reads as the old "technology leader… as a CTO… strategic vision" positioning)
**When** it is rewritten to the current We Right Code positioning
**Then** the summary leads with what Zac **builds** — 0-to-1 Builder & System Modernisation Specialist — following the Builder → Modernisation → Strategy gradient, with strategy reading as a _quality of how he builds_, never a standalone service ("builds with strategy in mind" is right; "provides strategic technical leadership" is wrong)
**And** British spelling is preserved.

**Given** the change is scoped to stats + lead summary only
**When** the rest of the About-me page is considered (testimonials, what-I-do, things-I-like)
**Then** those sections are left untouched (out of scope per the PRD)
**And** `npm run build` + `npm run lint` stay green.

### Story 1.4: Prune stale entries

As Zac, the maintainer,
I want aged-out entries removed from the site,
So that the site stays honest and current with no dead links or abandoned-account pointers (UJ-1, Canonical CV home).

**Acceptance Criteria:**

**Given** `src/components/molecules/socials.tsx` contains a Twitter social link
**When** the Twitter link is removed
**Then** the now-unused `faTwitter` import is also dropped, leaving LinkedIn + GitHub
**And** there is no unused-import lint error.

**Given** the "The Reactionary" content item in `src/app/content/page.tsx` and its `theReactionary` thumbnail mapping in `src/components/atoms/content-thumbnail.tsx`
**When** the content item is removed
**Then** the now-dead `theReactionary` thumbnail mapping is cleaned up with no orphaned asset references.

**Given** the dead-account `creator: '@zackerthehacker'` handle appears in the `twitter:` metadata blocks
**When** the codebase is **re-grepped for `@zackerthehacker` / `creator:`** (rather than trusting a fixed file list) — at time of writing present in `layout.tsx`, `page.tsx`, `about-me/page.tsx`, `resume/page.tsx`, `content/page.tsx`
**Then** the `creator:` handle is removed from every `twitter:` block it appears in
**And** the rest of each `twitter:` card (`card`, `title`, `images`) is **kept** so shared links still preview richly on X.

**Given** all pruning is complete
**When** `npm run build` and `npm run lint` are run
**Then** both stay green (no unused-import errors) and the static export is clean.

## Epic 2: Open the Backroom

Stand up the opt-in Backroom end-to-end so a technical evaluator can discover a way in, reach curated docs, and read how the modernisation decisions were actually made — and so Zac can extend it later by dropping a markdown file into `docs/public/` (UJ-2, UJ-3). This is the substantive architectural work: the Velite + Shiki pipeline, the route-group layout split (the G1 zero-regression gate), the two-pane reading room, and the two understated entry points. Covers FR-6–FR-11, NFR-1–7, AR-1–15, UX-DR1–19. There is **no project-init story** (AR-1). Discipline: representative-and-strong over comprehensive; calm and content-first over flash (SM-C1/SM-C2). Verification throughout (no test suite): `npm run build` green (every route `○ (Static)` incl. `/backroom` + each `/backroom/<slug>`, no `.func`), `npm run lint` clean, manual preview for FoH zero-regression, theme toggle in the Backroom, Shiki highlighting in both themes, and the console egg.

### Story 2.1: Curate the Representative first cut into `docs/public/`

As Zac, the author,
I want a bounded, high-impact set of polished Public docs derived from the Theseus Decision trail,
So that a technical evaluator reads how the decisions were actually made — trade-offs and all — and so the `docs/`-as-source model makes later extension frictionless (UJ-2, UJ-3).

**Acceptance Criteria:**

**Given** the Theseus Decision trail in `_bmad-output/archive/project-theseus/` as the one-way source
**When** the Representative first cut is selected and edited into polished markdown under `docs/public/`
**Then** `docs/public/` contains polished public-facing markdown files (not raw copies of trail artefacts), curated/edited and free to deviate in depth from the source
**And** the set includes at minimum the framework decision (Gatsby → Next.js, and why _not_ Astro) and the headline pragmatism call(s) including "deferring polish to protect delivery velocity"
**And** at least part of the set makes the AI-augmented / BMAD way of working visible (not just _what_ was decided but that it was produced _with_ the agentic workflow).

**Given** the `docs/public/` frontmatter contract (AR-4 / UX-DR-frontmatter)
**When** each doc's frontmatter is authored
**Then** every file carries valid `title`, `section` (`Overview | Decisions | Pragmatism & process`), `order`, `teaser`, and optional `adr` (only for `Decisions`), with the slug being the kebab-case filename (no `slug` field, no glyph field — tiles are derived)
**And** an Overview doc (`start-here.md`) exists explaining what the Backroom is plus the sales-pitch framing (UX-DR14), e.g. "Here's how the decisions were actually made — trade-offs and all."

**Given** the authoring conventions (AR-13, UX-DR11, UX-DR17)
**When** the prose is written
**Then** pragmatism call-outs are plain markdown blockquotes (`> …`), internal doc-to-doc links use absolute Backroom paths (`[text](/backroom/<slug>)`) never `./file.md`, and the voice is competent-and-candid with British spelling and no internal audit noise.

**Note:** the precise doc list is selected here, not pre-listed; the bar is "representative and strong," not "complete" (SM-C1). Candidate set per the architecture: `start-here.md`, `framework-decision.md` (adr: 4), `deferring-the-polish.md`, `building-with-ai-and-bmad.md`. (ADR 0027 is authored in Story 2.3, not here.)

### Story 2.2: Split the layout into two rooms

As Zac, the maintainer,
I want the layout split into a global root shell, a front-of-house room, and a Backroom room,
So that the Backroom can have its own chrome without the front-of-house sidebar leaking into it — while the front-of-house renders byte-identically (zero regression).

**Acceptance Criteria:**

**Given** the front-of-house shell currently lives in the root `src/app/layout.tsx`
**When** the root layout is reduced to **global chrome only** — `<html>`/`<body>`, fonts, `Providers` (theme), `ThemeToggle`, `LoadingSpinner`, `GoogleAnalytics` (the root layout becomes the home for the console egg added later in Story 2.7, but this story does not require it to exist) — and the FoH shell (sidebar/portrait/hero/`NavLinks`/`ContentTransition`/FrozenRouter) is moved **verbatim** into a new `src/app/(site)/layout.tsx`
**Then** all front-of-house pages move into the `(site)/` group (home, about-me, resume, content) and their URLs are unchanged (route groups are URL-invisible)
**And** `MenuProvider` stays global so the shared vaul drawer still works.

**Given** the new `(backroom)` route group
**When** a minimal `(backroom)` layout and a placeholder `/backroom` route are created
**Then** `/backroom` resolves as a static route distinct from the FoH shell (no FoH sidebar), with at least a `back to the site` affordance present
**And** GA (in the root layout) automatically covers the new `/backroom` route (NFR-6 — verify a page-view fires, e.g. in GA real-time, during the story).

**Given** the verbatim relocation (the G1 zero-regression gate, NFR-2)
**When** `npm run build` is run and the front-of-house is compared side-by-side before/after
**Then** the static export is clean (every route `○ (Static)`, no `.func`), `npm run lint` is clean, and the front-of-house shows **zero visual or functional regression** — sidebar, portrait, hero, nav, route-transition animations, and mobile drawer all behave exactly as the live site.

### Story 2.3: Render Public docs via the Velite + Shiki pipeline

As a technical evaluator,
I want each Public doc rendered as a themed, syntax-highlighted HTML page at build time,
So that I can read the decisions in the site's own visual language with legible code, with no server runtime (UJ-2).

**Acceptance Criteria:**

**Given** the markdown pipeline decision (AR-2/AR-3/AR-10)
**When** `velite` (devDependency) and `@shikijs/rehype`/`shiki` are installed and `velite.config.ts` is created with a collection over `docs/public/*.md`
**Then** the collection enforces the AR-4 frontmatter via a **Zod schema** (invalid/missing frontmatter **fails the build** with a clear error), renders the body to an HTML string with **Shiki** highlighting via `@shikijs/rehype` + `createCssVariablesTheme()`, and emits typed data to `.velite/`
**And** `.velite/` is gitignored and `next.config.ts` awaits Velite's `build()` before Next compiles (the Turbopack-safe Next-config hook — not the webpack plugin; no `netlify.toml` change).

**Given** the new theme tokens (UX-DR1) and rendered-HTML styling discipline (AR-12, UX-DR10/11/12/16)
**When** `globals.css` is edited
**Then** `text-dim` and `code-surface` are added as `--color-*` vars in BOTH `:root` and `.light` (code-surface constant across themes) with matching `@utility` blocks, and the `--shiki-*` variables are mapped to theme tokens in `@layer base` with a `.light` override
**And** the doc body (injected via `dangerouslySetInnerHTML`, first-party trusted content) is styled by a single scoped `doc-content.module.css` prose block targeting `h1/h2/p/ul/ol/li/a/blockquote/code/pre/table/th/td` using **theme tokens only** (no hex, no raw Tailwind palette), capped to the 64ch reading measure, with blockquotes rendering as the gold pragmatism call-out and code blocks on the `code-surface` plane.

**Given** the routing contract (AR-5)
**When** `/backroom` (Overview, renders `start-here.md`) and `/backroom/[slug]` (one doc) are implemented
**Then** `generateStaticParams` maps over Velite's generated `docs` array with `export const dynamicParams = false`, every doc produces a statically-exported route (`○ (Static)`, no `.func`), and `doc-content` (organism) renders the doc HTML
**And** markdown features (headings, lists, links, tables, code) render correctly, syntax highlighting is present **in the prerendered HTML** (zero client JS for docs), and both render and highlighting respond correctly to the dark/light toggle (UX-DR19).

**Given** internal doc-to-doc links (AR-13) and a `back to the site` affordance
**When** a doc links to another via an absolute `/backroom/<slug>` path
**Then** the link resolves within the static export, a missing target does **not** break the build (verify), and a `back-link` atom (`◀ back to the site`, UX-DR8) lets a visitor return to front-of-house so no rendered doc is a dead-end.

**Given** the decision trail discipline (AR-11) and that ADR 0027 already exists (`docs/decisions/0027-markdown-pipeline-velite-shiki.md`, authored 2026-06-25, indexed in the decisions README)
**When** the pipeline is implemented
**Then** the implementation follows ADR 0027 (Velite + Shiki, the `next.config.ts` Turbopack-safe hook, the Shiki CSS-variables theming) and the ADR is **updated only if the as-built pipeline diverges** from it
**And** `npm run build` + `npm run lint` are green and the new dependencies are the only additions (NFR-7).

### Story 2.4: Build the two-pane reading room and sectioned navigation

As a technical evaluator,
I want a calm two-pane reading room with a sectioned, scannable navigation of the docs,
So that I can see the shape of the decision set at a glance and move between docs easily, on desktop or mobile (UJ-2).

**Acceptance Criteria:**

**Given** the Backroom layout and the Velite typed `docs` array
**When** the `(backroom)` layout is upgraded to the two-pane reading room (UX-DR2)
**Then** at `lg+` it is a near-full-bleed two-pane shell inside a 48px gradient frame: a 320px `bg-primary-200` left nav panel that scrolls independently, and a flexible `bg-primary-400` content pane with 56px horizontal padding and the reading column capped at 64ch, left-aligned
**And** depth is flat/tonal (the one-step nav/content tonal difference; at most a single soft shell drop-shadow), no hardcoded colours, theme toggle works throughout (UX-DR19).

**Given** the navigation components (FR-8, AR-14, UX-DR4/5/6/7/15)
**When** the sectioned nav is built from the Velite typed data
**Then** `backroom-nav` (organism) groups rows under `OVERVIEW` → `DECISIONS` (ADRs by `adr` number) → `PRAGMATISM & PROCESS`, omitting any empty section; `backroom-nav-row` (molecule) is a single `<Link>` (40px tile + title + one `text-dim` teaser line) with hover wash, `selected` state (cyan tint + left accent bar + inverted tile) and `aria-current="page"` on the current doc
**And** the tiles are atoms — `number-tile` (cyan, ADR number), `glyph-tile` (gold ◆ for Pragmatism & process, gold ★ for Overview) — with `section-label` (tracked dim caps) atoms, and `order`/`adr` collisions fall back to a stable secondary sort by filename
**And** a new `docs/public/*.md` file slots into its section on the next build with no manual nav edit (UJ-3).

**Given** the responsive behaviour (UX-DR3) and accessibility floor (UX-DR18)
**When** the viewport is below `lg`
**Then** the nav panel is hidden in the portal and its entire contents (back link + sections + rows) move into the existing vaul hamburger drawer (`MobileMenu`), content runs full-width, mirroring the FoH mobile pattern
**And** the Backroom uses semantic HTML (`nav` as a labelled landmark, `main`, headings in order, lists, real `<a>`), tab order matches reading order, focus is visible, and the drawer is keyboard-operable.

**Given** the conditional route-transition gate (AR-8 / G4)
**When** the new Backroom layout is authored taking the path of least resistance (no special work to add _or_ remove a route transition)
**Then** the outcome is reviewed: if the least-resistance result leaves the Backroom **with** transitions, Zac decides approve-with-transitions or require removal; if it leaves **none**, ship as-is
**And** `npm run build` (all Backroom routes `○ (Static)`) + `npm run lint` are green; do not re-introduce a transition inside the Backroom without this review.

### Story 2.5: Deepen the Decisions section with representative MADR-format ADRs

As Zac, the author,
I want a representative set of my strongest architectural decisions ported into the Backroom as polished, public-facing docs in MADR structure,
So that a technical evaluator sees how I actually run decisions — context, trade-offs, rejected alternatives and the trail — not a single prose retelling, and so the Decisions section earns its place beside the Pragmatism & process set (UJ-2, UJ-3).

**Acceptance Criteria:**

**Given** the internal MADR trail in `docs/decisions/0001–0028` as the one-way source (AR-4: `docs/decisions/` stays internal/unrendered — these are _derived_ into `docs/public/`, not rendered in place)
**When** the representative-and-strong cut is selected (10-11 of the most salient ADRs, NOT all 28 — over-investment is the named failure mode, SM-C1)
**Then** `docs/public/` gains 10-11 new polished, public-facing markdown docs (`section: Decisions`), each derived from its source ADR with British spelling and no internal audit noise, free to deviate in depth from the source
**And** the selection leans on the headline modernisation calls (e.g. the Next/React/TS stack, Tailwind v4, removing styled-components, the big-bang TS conversion, static-export deploy, the route-transition/FrozenRouter call, and ADR 0027 the pipeline itself — "prime Backroom material") with the final list chosen in-story.

**Given** the frontmatter contract (AR-4) and the sectioned-nav data model (Story 2.4, UX-DR15)
**When** each ported doc's frontmatter is authored
**Then** every file carries valid `title`, `section: Decisions`, `order`, `teaser`, and `adr` (the real ADR number), so each slots into the DECISIONS group with a cyan `number-tile` and sorts by `adr` (filename as the stable secondary sort) with no manual nav edit (UJ-3)
**And** the existing `framework-decision.md` is reconciled into the set — its `adr:` value corrected to the ADR it actually describes — and a decision is taken in-story on whether it adopts the MADR structure or stays the narrative "why Next, why not Astro" entry.

**Given** the doc renderer + authoring conventions (UX-DR10/11/12/16/17, AR-13)
**When** the MADR prose is written
**Then** each doc renders the MADR shape as `h2` sections (Context → Decision → Consequences → Rejected alternatives → trail/status), with real fenced code blocks where the decision genuinely involved config/code (so Shiki highlighting now shows actual content — closing the Story 2.3 review finding that no code shipped), gold blockquote call-outs for pragmatism notes, and absolute `/backroom/<slug>` internal links
**And** Permanent Marker appears exactly once per doc (the title); prose caps to the 64ch measure.

**Given** the carried Shiki-fallback patch from the Story 2.3 review (now that code blocks ship)
**When** `velite.config.ts` / `globals.css` are touched
**Then** the Shiki css-variables theme defines a fallback for every token kind it can emit — `--shiki-token-inserted/-deleted/-changed` and the `--shiki-ansi-*` set — via `variableDefaults` (or explicit `--shiki-*` vars), so no token in any ` ```diff `/ANSI/other fenced block falls back unstyled
**And** this is the **only** code/config change in the story (content-and-one-fix discipline).

**Given** verification (AR-15, no test suite)
**When** the build is run
**Then** `npm run build` is green with every new `/backroom/<slug>` statically exported (no `.func`), the Velite Zod schema validates all new docs (a bad frontmatter value fails the build), Shiki highlighting is present in the prerendered HTML for docs containing code, `npm run lint` is clean, and the theme toggle is checked on the new docs
**And** no test runs are fabricated.

**Note:** This is the **depth** pass on the Decisions section — distinct from Story 2.1's representative _first cut_ (Overview + Pragmatism breadth). It renders entirely through the **already-complete** Story 2.3 Velite + Shiki pipeline with no pipeline change beyond the one Shiki-fallback fix; the two-pane nav (2.4), Entry link (2.6) and console egg (2.7) are out of scope. Discipline: representative-and-strong over comprehensive (SM-C1) — resist porting all 28.

### Story 2.6: Add the front-of-house Entry link

As a technical evaluator lingering past the flash,
I want an understated link offering a way into the Backroom,
So that I can choose to look closer — without it ever pulling a 2-second recruiter toward it (UJ-2, FR-10).

**Acceptance Criteria:**

**Given** the `entry-link` atom (AR-14, UX-DR9) and the `(site)` layout
**When** the Entry link is mounted in the `(site)` layout so it appears on every front-of-house page
**Then** it reads `More interested in how this site is built? →`, is pinned bottom-left of the page chrome on the gradient (mirroring the top-left theme toggle), and is understated — dotted underline + subtle text-shadow, ~0.82 opacity — never competing with the flash
**And** it navigates to the Backroom Overview (`/backroom`) and is **never** shown inside the Backroom (which has the `back` link instead).

**Given** accessibility and the gradient contrast caveat (UX-DR9/18, NFR-5)
**When** the link is tested
**Then** it is a real keyboard-accessible `<a>`/`<Link>` with discernible text (discoverable by screen-reader users despite being visually understated), works in the static export, and its treatment clears **AA contrast across the full page gradient in both themes** (verify against the gold/terracotta end).

**Given** the responsive behaviour (UX-DR3)
**When** the viewport is below `lg`
**Then** the Entry link relocates into the vaul hamburger drawer as a quiet item (no page chrome to host it)
**And** `npm run build` + `npm run lint` are green.

### Story 2.7: Add the console easter egg

As a curious developer who opens dev tools on a portfolio,
I want a charming ASCII-art console message with links to the Backroom and the repo,
So that I find the playful second door and can jump straight to the decisions or the source (UJ-2, FR-11).

**Acceptance Criteria:**

**Given** the `console-egg` atom (AR-9/AR-14, UX-DR13)
**When** it is implemented as a `'use client'` component mounted in the **root** layout (so it fires on any page) that emits the ASCII art via `console` on mount and returns `null` (no DOM)
**Then** the console shows a cyan ASCII wizard + speech bubble + two **clickable** links (the Backroom route and the public GitHub repo) + a dim wink line, in the casual charming-not-cringe voice (structure locked; exact wording an implementation tweak; both links must remain)
**And** both links resolve (the Backroom route exists; the repo URL is correct and public).

**Given** the buffer-retention mechanism (FR-11, AR-9 / G3)
**When** a visitor opens dev tools **after** page load
**Then** the on-load `console` emit is still shown (browsers retain pre-open console messages) — verified across target browsers
**And** **only if** a target browser is found not to retain the buffer is a lightweight dev-tools-open re-emit added as a fallback (not the default), avoiding missed/repeated emits.

**Given** the constraints (NFR-1/NFR-4)
**When** the egg is built
**Then** it is the **only** new `'use client'` island (everything else stays a Server Component), adds no DOM and no new analytics events, and a single emit fires on mount (no multi-stage sequence — NON-GOAL)
**And** `npm run build` (every route `○ (Static)`) + `npm run lint` are green.

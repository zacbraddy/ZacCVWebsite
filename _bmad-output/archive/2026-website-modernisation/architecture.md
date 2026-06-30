---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-25'
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-project-ariadne-2026-06-23/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/mockups/backroom-mock.html
  - _bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/mockups/console-egg-mock.html
  - _bmad-output/project-context.md
workflowType: 'architecture'
project_name: "Zac's CV Website — Project Ariadne"
user_name: 'Zac'
date: '2026-06-25'
---

# Architecture Decision Document — Project Ariadne

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (11 FRs across 4 features):**

- **4.1 Content Refresh (FR-1–5)** — zero architectural load. Portrait swap, CV PDF
  replacement, roles/job-titles in `src/config`, About-me stats/summary copy, and pruning
  stale entries (Twitter, "The Reactionary", dead `@zackerthehacker` handle). Pure
  data/config/asset/copy edits through existing paths; no new components or patterns. The
  discipline is _not_ gold-plating it.
- **4.2 Public Docs Derivation (FR-6)** — content authoring, not site code. Architecturally
  it defines the _input contract_: the shape of `docs/` markdown (frontmatter + naming) the
  Backroom pipeline consumes.
- **4.3 The Backroom (FR-7–9)** — the substantive architecture: render `docs/` markdown to
  themed, statically-exported HTML at build time; sectioned in-Backroom navigation generated
  from `docs/`; syntax-highlighted code present in the prerendered HTML.
- **4.4 Entry Points (FR-10–11)** — an understated Entry `<Link>` in `layout.tsx`; a
  client-side console easter-egg emitter on page load.

**Non-Functional Requirements (architecture drivers):**

- **Static-export compatibility (hard constraint)** — `output: 'export'`; markdown→HTML
  happens at build time only. No server runtime, API routes, SSR/ISR, or middleware.
- **Zero front-of-house regression** — every Backroom change is additive; the existing
  layout shell, animations, and route-transition stay untouched.
- **Theming & structure** — CSS-variable tokens (dark default + `.light`), the toggle works
  in the Backroom, atomic-design tiers respected, no hardcoded colours, no styled-components.
  Two new tokens from UX: `code-surface` and `text-dim`.
- **Performance** — modest client-JS budget; favour build-time rendering and static
  highlighting over client-side libraries.
- **Accessibility** — semantic HTML, keyboard-navigable, `aria-current` on the active nav
  row, the Entry link clears AA on the page gradient in both themes.
- **Analytics continuity** — existing `gtag`/`@next/third-parties` GA keeps working and
  covers new Backroom routes automatically (same root layout); no new wiring.
- **Dependency restraint** — one expected new dependency (the markdown pipeline + its
  highlighter); anything else is flagged and justified, not added casually.

**Scale & Complexity:**

- Primary domain: **static web** — Next.js 16 App Router, `output: 'export'`, React 19
  Server Components by default.
- Complexity level: **low-to-medium**, lopsided — one genuinely-open decision (the markdown
  pipeline); the rest is applying the already-locked Theseus stack consistently.
- Estimated new architectural components: the Backroom route + layout shell, a doc-renderer,
  a sectioned nav generated from `docs/`, the Entry link, the console-egg emitter — all
  small, all additive.

### Technical Constraints & Dependencies

- **Locked stack (from Theseus, 26 ADRs):** Next 16 / React 19 / TS strict / Tailwind v4
  (CSS-first, no config file) / `next-themes` / CSS Modules / FontAwesome v7 / Netlify static
  deploy. styled-components and GraphQL are off the table. No test framework — verification is
  `npm run build` (clean static export, every route `○ (Static)`) + `npm run lint` + manual
  preview checks.
- **Build-time filesystem access** — the pipeline reads/parses `docs/` during `next build`
  only (via `generateStaticParams` + a build-time loader). Legal under static export because
  it is build-time Node, not a runtime server feature.
- **The one open decision:** markdown pipeline library + syntax-highlighting approach,
  deferred from the PRD (Open Question #1) to this workflow. Bound by: build-time-only,
  highlighting-in-prerendered-HTML, modest client-JS budget, dependency restraint.
- **The `docs/` contract is a dependency of UJ-3:** "drop a markdown file in → new nav row +
  route on next deploy, no plumbing" requires the frontmatter/naming convention to carry
  section, order, title, teaser, and tile glyph.

### Cross-Cutting Concerns Identified

- **Theme-token discipline across rendered output** — the doc renderer _and_ the syntax
  highlighter must emit theme-token-mapped colours (incl. the new `code-surface` /
  `text-dim`) that respond to the dark/light toggle; no hardcoded hex, no raw Tailwind
  palette colours.
- **Internal doc-to-doc link resolution** within the static export — referenced docs resolve
  to real static routes; a missing target must not break the build (verify during the story).
- **Backroom shell vs front-of-house shell** — the two-pane reading room must diverge from
  the centred-card front-of-house layout _additively_, reusing the existing vaul drawer for
  mobile nav, without regressing the frozen front-of-house experience.
- **Build-determinism** — the nav and routes are a pure function of `docs/` contents at build
  time; no runtime state, consistent with `output: 'export'`.

## Starter Template Evaluation

### Primary Technology Domain

Static web — Next.js 16 App Router, `output: 'export'`, React 19. **Brownfield.**

### Decision: No starter template — extend the existing codebase

Ariadne is an additive feature project on the **already-scaffolded Theseus codebase**, not a
new project. Every starter-level decision is already made and locked in the existing ADRs
(`docs/decisions/`, 26 entries) and `_bmad-output/project-context.md`:

- **Language/runtime:** TypeScript `^6` strict, Node `>=24` (`.node-version` pins
  `v24.16.0`), React 19 Server Components by default.
- **Styling:** Tailwind v4 (CSS-first, no config file) + CSS Modules + CSS-variable theming;
  styled-components removed (ADR 0004).
- **Build/deploy:** `next build` → static export to `out/`, Netlify deploy-on-commit, custom
  `next/image` Netlify loader.
- **Tooling:** ESLint 9 flat config + Prettier 3 + Husky; no test framework (deliberate).
- **Structure:** atomic-design tiers (`src/components/atoms|molecules|organisms`) + App
  Router routes (`src/app/**/page.tsx`).

**Rationale:** there is nothing to initialise. Re-scaffolding would violate the zero-
regression constraint and the delivery-first guardrail. The single expected new dependency
(the markdown pipeline + highlighter) is decided in the next section as a normal install,
not a scaffold.

**Implication:** there is **no project-init story**. First implementation work is the content
refresh (FR-1–5), Public-docs curation (FR-6), and the Backroom feature.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical (block implementation):** markdown/content pipeline — Velite (D1); `docs/public/`
source contract + frontmatter schema (D2); routing + typed-data consumption (D3); layout
restructure into route groups (D4).
**Important (shape architecture):** console-egg mechanism (D5); mobile-drawer reuse;
theme-token discipline for rendered output incl. Shiki CSS-variables.
**Deferred / N/A:** Data architecture, Auth & security, API & communication — not applicable to
a public static export (no DB, no auth, no runtime API; the only content source is
`docs/public/*.md` read at build time). Backroom search/filter, diagrams, interactive widgets —
explicit v1 NON-GOALs.

### Data Architecture

N/A — no database. Build-time content source is `docs/public/*.md`, read, frontmatter-validated,
and rendered to HTML during `next build` by **Velite** (see D1). No runtime data, no caching
layer, no migrations.

### Authentication & Security

N/A — public static site, no auth, no user data. Markdown is Zac's own trusted content; rendered
HTML is injected via `dangerouslySetInnerHTML` (acceptable for first-party trusted content).

### API & Communication Patterns

N/A — `output: 'export'`, no server runtime, no API routes/handlers. Everything prerendered to
`out/`. Analytics continues through the existing `@next/third-parties` `GoogleAnalytics` (gtag
`G-F98QXJC4S0`) in the **root** layout — Backroom routes inherit it, no new wiring.

### Frontend Architecture

**D1 — Markdown/content pipeline: Velite.** `docs/public/*.md` → Velite → typed, build-time data.

- **Why Velite over hand-assembly:** Velite _is_ the turnkey wrapper around the same
  `unified`/remark/rehype engine. Hand-assembling `unified` + `remark-gfm` + `remark-rehype` +
  `@shikijs/rehype` + `rehype-stringify` + `gray-matter` + a custom fs loader is building a worse
  Velite from Velite's own parts — incoherent. Velite owns parse, frontmatter validation (Zod),
  remark/rehype rendering, Shiki highlighting, and typed-data output in one configured tool.
- **`velite.config.ts`** defines a collection over `docs/public/*.md` with a **Zod schema** for the
  frontmatter contract; invalid frontmatter **fails the build with a clear error** (a real win over
  a hand-rolled parse — the pipeline validates itself).
- **Syntax highlighting: Shiki** via `@shikijs/rehype` + `createCssVariablesTheme()`; `--shiki-*`
  CSS vars defined in `globals.css` mapped to the site's theme tokens (+ new `code-surface`),
  flipping with `.light`. Highlighting is baked into the build-time HTML → **zero client JS**.
- **react-markdown rejected:** its unified pipeline runs **synchronously**; Shiki is **async by
  design** (WASM, lazy grammar/theme load) — react-markdown cannot host async Shiki without moving
  highlighting to the client at runtime (defeats build-time / zero-JS).
- **next-mdx-remote / MDX rejected:** adds JSX-in-markdown (an explicit v1 NON-GOAL) plus the same
  async friction; no benefit here.

**D2 — `docs/public/` source contract:** the Backroom renders **`docs/public/*.md`**; the existing
`docs/decisions/` ADRs stay internal/unrendered, cleanly separating curated Public docs from the
raw internal record. Frontmatter (Zod-validated by Velite): `title`, `section`
(`Overview | Decisions | Pragmatism & process`), `order`, `teaser`, optional `adr` number / tile
glyph (★ Overview, ◆ Pragmatism, number for Decisions). Adding a doc = drop a valid
`docs/public/*.md` → new typed entry → new nav row + static route on next build (UJ-3, no plumbing).

**D3 — Routing & data consumption:** `/backroom` = Overview ("Start here"); `/backroom/[slug]` =
each doc. `generateStaticParams` maps over Velite's generated `docs` array;
`export const dynamicParams = false` (required static-export pattern; every route `○ (Static)`).
The page renders `doc.html` via `dangerouslySetInnerHTML`; the sectioned nav is built from the same
typed array grouped by `section`. No hand-rolled fs loader, no `gray-matter` — Velite owns it.

- **Build integration (Turbopack-safe):** `next.config.ts` awaits Velite's `build()` before Next
  compiles (the official Next-config approach — not the legacy webpack plugin, which is the part
  that breaks under Turbopack). No `npm-run-all`, no `netlify.toml` change; Netlify's `next build`
  triggers the Velite build first. Velite emits typed data to `.velite/` (gitignored) with a
  generated `.d.ts`.

**D4 — Layout restructure (route groups):** the FoH shell currently lives in the **root**
`layout.tsx` wrapping `{children}`, so a `/backroom` route would inherit the FoH sidebar. Split it:

- **Root `layout.tsx` → global-only:** `<html>/<body>`, fonts, `Providers` (theme), `ThemeToggle`,
  `LoadingSpinner`, `GoogleAnalytics`, the global console-egg emitter. (Backroom inherits GA here.)
- **`(site)/layout.tsx` → FoH shell** moved verbatim (sidebar/portrait/hero/nav/`ContentTransition`
  - FrozenRouter); FoH pages move into `(site)/`. Pure relocation → byte-identical FoH render
    (zero-regression key). Hosts the FoH-only **Entry link** (FR-10).
- **`(backroom)/layout.tsx` → two-pane reading room** (320px nav + content pane), `◀ back to the
site` link, sectioned nav.
- URLs unchanged (route groups are URL-invisible). `MenuProvider` stays global; each room supplies
  its own `MobileMenu` contents into the shared vaul drawer (mirrors the FoH mobile pattern).
- **Transitions — path of least resistance first (don't special-case either way):** the implementer
  takes whatever is genuinely simplest when writing the new Backroom layout — neither extra work to
  _add_ the route transition nor extra work to _remove_ it. The **likely** least-resistance outcome
  is **no inter-doc transition**, because the FoH `ContentTransition`/FrozenRouter relocates verbatim
  into `(site)/layout` and a fresh Backroom layout simply omits it — but this is **not pre-decided**;
  the implementation determines it. Front↔back room nav is a plain navigation either way.
  **Conditional gate:** _if_ the least-resistance implementation leaves the Backroom **with**
  transitions, Zac reviews and either approves Backroom-with-transitions or requires the extra work
  to remove them. _If_ it leaves the Backroom **without** transitions, ship as-is — Zac may add them
  himself in a future post-Ariadne iteration. Either way, no time is spent fighting the default.

**D5 — Console easter egg (FR-11):** a `'use client'` component in the **root** layout (fires on any
page) emitting ASCII art via `console` on mount; returns `null` (no DOM). On-load emit primary;
dev-tools-detection re-emit is an evidence-driven fallback only.

**Theme-token discipline (cross-cutting):** the rendered doc HTML and the Shiki CSS-variables theme
use the site's `@utility` tokens / CSS variables (incl. new `code-surface`, `text-dim`) — no
hardcoded hex, no raw Tailwind palette colours; responds to the dark/light toggle.

### Infrastructure & Deployment

Unchanged — Netlify static deploy of `out/` on commit to `main`; `next build` (with the Velite
`build()` hook in `next.config.ts` running first); custom `next/image` Netlify loader. New Backroom
routes are static files served the same way. No CI/CD, hosting, or env changes.

### New Dependencies (flagged per dependency-restraint rule)

- **`velite`** (devDependency — build-time content tool; bundles the unified/remark/rehype ecosystem
  internally).
- **`@shikijs/rehype` / `shiki`** — syntax highlighting via Velite's rehype pipeline.

Everything else reuses installed libraries. Net line-item count is _lower_ than hand-assembly, and
nothing ships to the client.

### Decision Records to author

- **ADR 0027 — Markdown/content pipeline: Velite + Shiki.** Capture the decision _and the trail_:
  why react-markdown was rejected (sync engine can't host async Shiki), why hand-assembly was
  rejected (rebuilding a worse Velite), the Turbopack/`next.config` integration, and the Shiki
  CSS-variables theming. Meta-note: this ADR is itself prime **Backroom** material — a real
  decision-trail/pragmatism artefact, fitting since the Backroom showcases exactly these calls.
  (Authored as part of the Backroom implementation, alongside the existing `docs/decisions/` set.)

### Decision Impact Analysis

**Implementation sequence:** (1) Content refresh FR-1–5 (independent, no Backroom dep) →
(2) Public-docs curation FR-6 into `docs/public/` (defines the frontmatter the Velite schema
validates) → (3) Layout restructure D4 (foundation; verify zero FoH regression) → (4) Velite
pipeline D1–D3 + Backroom render + sectioned nav → (5) Entry link FR-10 + console egg D5. ADR 0027
authored within step 4.

**Cross-component dependencies:** D2's frontmatter contract is the schema Velite (D1) enforces and
the nav/render (D3) consume; D4's route groups are the container D3 renders into; D4's root-layout
split is what gives GA coverage and hosts the console egg (D5); the Entry link (FR-10) depends on
the `(site)` layout existing.

## Implementation Patterns & Consistency Rules

### Scope note

Most generic pattern categories (database/API naming, response/error formats, event systems,
state-management conventions) are **N/A** — this is a static export with no backend, no API, no
runtime state store. The existing `project-context.md` already fixes the broad conventions
(atomic-design tiers, kebab-case filenames + PascalCase identifiers, CSS-variable theming, British
spelling, no-comments-by-default, Prettier-is-law). The rules below cover only the **Ariadne-specific
points where two implementing agents would otherwise diverge.**

### `docs/public/` Frontmatter Contract (Velite Zod schema)

Every `docs/public/*.md` MUST carry:

| Field     | Type                                                      | Notes                                                  |
| --------- | --------------------------------------------------------- | ------------------------------------------------------ |
| `title`   | string                                                    | doc title (Permanent Marker) + nav-row title           |
| `section` | enum: `Overview` \| `Decisions` \| `Pragmatism & process` | drives nav grouping                                    |
| `order`   | number                                                    | sort order within its section                          |
| `teaser`  | string                                                    | one-line nav-row teaser (`text-dim`)                   |
| `adr`     | number, optional                                          | only meaningful for `section: Decisions` → number tile |

- **Tile derivation (no glyph field):** `Overview` → ★ (gold), `Pragmatism & process` → ◆ (gold),
  `Decisions` → the `adr` number (cyan). Meaning stays consistent: cyan = decision/link, gold =
  judgement (DESIGN.md).
- **Slug = filename** (kebab-case) → `/backroom/<filename>`. No `slug` field.
- **Empty sections are omitted** from the nav (don't render an empty group).
- Frontmatter is parsed **natively by Velite** (schema fields map onto frontmatter keys — no
  `gray-matter` or other parser). Invalid/missing frontmatter **fails the Velite build** with a
  clear error (self-validating pipeline).

### Component Placement (atomic tiers)

- `atoms/`: `number-tile`, `glyph-tile`, `section-label`, `back-link`, `entry-link`, `console-egg`
  (`console-egg` is `'use client'`, returns `null`).
- `molecules/`: `backroom-nav-row` (the whole row is one `<Link>` to the doc route;
  `aria-current="page"` when selected).
- `organisms/`: `backroom-nav` (sectioned list), `doc-content` (renders the `s.markdown()` HTML).
- Backroom layout/pages: `src/app/(backroom)/layout.tsx`, `src/app/(backroom)/backroom/page.tsx`
  (Overview), `src/app/(backroom)/backroom/[slug]/page.tsx`.

### Velite Output & Rendered-HTML Styling

- Velite outputs a **typed data layer** to `.velite/` (`*.json` + `index.d.ts` + `index.js`),
  imported into Server Components at build time. **Frontmatter is parsed natively by Velite** (the
  Zod schema fields map directly onto frontmatter keys) — no `gray-matter` or other parser needed.
- The doc body is one schema field, `content: s.markdown()`, which Velite renders to an **HTML
  string** (with Shiki highlighting baked in). We render that string in the `doc-content` organism
  via `dangerouslySetInnerHTML` (first-party trusted content). MDX (`s.mdx()`) is deliberately not
  used — it adds JSX-in-markdown (a v1 NON-GOAL) and a client-side MDX runtime.
- Because the body is an injected HTML string, you **cannot** hang Tailwind utilities on its
  elements. Style it via a single scoped prose block, `doc-content.module.css`, targeting
  `h1/h2/p/ul/ol/li/a/blockquote/code/pre/table/th/td` with the site's **CSS-variable theme
  tokens** (never hex / never raw Tailwind palette), capped to the 64ch reading measure.
- Shiki `--shiki-*` CSS variables live in `globals.css` (`@layer base`) mapped to theme tokens
  (+ `code-surface`), with a `.light` override so highlighting flips with the theme; they must
  exist in the prerendered HTML.

### Authoring Conventions (consistent across all Public docs)

- **Pragmatism call-out = a markdown blockquote.** `> …` renders as the gold left-bar call-out
  (DESIGN.md `doc-callout`). No plugin, no custom syntax.
- **Internal doc-to-doc links = absolute Backroom paths** — `[text](/backroom/<slug>)` — so they
  resolve in the static export. Never `./file.md`.
- British spelling throughout; public-facing prose only (no internal audit noise).

### File / Route Layout

- Route groups: `src/app/(site)/...` (front-of-house, pages relocated here) and
  `src/app/(backroom)/...`. URLs unchanged.
- `velite.config.ts` at repo root; generated `.velite/` is **gitignored**; consumed via Velite's
  generated typed import in Server Components.
- Console ASCII art + emit logic co-located in the `console-egg` atom; single emit on mount.

### Enforcement

All implementing agents MUST: keep new components in the correct atomic tier; use theme tokens (no
hex / no raw Tailwind colours) including in the prose + Shiki CSS; keep `'use client'` to the
console-egg only (everything else Server Components); preserve British spelling; verify via
`npm run build` (every route `○ (Static)`, no `.func`) + `npm run lint`. There is no test suite —
do not fabricate test runs.

**Anti-patterns to avoid:** injecting Tailwind classes into Velite-rendered HTML; hardcoding code-
block colours instead of the `--shiki-*` token mapping; adding a `slug`/glyph frontmatter field
(derive them); making the doc renderer or nav a client component; re-introducing a route transition
inside the Backroom without the implementation-gate review.

## Project Structure & Boundaries

### Complete Project Directory Structure

Legend: **[NEW]** added by Ariadne · **[MOVE]** relocated (no code change) · **[EDIT]** content/asset
edit · unmarked = unchanged.

```
ZacCVWebsite/
├── next.config.ts                      [EDIT] await velite build() before Next compiles
├── velite.config.ts                    [NEW]  collection over docs/public/*.md + Zod schema + Shiki
├── netlify.toml                                unchanged (next build triggers velite via next.config)
├── package.json                        [EDIT] add devDep velite, dep @shikijs/rehype (+ shiki)
├── .gitignore                          [EDIT] add .velite/
├── tsconfig.json                               (Velite typed import resolves from .velite/)
├── eslint.config.mjs / postcss.config.mjs      unchanged
├── .velite/                            [NEW, generated, gitignored] posts json + index.d.ts/.js
├── docs/
│   ├── decisions/                              internal ADRs — NOT rendered by the Backroom
│   │   ├── 0001..0026-*.md
│   │   └── 0027-markdown-pipeline-velite-shiki.md   [NEW] ADR for the D1 decision
│   └── public/                         [NEW]  curated Public docs the Backroom renders (FR-6)
│       ├── start-here.md                       section: Overview  → ★
│       ├── framework-decision.md               section: Decisions → adr: 4
│       ├── deferring-the-polish.md             section: Pragmatism & process → ◆
│       └── building-with-ai-and-bmad.md        section: Pragmatism & process → ◆
├── public/
│   └── images/
│       ├── zac-portrait.jpg            [EDIT] new portrait from scratch/avatar pic zac.jpg (FR-1)
│       └── <cv>.pdf                    [EDIT] Zac-Braddy-20260522.pdf; old PDF removed (FR-2)
└── src/
    ├── app/
    │   ├── globals.css                 [EDIT] --shiki-* var mappings (+ .light), code-surface,
    │   │                                      text-dim, doc prose + callout tokens (@layer base)
    │   ├── layout.tsx                  [EDIT] reduced to GLOBAL chrome only (html/body/fonts/
    │   │                                      Providers/ThemeToggle/LoadingSpinner/GA/console-egg)
    │   ├── providers.tsx                       unchanged
    │   ├── not-found.tsx                       unchanged (root-level)
    │   ├── icon.svg                            unchanged
    │   ├── (site)/                     [NEW group] front-of-house shell + pages
    │   │   ├── layout.tsx              [NEW]  FoH shell moved verbatim from old root layout
    │   │   │                                  (sidebar/portrait/hero/NavLinks/ContentTransition
    │   │   │                                  /FrozenRouter) + the FoH-only Entry link (FR-10)
    │   │   ├── page.tsx                [MOVE] home (was src/app/page.tsx)
    │   │   ├── about-me/page.tsx       [MOVE+EDIT] stats (39→41) + summary reposition (FR-4)
    │   │   ├── resume/page.tsx         [MOVE] (CV download link → new PDF, FR-2)
    │   │   └── content/page.tsx        [MOVE+EDIT] remove "The Reactionary" + thumbnail (FR-5)
    │   └── backroom/                   [NEW]  the Backroom (own two-pane shell, no FoH sidebar)
    │       ├── layout.tsx              [NEW]  two-pane reading room: <backroom-nav> + content;
    │       │                                  back-link; mobile nav into shared vaul drawer;
    │       │                                  transitions: path of least resistance (D4, likely none)
    │       ├── page.tsx                [NEW]  Overview ("Start here") — renders start-here.md
    │       └── [slug]/page.tsx         [NEW]  one doc; generateStaticParams over velite docs,
    │                                          dynamicParams = false
    ├── components/
    │   ├── atoms/
    │   │   ├── number-tile.tsx         [NEW]  cyan ADR-number tile
    │   │   ├── glyph-tile.tsx          [NEW]  gold ★/◆ tile
    │   │   ├── section-label.tsx       [NEW]  tracked dim caps
    │   │   ├── back-link.tsx           [NEW]  ◀ back to the site
    │   │   ├── entry-link.tsx          [NEW]  "More interested in how this site is built? →"
    │   │   └── console-egg.tsx         [NEW]  'use client'; emits ASCII art on mount; returns null
    │   ├── molecules/
    │   │   ├── socials.tsx             [EDIT] remove Twitter link + faTwitter import (FR-5)
    │   │   └── backroom-nav-row.tsx    [NEW]  tile + title + teaser; whole row is a <Link>
    │   └── organisms/
    │       ├── about-me.tsx            [EDIT] stats + summary (FR-4)
    │       ├── backroom-nav.tsx        [NEW]  sectioned nav built from velite typed data
    │       └── doc-content.tsx         [NEW]  renders the s.markdown() HTML string
    │           (+ doc-content.module.css [NEW] scoped prose block using theme tokens)
    ├── config/index.ts                 [EDIT] JOB_TITLE / JOB_TITLES → CV parity (FR-3)
    ├── context/menu-open-context.tsx           unchanged (shared drawer state, both rooms)
    └── image-loader.ts                         unchanged
```

### Architectural Boundaries

- **Build-time vs runtime:** the entire content boundary is **build-time**. Velite reads
  `docs/public/`, validates frontmatter, renders markdown→HTML+Shiki, emits `.velite/`. Next
  imports that typed data into Server Components and prerenders every route to `out/`. **No runtime
  boundary exists** — no API, no DB, no server.
- **Room boundary (layouts):** root layout = global chrome only; `(site)/layout.tsx` = FoH shell;
  `backroom/layout.tsx` = two-pane shell. A page belongs to exactly one room; chrome never leaks
  across (the whole reason for the split).
- **Data boundary:** the Velite typed `docs` array is the single source for both routes
  (`generateStaticParams`, page render) and nav (`backroom-nav`). The frontmatter Zod schema is the
  contract at that boundary.
- **Component boundary:** Server Components throughout; the lone `'use client'` island is
  `console-egg` (and the existing FoH client islands, unchanged). Shared cross-room state is only
  the vaul drawer via `MenuOpenContext`.

### Requirements → Structure Mapping

| FR                | Lives in                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------- |
| FR-1 portrait     | `public/images/zac-portrait.jpg`, rendered by existing `portrait-image.tsx`              |
| FR-2 CV PDF       | `public/images/<cv>.pdf` + the download link in `(site)/resume/page.tsx`                 |
| FR-3 roles/titles | `src/config/index.ts` (+ experience organisms if roles differ)                           |
| FR-4 about-me     | `(site)/about-me/page.tsx` + `organisms/about-me.tsx`                                    |
| FR-5 prune        | `molecules/socials.tsx`, `(site)/content/page.tsx`, `creator:` in all metadata blocks    |
| FR-6 Public docs  | `docs/public/*.md` (+ ADR 0027 in `docs/decisions/`)                                     |
| FR-7 render       | `velite.config.ts`, `backroom/[slug]/page.tsx`, `organisms/doc-content.tsx`, globals.css |
| FR-8 navigate     | `organisms/backroom-nav.tsx`, `molecules/backroom-nav-row.tsx`, atoms tiles/labels       |
| FR-9 highlight    | `@shikijs/rehype` in `velite.config.ts` + `--shiki-*` tokens in globals.css              |
| FR-10 entry link  | `atoms/entry-link.tsx` mounted in `(site)/layout.tsx`                                    |
| FR-11 console egg | `atoms/console-egg.tsx` mounted in root `layout.tsx`                                     |

### Development / Build / Deploy

- **Dev:** `npm run dev` → `next.config.ts` runs Velite in watch mode (rebuilds `.velite/` on
  `docs/public/` change), then Next dev. **Build:** `npm run build` → Velite build runs first
  (clean), then `next build` static-exports to `out/`. **Deploy:** Netlify runs `next build` on
  commit to `main`; no `netlify.toml` change (the Velite hook lives in `next.config.ts`).
- **Verification (no test suite):** `npm run build` green, every route `○ (Static)` incl.
  `/backroom` + each `/backroom/<slug>`, no `.func`; `npm run lint` clean; manual preview for FoH
  zero-regression, theme toggle in the Backroom, Shiki highlighting in both themes, and the
  console egg.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** all choices cohere. Velite + `@shikijs/rehype` run at build time and
emit static typed data + HTML, fully consistent with `output: 'export'` (no runtime). The
`next.config.ts` Velite hook is the Turbopack-safe path (not the broken webpack plugin). Shiki's
CSS-variables theme rides the existing `next-themes` `.light` class — same theming mechanism as the
rest of the site, no parallel system. The route-group split is standard App Router and changes no
URLs. No contradictory decisions.

**Pattern Consistency:** patterns support the decisions — atomic-tier placement matches the
existing convention; Server-Components-by-default with the single `console-egg` client island fits
the static export; the frontmatter Zod schema is the contract Velite enforces and the nav/render
consume; theme-token discipline (incl. `--shiki-*`, `code-surface`, `text-dim`) extends the
established no-hardcoded-colour rule.

**Structure Alignment:** the directory tree realises every decision — root-layout-as-global +
`(site)` + `backroom/` deliver the room boundary; `velite.config.ts`/`.velite/` deliver the data
boundary; component files land in their declared tiers. Boundaries are explicit and respected.

### Requirements Coverage Validation ✅

**Functional Requirements (11/11):** FR-1 portrait, FR-2 CV PDF, FR-3 roles/titles, FR-4 about-me,
FR-5 prune → content edits mapped in the FR→structure table. FR-6 Public docs → `docs/public/`.
FR-7 render → Velite + `doc-content` + `backroom/[slug]`. FR-8 navigate → `backroom-nav` +
`backroom-nav-row` + tiles. FR-9 highlight → Shiki via Velite + `--shiki-*` tokens. FR-10 entry
link → `entry-link` in `(site)/layout`. FR-11 console egg → `console-egg` in root layout. Every FR
has a home.

**Non-Functional Requirements:** static-export (build-time pipeline, every route `○ (Static)`);
zero FoH regression (verbatim shell relocation + verification gate); theming/structure (token
discipline + atomic tiers); performance (build-time render, zero client JS for docs, Shiki baked
in); accessibility (semantic HTML, `aria-current`, keyboard-navigable, Entry-link AA on gradient);
analytics continuity (GA in root layout covers Backroom automatically); dependency restraint (two
build-time deps, justified). All addressed.

### Implementation Readiness Validation ✅

**Decision Completeness:** all critical decisions documented with pinned versions
(`velite@0.4.0`, `@shikijs/rehype@4.3.0`, against Next `16.2.9` / React `19.2.7`), with rationale
and rejected alternatives (react-markdown, next-mdx-remote, hand-assembly).
**Structure Completeness:** complete, specific tree with NEW/MOVE/EDIT annotations and FR mapping.
**Pattern Completeness:** the Ariadne-specific divergence points are covered; generic categories
correctly marked N/A for a static site.

### Gap Analysis Results

No **critical** gaps (nothing blocks implementation). Open items are **verification gates**, to be
confirmed during the relevant story, not architectural holes:

- **G1 — FoH zero-regression after the layout move.** Mitigation: relocate the shell verbatim;
  verify with `npm run build` + side-by-side visual diff before/after. (Highest-attention gate.)
- **G2 — `s.markdown()` ↔ `@shikijs/rehype` wiring.** Confirm Velite's markdown `rehypePlugins`
  accepts the Shiki plugin with `createCssVariablesTheme()` and highlighting lands in the emitted
  HTML. Low risk; standard usage.
- **G3 — Console-egg buffer retention** across target browsers (FR-11) — on-load emit primary;
  dev-tools-detection re-emit only if a browser is found not to retain.
- **G4 — Backroom transition gate (conditional, D4).** Implementer takes the path of least
  resistance — no special work to add _or_ remove the route transition. **If** that leaves the
  Backroom with transitions, Zac reviews → approve-with-transitions or require their removal.
  **If** it leaves none, ship as-is (Zac may add them post-Ariadne). Likely outcome: none.
- **Minor:** define behaviour for `order` collisions / duplicate `adr` numbers (stable secondary
  sort by filename) — decide in the Backroom story.

### Validation Issues Addressed

No blocking issues. The earlier pipeline decision was corrected mid-workflow (react-markdown →
hand-assembly → **Velite + Shiki**) after testing the "one turnkey tool vs strung-together plugins"
and Turbopack claims against the sources; the corrected decision is what's documented. ADR 0027 is
queued to capture that trail.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified (N/A categories explicitly scoped out)
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** high — small, well-bounded additive scope on a frozen, well-documented stack;
one genuinely-open decision resolved and pinned; the rest is applying established conventions.

**Key Strengths:**

- The one real decision (the pipeline) is resolved to a turnkey tool that _reduces_ moving parts.
- The layout split isolates the Backroom cleanly while keeping FoH a verbatim relocation (zero-
  regression by construction).
- Build-time-everything keeps it perfectly inside `output: 'export'`.
- The decision trail is itself Backroom content (ADR 0027) — proof and product are one artefact.

**Areas for Future Enhancement (explicitly post-v1 per PRD):** Backroom search/filter if the doc
set grows; richer docs; ongoing trail curation beyond the Representative first cut.

### Implementation Handoff

**AI Agent Guidelines:** follow the decisions and patterns exactly; keep new components in the
correct atomic tier; Server Components except the `console-egg` island; theme tokens only (incl.
Shiki vars); British spelling; verify via `npm run build` (all routes `○ (Static)`) + `npm run lint`

- manual preview — there is no test suite.

**First Implementation Priority:** the content refresh (FR-1–5) is independent of the Backroom and
the safest first slice; in parallel/next, curate `docs/public/` (FR-6, defines the frontmatter the
Velite schema validates), then the layout split (G1 gate), then the Velite pipeline + Backroom, then
the Entry link + console egg. Author ADR 0027 within the Backroom work. No project-init story.

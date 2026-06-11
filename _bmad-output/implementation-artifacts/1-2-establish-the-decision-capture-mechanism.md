# Story 1.2: Establish the decision-capture mechanism

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the engineer (and future Ariadne curator),
I want a lightweight decision-capture mechanism in place and seeded with the decisions already made,
so that the rationale trail exists from the first decision onward and Epic 4 can collate rather than reconstruct it.

## Acceptance Criteria

1. **A decision-capture location and lightweight format exist.**
   **Given** the scaffolded repository,
   **When** the decision-capture mechanism is established,
   **Then** a dedicated location (`docs/decisions/`) and a lightweight ADR/decision-log format exist, to a base-usable standard with no public-facing polish (polish is Ariadne's job, explicitly out of scope here — NFR6).

2. **The mechanism is seeded with every already-made foundational decision, each with its rationale.**
   **Given** the mechanism,
   **When** it is seeded,
   **Then** the following already-made decisions are each recorded as a discrete ADR with their rationale:
   (a) the Next.js 16 + React 19.2 + TypeScript-strict stack,
   (b) Tailwind v4 over v3,
   (c) Netlify deploy Path A,
   (d) full styled-components removal,
   (e) the big-bang TS conversion,
   (f) the `archive/`-at-root coexistence model,
   (g) Prettier-only tooling (ESLint declined; Tailwind deferred to 1.3),
   (h) building against latest-LTS Node (24 "Krypton") rather than the floor.
   **And** the remaining already-closed architecture decisions (SSG fully-static, theme-persistence-on, clean parallel rebuild ported tier-by-tier with per-tier visual diffing, and the backroom-markdown-pipeline deferral to Ariadne) are acknowledged by reference to the research/PRD so Epic 4's completeness sweep finds no gap — **not** re-litigated.

3. **The capture convention is documented.**
   **Given** the capture convention,
   **When** it is documented (in an index/README at the decisions location),
   **Then** it states that subsequent non-obvious decisions and pragmatism calls are recorded **as-you-go** at the moment they are made (a cross-cutting Definition-of-Done item across all epics), to a base-usable standard with no public polish,
   **And** it states that Epic 4 (Story 4.3) **collates** the existing trail rather than reconstructing one.

4. **Scope discipline (NFR6) is honoured.**
   **Given** the anti-gold-plating guardrail,
   **When** the mechanism is built,
   **Then** it is **plain markdown only** — no new npm dependency, no ADR tooling/generator (e.g. `adr-tools`, `log4brains`), no docs-site, and **no change to the Next.js app source, `package.json`, or build config**. The entire change lives under `docs/`.

## Tasks / Subtasks

- [ ] **Task 1 — Create the decisions location and the lightweight ADR template (AC: 1, 4)**

  - [ ] Create the directory `docs/decisions/` (the root `docs/` exists and is currently empty — this is its first content).
  - [ ] Create `docs/decisions/_template.md` holding the lightweight ADR format (see **ADR template** in Dev Notes — MADR-lite: Status, Date, Decider, Context, Decision, Consequences, optional Alternatives). Keep it lean; this is base-usable, not a polished public artefact.
  - [ ] Do **not** add any dependency, generator, or config. Markdown files under `docs/` only (AC4).

- [ ] **Task 2 — Author the index / README with the capture convention (AC: 1, 3)**

  - [ ] Create `docs/decisions/README.md` that: (a) explains where ADRs live and the `NNNN-kebab-title.md` numbering, (b) links the template, (c) lists the seeded ADRs (index table), (d) documents the **as-you-go capture convention** as a cross-cutting Definition-of-Done item, (e) states Epic 4 / Story 4.3 **collates not reconstructs**, (f) states public-facing polish is **Ariadne's** scope and deliberately out of scope here, (g) records the **status vocabulary** (Proposed / Accepted / Superseded).
  - [ ] Add an **"Inherited closed decisions"** subsection that references — by pointer to the technical research decision table and the PRD addendum, not by re-argument — the already-closed calls not given their own ADR: SSG fully-static (`output: 'export'`), theme-persistence-on (the single accepted functional change, FR10), clean parallel rebuild ported tier-by-tier with per-tier visual diffing, and the backroom-markdown pipeline deferred to Ariadne (AR20). This mirrors how the PRD's own `.decision-log.md` handled inherited decisions and closes the Epic 4 completeness gap.

- [ ] **Task 3 — Seed the 8 mandatory foundational ADRs (AC: 2)**
      Create one file per decision under `docs/decisions/`, numbered in this order, each using the template and carrying the rationale + source pointers given in Dev Notes:

  - [ ] `0001-nextjs-16-react-19-typescript-strict-stack.md`
  - [ ] `0002-tailwind-v4-over-v3.md`
  - [ ] `0003-netlify-deploy-path-a-static-export.md`
  - [ ] `0004-remove-styled-components.md`
  - [ ] `0005-big-bang-typescript-conversion.md`
  - [ ] `0006-archive-at-root-coexistence-model.md`
  - [ ] `0007-prettier-only-tooling-no-eslint.md`
  - [ ] `0008-build-against-latest-lts-node.md`
  - [ ] Set each ADR's Status to **Accepted** and Date to **2026-06-11**; Decider **Zac (We Right Code)**.
  - [ ] Update the README index table to list all 8 (number, title, status).

- [ ] **Task 4 — Verify (AC: 1–4)**
  - [ ] `docs/decisions/` contains: `README.md`, `_template.md`, and the 8 numbered ADRs. Each ADR has Context + Decision + Consequences populated (no empty stubs).
  - [ ] Run `npm run format` (or let the Husky `pretty-quick --staged` hook fire on commit) so the new `.md` files are Prettier-formatted — `docs/` is **not** in `.prettierignore`, so Prettier owns markdown formatting here; do not hand-format around it.
  - [ ] Confirm **zero** changes outside `docs/`: `git status` shows only new files under `docs/decisions/` (plus this story file + `sprint-status.yaml`). No edits to `package.json`, `next.config.ts`, `src/`, or any dependency.

## Dev Notes

### What this story is — and what it is emphatically NOT

This is a **documentation-only** story. The deliverable is a small set of plain-markdown ADRs plus a README convention, all under `docs/decisions/`. It establishes the _mechanism + seed_ for FR26/AR19; the _practice_ of capturing as-you-go runs through every later story; the _collation/sign-off_ is Story 4.3.

**Hard scope guards (NFR6 — anti-gold-plating is a first-class quality attribute here):**

- **No new dependency.** Do not `npm install` anything. Specifically do **not** add ADR tooling (`adr-tools`, `log4brains`, `adr-log`, etc.) — the convention is "write a markdown file", nothing more.
- **No docs-site, no generator, no index automation.** A hand-maintained README index table is the mechanism. Ariadne may later render these; that is **not** this story.
- **No touch to app source / build.** `package.json`, `next.config.ts`, `src/**`, `tsconfig.json`, `.gitignore` are all out of bounds. The whole change is markdown under `docs/`.
- **British spelling in prose** (project-owner preference); keep canonical identifiers (`color`, etc.) as-is. [Source: project-context.md#Language-Specific-Rules]

### Why `docs/decisions/` (location rationale) [Source: research #Project-Codenames; epics.md#Story-1.2]

The root `docs/` directory already exists and is empty — this is its first occupant. Ariadne (Project 2) is described in the research and project memory as _"the curated docs/ADRs/backroom — the thread handed to a technical visitor so they can navigate how the thing was built."_ So `docs/` is the forward-compatible home: Theseus deposits raw, base-usable ADRs there as a byproduct; Ariadne later curates/renders them. Plain markdown ADRs feed any of the mature Next markdown pipelines (MDX, `next-mdx-remote`, `react-markdown`) — so this choice forecloses nothing (AR20). `docs/decisions/` is chosen over `docs/adr/` purely for readability; the MADR convention uses `decisions/`.

### Format: one file per decision (not a single running log) — and why

Use **discrete, numbered ADR files** (MADR-lite), one per material decision, indexed by a README — **not** a single monolithic `decision-log.md`. Reasons: (1) the FR explicitly calls it "ADR/decision-log format" and Ariadne is "the curated docs/**ADRs**/backroom"; (2) discrete files are independently curatable/renderable into per-decision case-study pages later; (3) it is the most standard, least-surprising shape for a technical backroom. Note: BMad's _internal_ per-run `.decision-log.md` files (under `planning-artifacts/.../`) are a different, workflow-internal artefact — do **not** conflate them with this project-level ADR set, and do not edit them.

### ADR template (MADR-lite) — put this in `docs/decisions/_template.md`

```markdown
# NNNN — <Short decision title>

- **Status:** Proposed | Accepted | Superseded
- **Date:** YYYY-MM-DD
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, <area>

## Context

What forced this decision — the constraint, fork, or problem. One short paragraph.

## Decision

What was chosen, stated plainly.

## Consequences

What this enables, costs, or commits us to downstream. Follow-ups, if any.

## Alternatives considered

(Optional.) What was rejected and the one-line reason.
```

### Seed content — the 8 mandatory ADRs (rationale + sources the dev MUST fold in)

Each ADR below already has its substance decided; the dev agent is **transcribing closed decisions**, not re-deciding them. Keep each to the template, base-usable length.

1. **0001 — Next.js 16 + React 19.2 + TypeScript (strict) stack.** _Context:_ the live site is Gatsby 5 / plain JS on a deprecating stack; the brief closed the framework re-evaluation. _Decision:_ rebuild on Next.js 16 (App Router) + React 19.2 + TypeScript 5.x with `strict: true`. _Consequences:_ App Router pins its own validated React; big-bang TS (see 0005); no Gatsby/`@reach/router`/GraphQL. _Source:_ addendum #Decided-technical-stack; research #Architectural-Decisions; epics.md AR2/FR23.

2. **0002 — Tailwind v4 over v3.** _Context:_ v3 used a JS `tailwind.config.js` token map; v4 is the current major with CSS-first `@theme` (Oxide engine). _Decision:_ adopt Tailwind v4, CSS-first. _Consequences:_ mandatory **border/ring/divide regression guard** — v4 defaults these to `currentColor` where v3 used `gray-200`; an explicit base border colour must be set and every usage audited (this guard is Story 1.3's job; the ADR records _why_ it exists). _Source:_ epics.md AR3; research Tailwind decision; project-context.md#Tailwind.

3. **0003 — Netlify deploy Path A.** _Context:_ keep the existing GitHub `main` → Netlify deploy-on-commit; no host migration; no serverless. _Decision:_ pure static export (`output: 'export'`) + a small custom `next/image` `loaderFile` targeting the Netlify Image CDN (`/.netlify/images?url=…&w=…&q=…`). _Consequences:_ SSG only, no SSR/functions; the loader config is Story 1.7. _Source:_ epics.md AR4/AR5/AR6; addendum hosting row; research.

4. **0004 — Full styled-components removal.** _Context:_ the headline modernisation move (FR24); a tiny SC footprint (two `styled.div`s + one `createGlobalStyle` + one `keyframes` across three files). _Decision:_ remove styled-components entirely → global CSS vars + `next-themes` + CSS Modules; no CSS-in-JS runtime remains. _Consequences:_ `createGlobalStyle` → static CSS-var palettes; `AnimatedContainer`/`keyframes` → CSS Module + `'use client'` wrapper; `timeline-divider` → CSS Module (executed across Epics 2–3). _Source:_ epics.md AR15/FR24.

5. **0005 — Big-bang TypeScript conversion.** _Context:_ small codebase; mixed-mode JS/TS not worth the seam; TS-on-display is a goal. _Decision:_ full TS from the start — no `allowJs`, no `.js` source components. _Consequences:_ every ported component is `.ts`/`.tsx` under `strict`. _Source:_ epics.md AR2; addendum.

6. **0006 — `archive/`-at-root coexistence model.** _Context:_ one root `package.json` cannot hold React 18 + Tailwind v3 (Gatsby) **and** React 19 + Tailwind v4 (Next), and `public/` collides (Gatsby _output_ vs Next _source_) — separate dependency roots are forced. _Decision:_ build the new Next app at the repo **root**; relocate the entire Gatsby tree into `archive/`, kept buildable until cutover; delete `archive/` at Epic 4 (Story 4.2). _Consequences:_ idiomatic root-level Next from day one; cutover is `rm -rf archive/` + git removal, not a risky promotion. _Source:_ Story 1.1 Dev Notes + Completion Notes (Zac, 2026-06-11); memory [[theseus-coexistence-archive-model]]; epics.md AR1.

7. **0007 — Prettier-only tooling; ESLint declined, Tailwind deferred.** _Context:_ AR13 mandates Prettier + Husky and no fabricated test suite; keeping the scaffold minimal. _Decision:_ ESLint is **permanently excluded**; Tailwind is **deferred to Story 1.3** (not absent from the project, just not in the scaffold). _Consequences:_ formatting via Prettier 2.8.7 + Husky `pretty-quick --staged`; `npm test` stays an honest stub. _Source:_ Story 1.1 Task 5/Completion Notes; epics.md AR13; project-context.md#Tooling.

8. **0008 — Build against latest-LTS Node, not the floor.** _Context:_ the old Gatsby `engines.node` floor was `>=18.15.0`; building against the floor invites stale-toolchain drift. _Decision:_ pin to the **latest LTS — Node 24 "Krypton"** (`v24.16.0`), via fnm; `.node-version` pins the exact version, `engines.node: ">=24.0.0"`. _Consequences:_ fnm's `lts-latest` alias is stale on this machine (points at 22) — target 24 explicitly. _Source:_ Story 1.1 (Zac, 2026-06-11); memory [[node-build-against-latest-lts]].

### Previous Story Intelligence (Story 1.1 — done)

- Story 1.1 **explicitly deferred three decisions into this story.** Its Task 5 + Completion Notes record (a) the `archive/` coexistence model, (b) declining ESLint + deferring Tailwind, and (c) build-against-latest-LTS-Node — with the instruction _"Note these in your Completion Notes so Story 1.2 can fold them into the decision log."_ These are ADRs **0006–0008** above. **Do not lose them.** [Source: 1-1-...md#Task-5, #Completion-Notes-List]
- The repo is already at the idiomatic root-Next layout (root `package.json`, `src/app/`, `next.config.ts` with `output: 'export'`, `.node-version` = `v24.16.0`, Husky v9 hook live). Story 1.1's review verified the Husky `pretty-quick --staged` hook **actually fires** — so committing your new `.md` files will trigger Prettier formatting on them. [Source: 1-1-...md#Dev-Agent-Record]
- `.prettierignore` ignores `archive`, `node_modules`, `.next`, `out` — but **not** `docs/`. So Prettier formats your markdown. Let it; don't fight it. [Source: 1-1-...md#File-List]

### Project Structure Notes

- New tree: `docs/decisions/{README.md, _template.md, 0001-…md … 0008-…md}`. No other paths touched.
- This does **not** introduce the atomic-design tiers or any route — those are Epics 2–3. It is orthogonal to the app entirely.
- No conflict with the unified structure: `docs/` is the designated home for the decision/process byproduct (FR26), forward-compatible with Ariadne's later curation.

### Testing Standards

- **No test framework exists and none is added** (AR13). `npm test` is an honest `exit 1` stub — do not fabricate a run or claim tests pass. [Source: project-context.md#Testing-Rules]
- **Verification is by inspection** (Task 4): directory contents present, each ADR's three core sections populated, Prettier clean, and `git status` confirming zero changes outside `docs/`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2] — story statement + acceptance criteria.
- [Source: _bmad-output/planning-artifacts/epics.md#Cross-cutting-conventions] — decision-capture as-you-go (FR26/AR19), Epic 4 collates not reconstructs.
- [Source: _bmad-output/planning-artifacts/epics.md#Additional-Requirements] — AR1 (archive coexistence), AR2 (big-bang TS), AR3 (Tailwind v4 + guard), AR4/AR5/AR6 (Path A deploy), AR13 (Prettier-only tooling), AR15 (SC removal), AR19 (capture byproduct), AR20 (don't foreclose Ariadne).
- [Source: _bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/addendum.md] — decided technical stack + the "no public polish, Ariadne's job" framing.
- [Source: _bmad-output/planning-artifacts/research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md#Decision-table] — inherited closed decisions to reference (SSG, persistence, rebuild approach, MD pipeline deferral); #Project-Codenames (Ariadne = curated docs/ADRs/backroom).
- [Source: _bmad-output/implementation-artifacts/1-1-scaffold-the-greenfield-nextjs-16-typescript-project.md#Task-5] — the three Story-1.1 decisions to fold in (ADRs 0006–0008).
- [Source: _bmad-output/project-context.md#Tooling, #Testing-Rules, #Language-Specific-Rules] — Prettier/Husky, no test suite, British-spelling prose.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

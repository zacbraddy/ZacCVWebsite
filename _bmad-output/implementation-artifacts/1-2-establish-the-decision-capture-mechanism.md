---
baseline_commit: 54fddfb6468d35dd20a6fd0653721f6e188a7e77
---

# Story 1.2: Establish the decision-capture mechanism

Status: done

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
   (g) ~~Prettier-only tooling (ESLint declined; Tailwind deferred to 1.3)~~ **[SUPERSEDED 2026-06-11 — owner reversed the ESLint exclusion; see ADR 0007 and the AC4 amendment in the Dev Agent Record. The delivered decision is "Prettier + ESLint"; Tailwind remains deferred to 1.3.]**,
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

- [x] **Task 1 — Create the decisions location and the lightweight ADR template (AC: 1, 4)**

  - [x] Create the directory `docs/decisions/` (the root `docs/` exists and is currently empty — this is its first content).
  - [x] Create `docs/decisions/_template.md` holding the lightweight ADR format (see **ADR template** in Dev Notes — MADR-lite: Status, Date, Decider, Context, Decision, Consequences, optional Alternatives). Keep it lean; this is base-usable, not a polished public artefact.
  - [x] Do **not** add any dependency, generator, or config. Markdown files under `docs/` only (AC4).

- [x] **Task 2 — Author the index / README with the capture convention (AC: 1, 3)**

  - [x] Create `docs/decisions/README.md` that: (a) explains where ADRs live and the `NNNN-kebab-title.md` numbering, (b) links the template, (c) lists the seeded ADRs (index table), (d) documents the **as-you-go capture convention** as a cross-cutting Definition-of-Done item, (e) states Epic 4 / Story 4.3 **collates not reconstructs**, (f) states public-facing polish is **Ariadne's** scope and deliberately out of scope here, (g) records the **status vocabulary** (Proposed / Accepted / Superseded).
  - [x] Add an **"Inherited closed decisions"** subsection that references — by pointer to the technical research decision table and the PRD addendum, not by re-argument — the already-closed calls not given their own ADR: SSG fully-static (`output: 'export'`), theme-persistence-on (the single accepted functional change, FR10), clean parallel rebuild ported tier-by-tier with per-tier visual diffing, and the backroom-markdown pipeline deferred to Ariadne (AR20). This mirrors how the PRD's own `.decision-log.md` handled inherited decisions and closes the Epic 4 completeness gap.

- [x] **Task 3 — Seed the 8 mandatory foundational ADRs (AC: 2)**
      Create one file per decision under `docs/decisions/`, numbered in this order, each using the template and carrying the rationale + source pointers given in Dev Notes:

  - [x] `0001-nextjs-16-react-19-typescript-strict-stack.md`
  - [x] `0002-tailwind-v4-over-v3.md`
  - [x] `0003-netlify-deploy-path-a-static-export.md`
  - [x] `0004-remove-styled-components.md`
  - [x] `0005-big-bang-typescript-conversion.md`
  - [x] `0006-archive-at-root-coexistence-model.md`
  - [x] ~~`0007-prettier-only-tooling-no-eslint.md`~~ → delivered as `0007-linting-and-formatting-tooling.md` (decision reversed; see ADR 0007 + AC4 amendment)
  - [x] `0008-build-against-latest-lts-node.md`
  - [x] Set each ADR's Status to **Accepted** and Date to **2026-06-11**; Decider **Zac (We Right Code)**.
  - [x] Update the README index table to list all 8 (number, title, status).

- [x] **Task 4 — Verify (AC: 1–4)**
  - [x] `docs/decisions/` contains: `README.md`, `_template.md`, and the 8 numbered ADRs. Each ADR has Context + Decision + Consequences populated (no empty stubs).
  - [x] Run `npm run format` (or let the Husky `pretty-quick --staged` hook fire on commit) so the new `.md` files are Prettier-formatted — `docs/` is **not** in `.prettierignore`, so Prettier owns markdown formatting here; do not hand-format around it.
  - [~] **SUPERSEDED by the AC4 amendment** — this check passed for the documentation deliverable as originally scoped, but is **no longer true**: the owner-directed ESLint amendment added `eslint.config.mjs`, `package.json` (scripts + devDeps), and `package-lock.json`. The change deliberately extends beyond `docs/`. See the AC4 amendment in the Dev Agent Record and ADR 0007.

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

7. **0007 — Linting & formatting tooling: Prettier + ESLint.** **[Reversed during this story — the original seed below is retained struck-through to preserve the as-you-go trail.]** _Delivered decision:_ adopt ESLint now (flat config, `eslint-config-next` core-web-vitals + typescript + `eslint-config-prettier/flat`), Prettier stays the formatter, Tailwind still deferred to 1.3. See `docs/decisions/0007-linting-and-formatting-tooling.md` and the AC4 amendment in the Dev Agent Record. ~~_Original seed: ESLint is **permanently excluded**; Tailwind is **deferred to Story 1.3**. Formatting via Prettier 2.8.7 + Husky `pretty-quick --staged`._~~ _Source:_ Story 1.1 Task 5/Completion Notes; Next.js ESLint docs; epics.md AR13; project-context.md#Tooling.

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

claude-opus-4-8[1m] (Opus 4.8, 1M context)

### Debug Log References

- `npx prettier --write "docs/decisions/*.md"` — exit 0; formatted all 10 markdown files (the README index table was re-aligned by Prettier, which owns markdown formatting here since `docs/` is not in `.prettierignore`).
- `git status --short` — at the time of the original documentation seed, only `docs/` was new and the sole modified files were this story file and `sprint-status.yaml`. **This is superseded by the later AC4 amendment**, which added `eslint.config.mjs`, `package.json`, and `package-lock.json` to the working tree (see the AC4 amendment below).

### Completion Notes List

- Documentation-only story, no test framework involved (AR13) — verification was by inspection per Task 4. No `npm test` fabrication.
- Created `docs/decisions/` (first content in the previously-empty root `docs/`) with a MADR-lite `_template.md` and a `README.md` capture convention.
- Seeded all 8 mandatory foundational ADRs (0001–0008), each Status **Accepted**, Date **2026-06-11**, Decider **Zac (We Right Code)**, with Context + Decision + Consequences populated and source pointers folded in. ADRs 0006–0008 capture the three decisions Story 1.1 explicitly deferred into this story (archive-at-root coexistence, Prettier-only/ESLint-declined/Tailwind-deferred, build-against-latest-LTS-Node) — not lost.
- The README's "Inherited closed decisions" subsection references (does not re-litigate) the four already-closed calls without their own ADR: SSG fully-static, theme-persistence-on (FR10), clean tier-by-tier parallel rebuild, and the Ariadne markdown-pipeline deferral (AR20) — closing the Epic 4 completeness gap.
- Scope discipline (NFR6) honoured **for the documentation deliverable as originally scoped** — see the owner-directed amendment below, which knowingly supersedes AC4 for the ESLint decision only.

**Post-seed amendment (owner-directed, 2026-06-11) — ADR 0007 reversed; ESLint brought in.**

- On reviewing the seeded ADRs, Zac (the decider) rejected ADR 0007's "ESLint permanently excluded" framing: that exclusion was never an explicit owner decision — ESLint's absence from the Story 1.1 scaffold had gone unnoticed rather than been chosen. He directed bringing ESLint in now with sensible defaults for the target architecture.
- This is the **first real exercise of the as-you-go capture mechanism** built by this story: the decision reversal is recorded by rewriting the ADR (renamed `0007-prettier-only-tooling-no-eslint.md` → `0007-linting-and-formatting-tooling.md`), Status Accepted, with the reversal and "not previously an owner decision" rationale stated plainly.
- ESLint setup follows the official Next 16 flat-config guidance (per the Next.js ESLint docs Zac linked): `eslint.config.mjs` with native flat imports of `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier/flat`; `archive/**` ignored; `lint` / `lint:fix` npm scripts added. `npx eslint .` runs clean (exit 0, 470 active rules). `next lint` was removed in Next 16, so the ESLint CLI is the only path.
- **AC4 is knowingly superseded by this amendment:** the change is no longer confined to `docs/`. New devDependencies (`eslint`, `eslint-config-next`, `eslint-config-prettier`) and new/edited app-level files (`eslint.config.mjs`, `package.json`, `package-lock.json`) are now part of the working tree. This was an explicit owner instruction overriding the story's anti-gold-plating guard, and is flagged here for the code reviewer rather than hidden.

### File List

- `docs/decisions/_template.md` (new)
- `docs/decisions/README.md` (new, updated — 0007 index row)
- `docs/decisions/0001-nextjs-16-react-19-typescript-strict-stack.md` (new)
- `docs/decisions/0002-tailwind-v4-over-v3.md` (new)
- `docs/decisions/0003-netlify-deploy-path-a-static-export.md` (new)
- `docs/decisions/0004-remove-styled-components.md` (new)
- `docs/decisions/0005-big-bang-typescript-conversion.md` (new)
- `docs/decisions/0006-archive-at-root-coexistence-model.md` (new)
- `docs/decisions/0007-linting-and-formatting-tooling.md` (new — replaces the planned `0007-prettier-only-tooling-no-eslint.md`)
- `docs/decisions/0008-build-against-latest-lts-node.md` (new)
- `eslint.config.mjs` (new — owner-directed amendment)
- `package.json` (modified — `lint`/`lint:fix` scripts + ESLint devDependencies)
- `package-lock.json` (modified — ESLint dependency tree)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-11 | Established the decision-capture mechanism: `docs/decisions/` template + README convention + 8 seeded ADRs. Status → review.                                                                                                                                                                      |
| 2026-06-11 | Owner-directed amendment: reversed ADR 0007 (renamed to `0007-linting-and-formatting-tooling.md`) — ESLint brought into the project with Next 16 flat-config defaults (`eslint.config.mjs`, `lint`/`lint:fix` scripts, ESLint devDeps). Knowingly supersedes AC4 (change extends beyond `docs/`). |

## Review Findings

_Adversarial code review (Blind Hunter + Edge Case Hunter + Acceptance Auditor), 2026-06-11. The ESLint config was verified functional by execution (`npm run lint` exits 0, rules fire) — the blind layer's "config crashes on object-spread" Critical was refuted and dismissed. Surviving findings are paper-trail consistency issues, not code defects._

- [x] [Review][Patch] Capture the AC4 scope-guard override in ADR 0007 [docs/decisions/0007-linting-and-formatting-tooling.md] — _Done: added a "Scope-guard override (owner call)" bullet to 0007's Consequences._ The ESLint reversal has its own ADR, but the process decision to override AC4's "no touch to `package.json`/build" guard lived only in the Dev Agent Record, which Epic 4's collation sweep (ADRs + README index) won't surface.
- [x] [Review][Patch] Stale spec text still mandates the _reversed_ ESLint-excluded decision [1-2-...md:34, :71, :145] — _Done: AC2(g), Task 3's filename line, and Dev Notes seed #7 all struck-through/annotated as superseded, pointing to ADR 0007 + the AC4 amendment._
- [x] [Review][Patch] Task 4 verification box + Debug Log assert a now-false "zero changes outside docs/" [1-2-...md:79, :185] — _Done: Task 4's third subtask re-marked `[~]` superseded and the Debug Log `git status` entry corrected to reference the AC4 amendment._
- [x] [Review][Patch] `.mjs` missing from the `format` script glob [package.json] — _Done: glob is now `{js,jsx,mjs,cjs,ts,tsx,json,md}` so `npm run format` covers `eslint.config.mjs`._
- [x] [Review][Defer] Prettier pinned `^2.8.7` alongside modern `eslint-config-prettier ^10` [package.json] — deferred, pre-existing. Not a functional conflict (`eslint-config-prettier` is version-agnostic), but a currency smell carried over from the Story 1.1 scaffold; revisit when touching the formatter.
- [x] [Review][Defer] `npm run lint` only warns, never fails [eslint.config.mjs] — deferred, pre-existing. No `--max-warnings 0` / CI gate, so genuine a11y/Next issues pass green. Already recorded as an open follow-up in ADR 0007 ("whether to gate commits/builds on lint is a later call").

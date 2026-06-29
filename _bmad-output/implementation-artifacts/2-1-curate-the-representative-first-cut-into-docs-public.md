---
baseline_commit: 3413c2c
---

# Story 2.1: Curate the Representative first cut into `docs/public/`

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the author,
I want a bounded, high-impact set of polished Public docs derived from the Theseus Decision trail,
so that a technical evaluator reads how the decisions were actually made — trade-offs and all — and so the `docs/`-as-source model makes later extension frictionless (UJ-2, UJ-3).

## Acceptance Criteria

1. **`docs/public/` holds polished, derived markdown — not raw trail copies (FR-6).** A new `docs/public/` directory contains the Representative first cut as polished, public-facing markdown files, each **rewritten** from the Theseus Decision trail (`_bmad-output/archive/project-theseus/` + `docs/decisions/`), not pasted from it. The docs are curated and free to deviate in depth from the source. The trail and the `docs/decisions/` ADRs are **read-only source** — neither is modified, and `docs/decisions/` ADRs stay internal/unrendered (AR-4).

2. **The set is the four-doc candidate cut — representative and strong, not comprehensive (SM-C1).** The default cut is exactly four files: `start-here.md`, `framework-decision.md`, `deferring-the-polish.md`, `building-with-ai-and-bmad.md`. The bar is "representative and strong," **not** "complete" — do **not** expand to a doc-per-ADR or otherwise gold-plate (over-investing the Backroom is the named failure mode). Zac may adjust the exact list/titles, but the set stays bounded.

3. **Content coverage floor (FR-6).** Across the set: (a) the **framework decision** is covered — Gatsby → Next.js **and crucially why _not_ Astro** (the single canonical "why not Astro" line lives in `docs/decisions/0001-nextjs-16-react-19-typescript-strict-stack.md`, Alternatives section: Next App Router is the mainstream, best-supported static-export choice and keeps the markdown-pipeline door open for Ariadne); (b) the **headline pragmatism call(s)** are covered, including "deferring polish to protect delivery velocity" / staying in-scope; (c) **at least one doc makes the AI-augmented / BMAD way of working visible** — not just _what_ was decided but that it was produced _with_ an agentic workflow under an as-you-go capture discipline (this is `building-with-ai-and-bmad.md`).

4. **Every file carries valid frontmatter per the AR-4 contract (FR-6).** Each doc's YAML frontmatter carries exactly: `title` (string), `section` (one of `Overview` | `Decisions` | `Pragmatism & process` — exact strings, including the lowercase `process` and the `&`), `order` (number), `teaser` (string), and `adr` (number) **only** on the Decisions doc. **No `slug` field and no glyph field** — the slug is the kebab-case filename and tiles are derived (Overview → ★, Pragmatism & process → ◆, Decisions → the `adr` number). This frontmatter is the contract Story 2.3's Velite **Zod schema will enforce at build time** — author it to pass that schema exactly, because a stray/missing/misspelled field will fail the 2.3 build.

5. **Per-file section / order / adr assignment.** `start-here.md` → `section: Overview`, `order: 1`, no `adr`. `framework-decision.md` → `section: Decisions`, `adr: 4`, `order: 1`. `deferring-the-polish.md` → `section: Pragmatism & process`, `order: 1`, no `adr`. `building-with-ai-and-bmad.md` → `section: Pragmatism & process`, `order: 2`, no `adr`.

6. **`start-here.md` is the Overview landing doc with the sales-pitch framing (UX-DR14).** It explains what the Backroom is and carries the framing "Here's how the decisions were actually made — trade-offs and all." (or a close British-spelled variant in the same voice), and reads as the default landing surface.

7. **Authoring conventions are followed (AR-13, UX-DR11, UX-DR17).** Pragmatism call-outs are **plain markdown blockquotes** (`> …`) — no plugin, no custom syntax; internal doc-to-doc links use **absolute Backroom paths** (`[text](/backroom/<slug>)`, e.g. `/backroom/framework-decision`) — **never** `./file.md` or a relative path; every internal link target is a file that exists in this same cut (no dead links). The voice is **competent and candid** — plain, judgement-forward, never bragging — in **British spelling** throughout, with no internal audit noise (no `[ZAC]` markers, ADR-template scaffolding, story IDs, or sprint jargon).

8. **No pipeline, components, or build wiring in this story; build + lint stay green.** This story produces **only** markdown under `docs/public/`. It does **not** install Velite/Shiki, create `velite.config.ts`, touch `next.config.ts`/`globals.css`, add components/routes, or author ADR 0027 — all of that is Story 2.3. Because nothing yet consumes `docs/public/`, `npm run build` and `npm run lint` are unaffected and must remain green (a clean static export, every route `○ (Static)`); there is **no Velite build to run yet**, so do **not** fabricate one. Frontmatter validity is verified **manually against the AR-4 contract table** in this story.

## Tasks / Subtasks

- [ ] **Task 1 — Read the source trail (read-only) and confirm the cut (AC: #1, #2, #3)**
  - [ ] Read the curated base input `_bmad-output/archive/project-theseus/implementation-artifacts/4-3-collate-and-sign-off-the-decision-process-trail.md` (the signed-off trail — Ariadne's intended starting point).
  - [ ] Read the framework source: `docs/decisions/0001-nextjs-16-react-19-typescript-strict-stack.md` (esp. the **Alternatives** section — the canonical "why not Astro" line) and `docs/decisions/0002-tailwind-v4-over-v3.md`.
  - [ ] Read the pragmatism source: `_bmad-output/archive/project-theseus/implementation-artifacts/deferred-work.md` (deferred/in-scope-deviation log) and the scope-discipline / honesty-bar notes in story 4-3.
  - [ ] Skim `docs/decisions/README.md` and `_bmad-output/archive/project-theseus/epics.md` (FR26 as-you-go capture, cross-cutting conventions) for the AI/BMAD way-of-working material.
  - [ ] Treat all of the above as **read-only**. Do not edit any source file.
- [ ] **Task 2 — Create `docs/public/` and author `start-here.md` (AC: #1, #4, #5, #6, #7)**
  - [ ] Create the `docs/public/` directory.
  - [ ] Write `start-here.md` (Overview): what the Backroom is + the sales-pitch framing; link out to the other three docs via absolute `/backroom/<slug>` paths. Frontmatter: `section: Overview`, `order: 1`, no `adr`.
- [ ] **Task 3 — Author `framework-decision.md` (AC: #3a, #4, #5, #7)**
  - [ ] Polished prose covering Gatsby → Next.js + React 19 + TS-strict, and **why not Astro** (mainstream static-export choice; keeps the markdown-pipeline door open for Ariadne). Optionally fold in Tailwind v4 CSS-first and the styled-components removal as supporting choices. Frontmatter: `section: Decisions`, `adr: 4`, `order: 1`, teaser `Why Next.js — and why not Astro`.
- [ ] **Task 4 — Author `deferring-the-polish.md` (AC: #3b, #4, #5, #7)**
  - [ ] Polished prose on the headline pragmatism call: deferring polish to protect delivery velocity / scope discipline (work stays in the Theseus box; ~8 logged-and-approved deviations, 20+ Ariadne-deferred items, zero speculative work). Include the pragmatism call-out as a markdown blockquote. Frontmatter: `section: Pragmatism & process`, `order: 1`, no `adr`.
- [ ] **Task 5 — Author `building-with-ai-and-bmad.md` (AC: #3c, #4, #5, #7)**
  - [ ] Polished prose making the AI-augmented / BMAD workflow visible: as-you-go decision capture (FR26), the honesty bar (agent does the mechanical sweep, the human does the judgement and sign-off — decisions recorded as made, not reconstructed). Frontmatter: `section: Pragmatism & process`, `order: 2`, no `adr`.
- [ ] **Task 6 — Self-check + verify (AC: #4, #7, #8)**
  - [ ] Validate each file's frontmatter **by hand against the AR-4 contract table** (Dev Notes): required keys present, `section` is one of the three exact enum strings, `adr` present **only** on `framework-decision.md`, **no** `slug`/glyph field.
  - [ ] Grep the four docs for convention violations: no relative `](./` or `](../` links and no `.md` in internal hrefs (`grep -rn "](\./\|](\.\./\|\.md)" docs/public/`); internal links use `/backroom/<slug>`; every internal link target exists in the cut.
  - [ ] Confirm British spelling and competent-and-candid voice; remove any internal audit noise.
  - [ ] `npm run lint` clean and `npm run build` green + pure static export (unchanged — `docs/public/` is not yet consumed). Do **not** run or fabricate a Velite build (it doesn't exist until Story 2.3).

## Dev Notes

### What this story is (and is not)

This is a **content-authoring / curation** story — the first slice of Epic 2 — and the **only** Epic 2 story that touches no `src/`, no config, and no dependencies. You are writing **four polished markdown files** into a new `docs/public/` directory, each rewritten (one-way) from the existing Theseus Decision trail. You are **not** building the pipeline that renders them (Velite + Shiki, the route group, `globals.css` tokens, ADR 0027) — that is **Story 2.3**, and pulling any of it forward is out of scope. The governing discipline is **representative-and-strong over comprehensive** (SM-C1): four strong docs, not a doc per ADR. Over-investing the Backroom is the explicitly named failure mode for this whole project. [Source: epics.md#Story-2.1, epics.md#Epic-2; PRD FR-6; project-context.md]

### Files created (exhaustive — all NEW)

| File                                       | Section                | `adr` | `order` | Tile (derived) | Sourced primarily from                                                              |
| ------------------------------------------ | ---------------------- | :---: | :-----: | :------------: | ----------------------------------------------------------------------------------- |
| `docs/public/start-here.md`                | `Overview`             |   —   |    1    |       ★        | 4-3 trail sign-off + epics overview + decisions README                              |
| `docs/public/framework-decision.md`        | `Decisions`            |   4   |    1    |  `04` (cyan)   | ADR 0001 (stack + **Astro**), ADR 0002 (Tailwind v4); ADR 0026 (cutover) supporting |
| `docs/public/deferring-the-polish.md`      | `Pragmatism & process` |   —   |    1    |       ◆        | `deferred-work.md` + 4-3 scope-discipline / anti-gold-plating notes                 |
| `docs/public/building-with-ai-and-bmad.md` | `Pragmatism & process` |   —   |    2    |       ◆        | 4-3 honesty-bar + Dev Agent Record; epics FR26/cross-cutting conventions; README    |

The four-doc cut and titles are the architecture's named candidate set and are the recommended default. Zac may rename/re-scope, but keep the set bounded and keep coverage AC#3 satisfied (framework + why-not-Astro, pragmatism, AI/BMAD). [Source: architecture.md#File/Route-Layout tree (lines 381–384); epics.md#Story-2.1 Note]

### ⚠️ The frontmatter contract is a hard machine contract — get it exactly right

Story 2.3 builds a Velite collection over `docs/public/*.md` with a **Zod schema** that **fails the build on any invalid/missing frontmatter**. The markdown you write here is validated by that schema later — so author it to pass it now. AR-4 / UX-DR-frontmatter:

| Field     | Type                                                     | Required?             | Notes                                                                   |
| --------- | -------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| `title`   | string                                                   | yes                   | doc title (rendered in Permanent Marker) + nav-row title                |
| `section` | enum `Overview` \| `Decisions` \| `Pragmatism & process` | yes                   | drives nav grouping — **exact** strings (note `&`, lowercase `process`) |
| `order`   | number                                                   | yes                   | sort order within its section                                           |
| `teaser`  | string                                                   | yes                   | one-line nav-row teaser (rendered in `text-dim`)                        |
| `adr`     | number                                                   | **only** on Decisions | number tile; omit entirely on non-Decisions docs                        |

- **No `slug` field** — slug = the kebab-case filename → `/backroom/<filename>`. **No glyph field** — tiles are derived (`Overview` → ★ gold, `Pragmatism & process` → ◆ gold, `Decisions` → the `adr` number in cyan). Adding either field is a contract violation.
- Within `Decisions`, the nav sorts by `adr` number; within other sections by `order`. There is one Decisions doc in this cut, so `adr: 4` is unambiguous; `order`/`adr` collisions later fall back to a stable secondary sort by filename. [Source: architecture.md#docs/public-Frontmatter-Contract (lines 282–301); epics.md#AR-4, #Story-2.1 AC2]

**Frontmatter examples (copy the shape exactly):**

```yaml
---
title: Start here
section: Overview
order: 1
teaser: How this site was actually built — and why
---
```

```yaml
---
title: Framework decision
section: Decisions
adr: 4
order: 1
teaser: Why Next.js — and why not Astro
---
```

```yaml
---
title: Deferring the polish
section: Pragmatism & process
order: 1
teaser: Choosing what not to build, to protect delivery
---
```

```yaml
---
title: Building with AI & BMAD
section: Pragmatism & process
order: 2
teaser: Decisions recorded as they were made, not reconstructed
---
```

(Titles/teasers above match the nav structure and the EXPERIENCE.md voice table; the "Why Next.js — and why not Astro" teaser is a verbatim Do-example. Exact teaser wording is a tweakable — Zac may refine.) [Source: EXPERIENCE.md#Voice-and-Tone, #Backroom-nav-structure]

### Source → target mapping (what to pull from where)

All sources are **read-only**. Rewrite into polished prose; do not paste raw ADR/story scaffolding.

- **`framework-decision.md`** ← `docs/decisions/0001-nextjs-16-react-19-typescript-strict-stack.md` (the canonical source). Cover: Gatsby (deprecating trajectory, no type safety, ageing `@reach/router`/GraphQL) → **Next.js 16 App Router + React 19.2 + TypeScript strict**; the big-bang TS conversion (small codebase, no mixed-mode seam). **Why not Astro** lives here in the **Alternatives** section — verbatim gist: _"Next App Router is the mainstream, best-supported choice for a static-export marketing/CV site and keeps the markdown-pipeline door open for Ariadne."_ Optionally fold in `docs/decisions/0002-tailwind-v4-over-v3.md` (Tailwind v4 CSS-first / Oxide over v3 — start a greenfield build on the current major) and the styled-components removal (zero CSS-in-JS runtime) as supporting decisions; and `docs/decisions/0026-…` for the static-export-on-Netlify cutover. A gold pragmatism call-out fits naturally here (e.g. the "right tool a sole maintainer can still reason about in 18 months" line). [Source: ADR 0001 Alternatives; ADR 0002; ADR 0026; epics(theseus)#AR2/AR3]
- **`deferring-the-polish.md`** ← `_bmad-output/archive/project-theseus/implementation-artifacts/deferred-work.md` + the scope-discipline / anti-gold-plating material in `4-3-collate-and-sign-off-…​.md`. Cover: scope discipline as a first-class quality attribute ("work stays inside the Theseus box"); the headline call of **deferring polish to protect delivery velocity**; the shape of the discipline — ~8 conscious, logged, Zac-approved parity deviations, 20+ items consciously **deferred to Ariadne** (a11y backlog, content refresh, analytics consent), and **zero** speculative work. The point: every deferred item is _evidence the build stayed in scope_, not a corner cut. [Source: deferred-work.md; story(theseus) 4-3 lines 34–38, 342–349; epics(theseus)#NFR6]
- **`building-with-ai-and-bmad.md`** ← the honesty-bar + Dev Agent Record material in `4-3-…​.md`, plus the FR26 as-you-go capture convention and cross-cutting conventions in `_bmad-output/archive/project-theseus/epics.md`, and `docs/decisions/README.md`. Cover: the **as-you-go decision-capture discipline** (material calls recorded _at the moment they were made_, on every story, so the trail is collated, not reconstructed); the **honesty bar** — the agent does the mechanical work (read all artefacts, build the decision inventory, reconcile indices), the **human does the judgement and sign-off** (no fabricated sign-off); decisions live in MADR-lite ADRs. This is the doc that makes the AI-augmented workflow _visible_ (AC#3c). [Source: story(theseus) 4-3 Dev Notes/Dev Agent Record; epics(theseus)#FR26, cross-cutting conventions; docs/decisions/README.md]
- **`start-here.md`** ← the 4-3 trail context/purpose, the epics overview, and `docs/decisions/README.md`. Cover: what the Backroom is (the opt-in reading room behind the CV), the sales-pitch framing (UX-DR14), and a short orientation that links out to the other three docs via absolute `/backroom/<slug>` paths. This is the default landing surface and its nav row is selected by default in the Backroom. [Source: story(theseus) 4-3 Context; UX-DR14; EXPERIENCE.md#Surface-map]

### Authoring conventions (apply to every doc)

- **Pragmatism call-out = a plain markdown blockquote** (`> …`). Story 2.3 styles blockquotes as the gold left-bar call-out; here you just write the blockquote. **No plugin, no custom `:::callout` syntax.** [Source: architecture.md#Authoring-Conventions; UX-DR11]
- **Internal doc-to-doc links = absolute Backroom paths** — `[text](/backroom/framework-decision)` — **never** `./framework-decision.md` or any relative path, or it will not resolve in the static export. Every internal link target must be one of the four files in this cut (no dead links — AC#7). [Source: architecture.md#Authoring-Conventions (AR-13); UX-DR17]
- **Voice: competent and candid** — plain, judgement-forward, never bragging. **British spelling throughout.** Public-facing prose only — strip all internal audit noise: no `[ZAC]` sign-off markers, no ADR-template field labels, no story IDs (`FR-6`, `Story 4.3`), no sprint/BMAD jargon in the _body_ (it's fine to _describe_ the BMAD workflow in `building-with-ai-and-bmad.md`, just don't leave scaffolding in). [Source: EXPERIENCE.md#Voice-and-Tone; project-context.md "British spelling"; global CLAUDE.md]
- **Voice anchors (Do, from EXPERIENCE.md):** Overview framing — _"Here's how the decisions were actually made — trade-offs and all."_; framework teaser — _"Why Next.js — and why not Astro"_; a pragmatism call-out — _"The pragmatism call: the right tool is the one a sole maintainer can still reason about in 18 months."_ (Don't: _"An exploration of modern framework choices"_, _"Welcome to my portfolio of technical excellence"_, _"Best practices were followed."_) [Source: EXPERIENCE.md#Voice-and-Tone Do/Don't table]

### Hard out-of-scope (do NOT do these here)

- ❌ Install `velite` / `@shikijs/rehype` / `shiki`, or create `velite.config.ts` → **Story 2.3**.
- ❌ Touch `next.config.ts`, `globals.css`, `.gitignore`, or add `--shiki-*`/`text-dim`/`code-surface` tokens → **Story 2.3**.
- ❌ Create any component, route, `(backroom)`/`(site)` group, or layout → **Stories 2.2–2.4**.
- ❌ Author or edit ADR 0027 (`docs/decisions/0027-markdown-pipeline-velite-shiki.md` already exists, authored 2026-06-25) — it is implemented _per_ in 2.3, not here.
- ❌ Edit any file under `_bmad-output/archive/project-theseus/` or `docs/decisions/` — those are read-only source.
- ❌ Expand the cut into a doc-per-ADR or a sprawling set — representative-and-strong, four docs (named over-investment failure mode). [Source: epics.md#Story-2.1, #AR-11; architecture.md; project-context.md "don't add deps casually"]

### Verification standard (no test suite; no pipeline yet)

`npm test` is a stub (`exit 1`) — there is no test framework; do not fabricate test runs. And because `docs/public/` is **not yet wired into any build step** (Velite arrives in Story 2.3), there is **no Velite build to run** and `docs/public/*.md` cannot fail `npm run build` yet. Verification here is:

1. **Frontmatter validated by hand** against the AR-4 contract table above — required keys present, `section` one of the three exact enum strings, `adr` only on `framework-decision.md`, no `slug`/glyph field. (This is the headline risk: a typo here surfaces as a confusing build failure in 2.3.)
2. **Convention grep:** `grep -rn "](\./\|](\.\./\|\.md)" docs/public/` returns nothing (no relative or `.md` internal links); internal links are `/backroom/<slug>` and every target exists.
3. **Voice/spelling pass:** British spelling, competent-and-candid, no internal audit noise.
4. `npm run lint` clean and `npm run build` green + pure static export (every route `○ (Static)`, no `.func`) — unchanged from baseline, since nothing consumes the new files. [Source: project-context.md "Testing Rules"; epics.md#AR-15; architecture.md#Build-integration (Velite is 2.3)]

### Previous story intelligence (Epic 1 + Theseus)

- This is the **first story of Epic 2**; there is no prior Epic 2 story to learn from. Epic 1 (Stories 1.1–1.4, all done) was strict data/config/asset/copy edits with "stay thin, don't gold-plate" — the **same discipline** carries here, now applied to content authoring.
- **Carry-over (important):** Zac **hand-edits copy mid-implementation** — this is _his_ voice and _his_ story, so expect heavy hand-editing of the prose. Produce a strong, accurate first draft grounded in the real source; **preserve Zac's edits** and only fix accidental typos. Do not re-impose your own wording over his. [Source: 1-2/1-3/1-4 dev notes; memory: "Theseus content frozen; Ariadne owns refresh", "fix bugs don't port verbatim"]
- **No dead-stack framing.** When describing the framework decision, present it as the current architecture and the reasoning behind it; frame Gatsby as the prior baseline the decision moved on from where it aids the story, but do not write it as a tombstone or invite "resurrect the old stack" readings. [Source: memory "no-dead-stack-framing-in-llm-docs"]

### Git intelligence

Recent commits follow `feat: Project Ariadne story 1-N created` then `… code complete`, one focused diff per story (`3413c2c` = Story 1.4 code complete, the baseline for this story). Keep this diff scoped to the new `docs/public/` directory (four files) only — no drive-by edits elsewhere. [Source: git log]

### Project Structure Notes

- `docs/public/` is a **new** content directory. It sits alongside the existing internal `docs/decisions/` (ADRs, which stay internal/unrendered per AR-4). No existing file moves; the Epic 2 route-group split (`(site)`/`(backroom)`) is Stories 2.2+, not this one. [Source: architecture.md#File/Route-Layout; epics.md#AR-4, #AR-7]
- Atomic-design tiers, theming, components — **not touched** by this story (no components created). [Source: project-context.md]

### References

- [Source: epics.md#Story-2.1] — story statement, acceptance criteria, candidate-set Note, "representative not complete" bar.
- [Source: epics.md#Epic-2, #AR-4, #AR-11, #AR-13, #AR-15] — frontmatter contract, ADR 0027 already authored, internal-link rule, verification standard.
- [Source: architecture.md#docs/public-Frontmatter-Contract (lines 282–301), #Authoring-Conventions (lines 330–336), #File/Route-Layout tree (lines 381–384)] — exact schema, conventions, candidate filenames + section/adr assignment.
- [Source: EXPERIENCE.md#Voice-and-Tone, #Backroom-nav-structure, #Surface-map] — Do/Don't voice table, teasers, section labels, Overview framing.
- [Source: docs/decisions/0001-nextjs-16-react-19-typescript-strict-stack.md (Alternatives)] — the canonical "why not Astro" line.
- [Source: docs/decisions/0002-tailwind-v4-over-v3.md, 0026-production-cutover-and-gatsby-retirement.md] — supporting framework/cutover material.
- [Source: _bmad-output/archive/project-theseus/implementation-artifacts/4-3-collate-and-sign-off-the-decision-process-trail.md] — trail context, scope-discipline summary, honesty bar (read-only source).
- [Source: _bmad-output/archive/project-theseus/implementation-artifacts/deferred-work.md] — deferred/in-scope-deviation log (read-only source).
- [Source: _bmad-output/archive/project-theseus/epics.md] — FR26 as-you-go capture, cross-cutting conventions (read-only source).
- [Source: project-context.md] — British spelling, no code comments, static export, no test suite, don't add deps casually.
- [Source: global CLAUDE.md] — British spelling, minimum necessary complexity, no removal breadcrumbs.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-29 | Story 2.1 created (ready-for-dev): curate the Representative first cut into `docs/public/` — four polished docs (`start-here`, `framework-decision` adr 4, `deferring-the-polish`, `building-with-ai-and-bmad`) derived one-way from the Theseus trail, with AR-4 frontmatter, blockquote call-outs, absolute internal links, and the competent-and-candid British-spelled voice. Pipeline/components/ADR-0027 explicitly deferred to later Epic 2 stories. |

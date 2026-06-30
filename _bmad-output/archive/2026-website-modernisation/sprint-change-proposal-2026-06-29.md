---
title: Sprint Change Proposal — Deepen the Decisions section
date: 2026-06-29
author: Zac (via correct-course)
epic: Epic 2 — Open the Backroom
scope: Moderate (additive story + renumber)
status: proposed
---

# Sprint Change Proposal — Deepen the Decisions section (2026-06-29)

## 1. Issue Summary

During the Story 2.3 code review (the Velite + Shiki pipeline), two things converged:

- The review's Acceptance Auditor flagged that **none of the four curated docs ships a code block or a table**, so AC3's "syntax highlighting present in the prerendered HTML" is proven-capable but absent from the actual output (verified only with temporary scratch content).
- Zac observed that the curated set is **prose-heavy and the Decisions section is underpowered**: the four Story-2.1 docs are 10k-foot narrative pieces, and two of them already live in the **Pragmatism & process** section. The **Decisions** section currently has exactly **one** entry (`framework-decision.md`), and it is prose _about_ a decision, not a MADR. Meanwhile 28 real MADRs sit internal in `docs/decisions/0001–0028` — the dated, trade-off-weighing, rejected-alternatives artefacts that actually demonstrate Zac's ADR workflow, which is the differentiator the Backroom exists to convey.

The trigger: **the work to populate the Decisions section with representative MADR-format content is not currently scoped in any Epic 2 story.** It was implicitly left to the "drop a markdown file into `docs/public/` later" affordance. Zac wants it explicitly covered within the epic.

## 2. Impact Analysis

**Epic Impact:** Epic 2 only. One new story inserted; no epic goal change.

**Story Impact:**

- Story 2.3 (pipeline) — **done**, unchanged. The new story consumes it as-is.
- Story 2.4 (two-pane reading room + sectioned nav) — **unchanged in content**, stays at 2.4. Built first against the current set; the new content slots into its DECISIONS group on the next build (UJ-3), exercising the `adr`-number sort it was designed for.
- **NEW Story 2.5** — Deepen the Decisions section with representative MADR-format ADRs.
- Story 2.5 (Entry link) → renumbered **2.6**.
- Story 2.6 (Console egg) → renumbered **2.7**.

**Artifact Conflicts:**

- `epics.md` — insert Story 2.5; renumber Entry-link and Console-egg story headers; fix one cross-reference in Story 2.2's AC ("console egg added later in Story 2.6" → 2.7).
- `sprint-status.yaml` — insert the new story key (`backlog`); renumber the two trailing keys.
- **No PRD change** — the new story is the _depth_ pass under the existing **FR-6** (curate public docs) and exercises FR-7/FR-9 (render + highlight) with real content. No new FR.
- **No architecture change** — AR-4 already defines `section: Decisions` + the `adr` number contract and explicitly keeps `docs/decisions/` internal; the new docs are _derived_ into `docs/public/`, not rendered in place. AR-2/3/5 (pipeline + routing) unchanged.
- **No UX change** — UX-DR5 (number-tile), UX-DR10/11/12 (renderer/call-out/code), UX-DR15 (sectioned nav), UX-DR16/17 (type scale/voice) already anticipate a populated Decisions section; this makes them real.

**Technical Impact:** Almost entirely content (markdown into `docs/public/`). The single code/config change is folding in the carried Story-2.3 review patch: add Shiki `variableDefaults` / the missing `--shiki-token-inserted/-deleted/-changed` + `--shiki-ansi-*` fallbacks, now justified because code blocks finally ship. No new dependencies. No pipeline change.

## 3. Recommended Approach

**Direct Adjustment — add one story within the existing plan.** No rollback, no MVP change. The new story is positioned **after** the nav story (Zac's call) so the whole content-and-structure block (2.3 pipeline → 2.4 nav → 2.5 decisions content) completes before the front-of-house integration stories (2.6 Entry link, 2.7 console egg).

- **Effort:** content-dominated; 10-11 derived MADR docs + one small Shiki-fallback fix. No new tech.
- **Risk:** low. Consumes the done pipeline; AR-4/UX already support the data shape.
- **Discipline guard:** representative-and-strong, **not** all 28 (over-investment is the named failure mode, SM-C1). Final list chosen in-story.

## 4. Detailed Change Proposals

### 4a. `epics.md` — INSERT new Story 2.5 (after Story 2.4, before the renumbered Entry-link story)

````
### Story 2.5: Deepen the Decisions section with representative MADR-format ADRs

As Zac, the author,
I want a representative set of my strongest architectural decisions ported into the Backroom as polished, public-facing docs in MADR structure,
So that a technical evaluator sees how I actually run decisions — context, trade-offs, rejected alternatives and the trail — not a single prose retelling, and so the Decisions section earns its place beside the Pragmatism & process set (UJ-2, UJ-3).

**Acceptance Criteria:**

**Given** the internal MADR trail in `docs/decisions/0001–0028` as the one-way source (AR-4: `docs/decisions/` stays internal/unrendered — these are *derived* into `docs/public/`, not rendered in place)
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

**Note:** This is the **depth** pass on the Decisions section — distinct from Story 2.1's representative *first cut* (Overview + Pragmatism breadth). It renders entirely through the **already-complete** Story 2.3 Velite + Shiki pipeline with no pipeline change beyond the one Shiki-fallback fix; the two-pane nav (2.4), Entry link (2.6) and console egg (2.7) are out of scope. Discipline: representative-and-strong over comprehensive (SM-C1) — resist porting all 28.
````

### 4b. `epics.md` — RENUMBER trailing story headers

- `### Story 2.5: Add the front-of-house Entry link` → `### Story 2.6: Add the front-of-house Entry link`
- `### Story 2.6: Add the console easter egg` → `### Story 2.7: Add the console easter egg`

### 4c. `epics.md` — FIX cross-reference in Story 2.2 AC

- `the console egg added later in Story 2.6` → `the console egg added later in Story 2.7`

### 4d. `sprint-status.yaml` — INSERT + RENUMBER (all `backlog`)

```
  2-4-build-the-two-pane-reading-room-and-sectioned-navigation: backlog
  2-5-deepen-the-decisions-section-with-representative-adrs: backlog
  2-6-add-the-front-of-house-entry-link: backlog
  2-7-add-the-console-easter-egg: backlog
```

(`last_updated` → 2026-06-29.)

## 5. Implementation Handoff

**Scope classification: Moderate** (backlog reorganisation — story insertion + renumber).

- **Now (this proposal):** update `epics.md` + `sprint-status.yaml` per Section 4.
- **When its turn comes:** run `bmad-create-story` for Story 2.5 to produce the context-filled story spec, then `bmad-dev-story` to implement. Sequence: finish 2.4 (nav) → 2.5 (this) → 2.6 (Entry link) → 2.7 (console egg).
- **Success criteria:** 10-11 representative MADR docs live in the Decisions section, rendering through the existing pipeline with real syntax-highlighted code; the Shiki-fallback gap from the 2.3 review closed; build + lint green; no scope bleed into nav/entry-link/egg.

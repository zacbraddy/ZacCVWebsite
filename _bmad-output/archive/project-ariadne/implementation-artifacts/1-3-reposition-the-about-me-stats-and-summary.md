---
baseline_commit: bbd8d6f7a5ac4d515149df69f3fded56cfb6c975
---

# Story 1.3: Reposition the About-me stats and summary

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the maintainer,
I want the About-me stats corrected and the lead summary rewritten to my current positioning,
so that a visitor reads an accurate reflection of what I build now, not the old CTO framing (UJ-1).

## Acceptance Criteria

1. **Age stat corrected (FR-4).** In `src/components/organisms/about-me.tsx` the `StatRow subject="Age"` value is changed from `"39"` to `"41"`. The value stays a plain string (the `StatRow` contract is `value: string`).

2. **Stat row reviewed for currency (FR-4).** **Residence (`Nottingham, UK`), Nationality (`Australian`), Citizenship (`Australian + British`) and Phone (`+447450 587 400`) are confirmed current — leave them exactly as-is.** The **Email stat is updated (locked) to the We Right Code business address**: `value="zacharybraddy&#0064;gmail.com"` → `value="zac&#0064;werightcode.com"`. The **`&#0064;` HTML-entity obfuscation is kept** (never a literal `@` — project gotcha) and the `<StatRow .../>` markup shape is unchanged. All stats end factually accurate.

3. **Lead summary repositioned (FR-4, core delta).** The prose block inside `about-me.tsx` — the lead `<p>`, the four `<Highlight>` `<li>` items, and the closing `<p>` — is rewritten from the old "seasoned technology leader… as a CTO… strategic vision… high-performing teams" framing to the current We Right Code positioning. The new copy **leads with what Zac builds** — 0-to-1 Builder & System Modernisation Specialist — and follows the **Builder → System Modernisation → Strategy** gradient, with strategy reading as **a quality of _how_ he builds, never a standalone service** ("builds with strategy in mind" is right; "provides strategic technical leadership" is wrong). Recommended copy is in Dev Notes; the exact wording is Zac's to confirm/adjust before or during dev.

4. **Voice, structure & escaping preserved.** The rewrite keeps the existing component structure (one lead `<p>`, a `<ul>` of `<Highlight>`-led `<li>` items, one closing `<p>`) and the existing JSX/styling — `Heading`, `StatRow`, `Highlight` atoms, the grid wrappers and Tailwind classes are unchanged; only the **text content** changes. Straight apostrophes in prose are escaped as `&apos;` (`react/no-unescaped-entities`); curly apostrophes are left literal. **British spelling** throughout (`modernise`, `optimise`, `behaviour`, `specialise`).

5. **Scope discipline — stats + lead summary only (no gold-plating).** The change is confined to `src/components/organisms/about-me.tsx`. The **other About-me organisms are out of scope and untouched**: `what-i-do.tsx`, `testimonials.tsx`, `things-i-like.tsx` (rendered alongside `AboutMe` in `about-me/page.tsx`). **Do not edit `src/app/about-me/page.tsx`** — its metadata/`creator:` handle belongs to Story 1.4, not this story. No new files, no new dependencies, no structure change.

6. **Zero front-of-house regression + clean build (no test suite).** `npm run build` is a clean static export (every route `○ (Static)`, no `.func`) and `npm run lint` is clean (no unused-import or other errors — note any `Highlight`/`StatRow` import stays used). The About-me page renders correctly in `npm run dev`/preview with the new stats and copy, layout visually unchanged. Do **not** fabricate test runs — there is no test framework.

## Tasks / Subtasks

- [x] **Task 1 — Correct the Age stat (AC: #1, #2)**
  - [x] In `src/components/organisms/about-me.tsx`, change `<StatRow subject="Age" value="39" />` → `value="41"`.
  - [x] Leave Residence, Nationality, Citizenship, Phone as-is (confirmed current).
  - [x] Change the Email stat (locked) `value="zacharybraddy&#0064;gmail.com"` → `value="zac&#0064;werightcode.com"`. Keep the `&#0064;` entity for `@`; leave the `<StatRow .../>` shape unchanged.
- [x] **Task 2 — Reposition the lead summary prose (AC: #3, #4)**
  - [x] Rewrite the lead `<p>` (currently lines ~12–20) to lead with 0-to-1 Builder & System Modernisation Specialist.
  - [x] Rewrite the four `<li>` items (keep them `<Highlight>`-led, keep the `<ul className="flex flex-col gap-8">` structure) onto the Builder → Modernisation → Strategy-as-a-quality → AI-augmented-delivery themes (recommended copy in Dev Notes).
  - [x] Rewrite the closing `<p>` to drop the "join an early-stage startup / build high-performing teams" framing.
  - [x] Escape straight apostrophes as `&apos;`; British spelling throughout. Do NOT change any `className`, the `Heading`, the grid wrappers, or the atom imports.
- [x] **Task 3 — Scope check (AC: #5)**
  - [x] Confirm only `src/components/organisms/about-me.tsx` is modified. `what-i-do.tsx`, `testimonials.tsx`, `things-i-like.tsx`, and `src/app/about-me/page.tsx` are untouched.
- [x] **Task 4 — Verify (AC: #6)**
  - [x] `npm run lint` — confirm clean (watch for any now-unused import; all three atoms should still be used).
  - [x] `npm run build` — confirm green, pure static export (every route `○ (Static)`, no `.func`).
  - [x] `npm run dev` (or deploy preview) — confirm the About-me page shows Age 41, the repositioned copy reads in the new voice, and the two-/three-column layout is visually unchanged. Do NOT fabricate test runs (no test suite exists).

## Dev Notes

### What this story is (and is not)

This is a **copy/data** story under Epic 1's strict "zero change to structure, design, or flash; do not gold-plate" discipline. **Exactly one file changes: `src/components/organisms/about-me.tsx`.** The two deltas are (a) the Age stat `39 → 41` and (b) repositioning the prose block from the old CTO/technology-leader framing to the current We Right Code positioning. Do NOT restyle, do NOT touch the other About-me organisms, do NOT touch `about-me/page.tsx`. [Source: epics.md#Epic-1, epics.md#Story-1.3; PRD FR-4]

### The component contract (read before editing)

`src/components/organisms/about-me.tsx` is a **Server Component** (no `'use client'`) — a single `AboutMe` arrow component, default-exported. Its shape (preserve all of it; change text only):

- A `<Heading>About <span className="text-secondary">Me</span></Heading>`.
- A responsive grid: `<div className="ml-4 lg:mx-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">`.
  - Left column `<div className="xl:col-span-2 flex flex-col gap-8">`: **lead `<p>`**, then a `<ul className="flex flex-col gap-8">` of **four `<li>` items each opening with a `<Highlight>…</Highlight>`** label, then a **closing `<p>`**. ← this is the prose to reposition.
  - Right column: a stats block of six `<StatRow subject=… value=… />`. ← Age is here.

Atom contracts (do not change the atoms):

- `StatRow` — `{ subject: string; value: string }`; renders subject (bold, `text-secondary`) left + value right. [src/components/atoms/stat-row.tsx]
- `Highlight` — `{ children }`; renders an italic bold `text-tertiary text-lg` inline label with a trailing `&nbsp;`. Used as the lead-in of each `<li>`. [src/components/atoms/highlight.tsx]
- `Heading` — section heading. Unchanged.

All three imports (`StatRow`, `Heading`, `Highlight`) must **remain used** after the rewrite (keep four `<Highlight>`-led bullets), or lint will flag an unused import. [Source: src/components/organisms/about-me.tsx]

### JSX escaping + British spelling (project rules)

- Escape straight `'` as `&apos;` in prose (`react/no-unescaped-entities`) — the existing file already uses `I&apos;m`, `what&apos;s`, etc. Preserve any curly `'` literally. [memory: theseus-epic3-jsx-apostrophe-escaping]
- **British spelling** in all user-facing copy: `modernise`/`modernisation`, `optimise`, `behaviour`, `specialise`, `prioritise`. The existing file has one Americanism — `prioritize` at line 48 (inside the bullet being rewritten) — which the rewrite moots. [Source: project-context.md "Language-Specific Rules"; global CLAUDE.md]

### Email obfuscation gotcha

The Email stat is **intentionally entity-obfuscated** to deter scrapers: `value="zacharybraddy&#0064;gmail.com"` (`&#0064;` = `@`). If the email is changed, **keep the `&#0064;` entity** — do not "clean it up" to a literal `@`. [Source: project-context.md "Email is intentionally entity-obfuscated"]

### Stats — currency review (source of truth)

Zac is **41** (born ~1985; Australian living in Nottingham, UK; dual Australian + British). [Source: global CLAUDE.md "About me"]

| Stat        | Current value                   | Action                                                                  |
| ----------- | ------------------------------- | ----------------------------------------------------------------------- |
| Age         | `39`                            | **→ `41`** (locked)                                                     |
| Residence   | `Nottingham, UK`                | current — leave                                                         |
| Nationality | `Australian`                    | current — leave                                                         |
| Citizenship | `Australian + British`          | current — leave                                                         |
| Phone       | `+447450 587 400`               | current — leave                                                         |
| Email       | `zacharybraddy&#0064;gmail.com` | **→ `zac&#0064;werightcode.com`** (locked) — keep `&#0064;` obfuscation |

### The positioning — what the rewrite must say (We Right Code canon)

Lead with **what Zac builds**; let strategic thinking emerge from the description of the work. The hierarchy is **Builder → System Modernisation → Strategy**, in that order. Strategy is **not a service** — it is a quality of _how_ he builds (architectural decisions that compound rather than constrain). "I build with strategy in mind" ✅ · "I provide strategic technical leadership" ❌. Two distinct service lines + their proof points:

- **0-to-1 Builder** — for non-technical funded founders who need their product built from scratch, fast. **Proof: Flocast** — concept to paying customers in **5 months** as the sole technical resource.
- **System Modernisation** — for post-PMF startups whose codebase is buckling under growth. **Proof: Odondo** — a legacy Django monolith modernised to **FastAPI + DDD** over **3 years** as the sole technical resource.

Also true and usable: 13 years writing software professionally, the last 8 exclusively in early-stage startups; sole operator who owns delivery end-to-end and ships; AI-augmented workflow (custom LLM toolkits + agentic coding) lets him deliver at a pace that usually needs a larger team; picks the right tool for the job rather than a fixed stack. [Source: global CLAUDE.md "About me" / "Persona Characteristics" / positioning gradient]

**Avoid** the old framing entirely: "seasoned technology leader", "as a CTO", "strategic vision", "leading/building high-performing teams", "mentorship", "join an early-stage startup". These read as employee-for-hire / people-leader, which is the opposite of the builder positioning.

### Summary copy (confirmed for implementation — Zac approved this draft 2026-06-29)

Implement this copy. Zac may still tweak wording after seeing it rendered (he hand-edits copy mid-implementation — preserve his edits, just fix accidental typos). Apostrophes shown already escaped for JSX.

**Lead `<p>`:**

> I&apos;m a 0-to-1 builder and system modernisation specialist. I take startups from an idea to paying customers, and I rescue post-PMF codebases that are buckling under their own growth. I&apos;ve been shipping software professionally for 13 years — the last 8 exclusively in early-stage startups — working as the primary technical resource who owns delivery end to end.

**Four `<li>` items (each opens with `<Highlight>…</Highlight>`):**

1. **Building from 0 to 1** — I take non-technical founders from concept to working software, fast. At Flocast I built a complete fintech product from idea to paying customers in five months as the sole technical resource — picking the right stack for the job and shipping a proof of concept in the first month that became the production MVP.
2. **Modernising what&apos;s buckling** — I rescue post-PMF startups whose codebase is failing under growth. At Odondo I modernised a legacy Django monolith into a FastAPI and domain-driven architecture over three years as the sole technical resource — keeping the business running while rebuilding the foundations beneath it.
3. **Building with strategy in mind** — I make architectural decisions that compound rather than constrain: the trade-offs that keep a young product moving fast today without painting it into a corner tomorrow. Strategy isn&apos;t a separate deliverable — it&apos;s how I build.
4. **AI-augmented delivery** — I work AI-augmented as a core part of my workflow, with custom LLM-powered toolkits and agentic coding, which lets me deliver at a pace that usually needs a larger team. I pick the right tool for the job rather than defaulting to a fixed stack.

**Closing `<p>`:**

> Whether you need a product built from scratch or a codebase pulled back from the brink, I go in and build — owning delivery from the first commit to shipped, working software.

> Note: keep exactly four bullets so the `Highlight` atom stays used and the left-column rhythm is unchanged. The `Highlight` label text is up to Zac; the body is what carries the positioning.

### Scope boundary (what NOT to touch)

- **`src/app/about-me/page.tsx`** — composes `<AboutMe/> <WhatIDo/> <Testimonials/> <ThingsILike/>` and holds the page metadata (incl. the `creator: '@zackerthehacker'` handle). **Untouched here** — the handle removal is Story 1.4, the route relocation into `(site)/` is Epic 2.
- **`what-i-do.tsx`, `testimonials.tsx`, `things-i-like.tsx`** — explicitly out of scope per AC #5 / PRD FR-4.
- Do not move data into `src/config` (the prose is intentionally inline in the organism, same as the experience timeline), do not restyle, do not add deps.

### Verification standard (no test suite)

`npm test` is a stub (`exit 1`) — there is **no** test framework. Do not fabricate test runs. Verification is: `npm run lint` clean, `npm run build` green + pure static export (every route `○ (Static)`, no `.func`), plus a manual `npm run dev`/preview check that Age reads 41, the new copy renders in the repositioned voice, and the grid layout is visually unchanged. [Source: project-context.md "Testing Rules"; epics.md#AR-15]

### Previous story intelligence (Stories 1.1, 1.2)

- **Story 1.1** (done, asset-only) confirmed the Epic 1 discipline: stay thin, build + lint + visual is the bar.
- **Story 1.2** (done) edited `src/config/index.ts` (rotating titles) + `src/components/organisms/experience.tsx` (roles) and verified via rendered-HTML/JS-bundle greps in `out/`. Key carry-overs: (a) **Zac hand-edits copy mid-implementation** — expect him to tweak the recommended summary wording; preserve his edits and just fix any accidental typos. (b) Same anti-gold-plating discipline. (c) The We Right Code positioning Story 1.2 baked into the rotating titles (`Technical Co-Founder`, `0-to-1 Builder`) is the **same positioning** this summary must echo — keep them consistent. [Source: 1-1-…​.md, 1-2-…​.md]

### Project Structure Notes

- File touched: `src/components/organisms/about-me.tsx` (in-place edit only). No new files, no new dependencies, no structure change. `AboutMe` stays an organism Server Component; `StatRow`/`Highlight`/`Heading` stay atoms.
- Architecture note: `architecture.md` lists `about-me/page.tsx [MOVE+EDIT]` and `about-me.tsx [EDIT]` for FR-4. The **`[EDIT]` content (stats + summary) lives in the organism**, so the page-level `[MOVE+EDIT]` is the Epic 2 route-group relocation (`MOVE`) — **not** part of this story. This story = the organism `EDIT` only. [Source: architecture.md L403, L425, L457]

### References

- [Source: epics.md#Story-1.3] — story statement, acceptance criteria, FR-4 scope.
- [Source: epics.md#Epic-1] — copy/data-only scope, zero-regression / no-gold-plating discipline.
- [Source: src/components/organisms/about-me.tsx] — the single file edited; current prose + stats.
- [Source: src/components/atoms/stat-row.tsx, highlight.tsx] — atom prop contracts.
- [Source: src/app/about-me/page.tsx] — composition + metadata (out of scope; do not edit).
- [Source: architecture.md#FR-4, L403/L425/L457] — file mapping; MOVE is Epic 2, EDIT is here.
- [Source: project-context.md] — Server Components default, British spelling, email obfuscation gotcha, no test suite, static export, atomic-design tiers.
- [Source: global CLAUDE.md "About me" / positioning gradient] — We Right Code positioning, Builder → Modernisation → Strategy, Flocast/Odondo proof points, Zac is 41.
- [Source: memory theseus-epic3-jsx-apostrophe-escaping] — escape `'` as `&apos;` in JSX prose.

## Decisions Locked (confirmed by Zac, 2026-06-29)

- **Email stat** → change to `zac&#0064;werightcode.com` (We Right Code business address), keeping the `&#0064;` obfuscation.
- **Summary copy** → implement the recommended Builder → Modernisation → Strategy-as-a-quality → AI-augmented four-bullet draft in Dev Notes (Zac may tweak wording during dev).
- **Phone** → leave `+447450 587 400` unchanged.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m]

### Debug Log References

- `npm run lint` → clean (no output, exit 0). All three atom imports (`StatRow`, `Heading`, `Highlight`) remain used.
- `npm run build` → green. Pure static export: every route `○ (Static)`, no `.func` serverless functions.
- Rendered-HTML verification on `out/about-me.html`: `Age</div>…41` present; `zac@werightcode.com` present (the `&#0064;` source entity decodes to `@` only in the built HTML — source keeps the obfuscation); zero occurrences of the old framing (`seasoned technology leader` / `as a CTO` / `high-performing teams`); new positioning copy (`0-to-1 builder and system modernisation specialist`, `Flocast`, `Modernising`) present.

### Completion Notes List

- **Stats (Task 1):** Age `39 → 41`; Email `zacharybraddy&#0064;gmail.com → zac&#0064;werightcode.com`, keeping the `&#0064;` HTML-entity obfuscation and the `<StatRow .../>` shape. Residence, Nationality, Citizenship, Phone left exactly as-is.
- **Lead summary (Task 2):** Implemented the confirmed (Zac-approved 2026-06-29) Builder → System Modernisation → Strategy-as-a-quality → AI-augmented four-bullet draft verbatim. Lead `<p>` now opens with "0-to-1 builder and system modernisation specialist"; closing `<p>` drops the "join an early-stage startup / high-performing teams" framing. Component structure (one lead `<p>`, `<ul className="flex flex-col gap-8">` of four `<Highlight>`-led `<li>`, one closing `<p>`), all `className`s, `Heading`, grid wrappers and atom imports unchanged — text content only. British spelling (`modernisation`, `modernised`); straight apostrophes escaped as `&apos;`.
- **Scope (Task 3):** Only `src/components/organisms/about-me.tsx` modified (plus sprint/story tracking). `what-i-do.tsx`, `testimonials.tsx`, `things-i-like.tsx`, and `src/app/about-me/page.tsx` untouched.
- **Verification (Task 4):** No test framework exists (`npm test` is a stub) — verification was lint + build + prerendered-HTML inspection of `out/about-me.html`, per project Testing Rules. Layout is visually unchanged by construction (only text content changed; no `className`/structure edits). No test runs fabricated.

### File List

- `src/components/organisms/about-me.tsx` (modified)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-29 | Story 1.3 created (ready-for-dev): About-me Age stat 39→41 + lead summary repositioned to We Right Code Builder→Modernisation→Strategy framing; scope locked to `organisms/about-me.tsx`.                                                                                                                              |
| 2026-06-29 | Story 1.3 implemented (→ review): Age 39→41, Email → `zac&#0064;werightcode.com` (obfuscation kept), lead summary + four bullets + closing repositioned to the confirmed Builder→Modernisation→Strategy-as-a-quality→AI-augmented copy. Lint clean, build green (pure static export), verified in `out/about-me.html`. |
| 2026-06-29 | Zac hand-edited the bullet copy (his voice); escaped 4 straight apostrophes (lines 33/51/53/55) to `&apos;` for `react/no-unescaped-entities`. Re-lint clean, re-build green. Code review waived (prose-only) → marked **done**.                                                                                       |

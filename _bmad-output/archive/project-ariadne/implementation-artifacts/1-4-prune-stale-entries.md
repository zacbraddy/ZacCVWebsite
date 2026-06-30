---
baseline_commit: 5a59d7a
---

# Story 1.4: Prune stale entries

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the maintainer,
I want aged-out entries removed from the site,
so that the site stays honest and current with no dead links or abandoned-account pointers (UJ-1, Canonical CV home).

## Acceptance Criteria

1. **Twitter social link removed (FR-5).** In `src/components/molecules/socials.tsx` the Twitter `<a>` block (the `href="https://twitter.com/ZackerTheHacker"` anchor wrapping `<FontAwesomeIcon icon={faTwitter} … />`) is removed, leaving the **LinkedIn + GitHub** anchors only. The now-unused `faTwitter` import is dropped from the `@fortawesome/free-brands-svg-icons` import (keep `faLinkedin`, `faGithub`). There is **no unused-import lint error**.

2. **Socials grid re-balanced for two items (FR-5, layout coherence — DECISION, see Dev Notes).** The wrapper `grid grid-cols-3 gap-4 mt-4` is changed to `grid grid-cols-2 gap-4 mt-4` so the two remaining icons span the row evenly instead of leaving an empty third column. This is the one judgment call in the story; Zac to confirm (default: change to `grid-cols-2`). No other class or structural change.

3. **"The Reactionary" content item removed (FR-5).** In `src/app/content/page.tsx` the **last** `<ContentItem … imageName="theReactionary">…</ContentItem>` block (the "Former community creator" / "The Reactionary" item) is removed in full. The other six `<ContentItem>`s are untouched, including the **"Blog posts" item whose link is `https://medium.com/@zackerthehacker`** — that Medium URL is a live content link, **not** the dead Twitter handle, and must be **kept** (see the trap in Dev Notes).

4. **Dead `theReactionary` thumbnail mapping cleaned up, no orphaned asset (FR-5).** In `src/components/atoms/content-thumbnail.tsx` the `theReactionary` key in `THUMBNAILS` (lines ~21–25, pointing at `/images/the-reactionary.jpg`) is removed. The now-orphaned asset `public/images/the-reactionary.jpg` (referenced nowhere else) is also deleted so nothing is left orphaned in the bundle. The other thumbnail mappings are unchanged.

5. **Dead `creator: '@zackerthehacker'` handle removed from every `twitter:` block (FR-5).** The codebase is **re-grepped for `@zackerthehacker` and `creator:`** (not trusting a fixed list). At time of writing the `creator: '@zackerthehacker',` line appears in the `twitter:` metadata block of **five** files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/about-me/page.tsx`, `src/app/resume/page.tsx`, `src/app/content/page.tsx`. The `creator:` line is removed from **each** `twitter:` block, while the **rest of every card is kept** (`card: 'summary_large_image'`, `title`, `images`, and — in `layout.tsx` only — `description`) so shared links still preview richly on X. No `openGraph` block is touched.

6. **Zero front-of-house regression + clean build (no test suite).** After all pruning, `npm run build` is a clean static export (every route `○ (Static)`, no `.func`) and `npm run lint` is clean — **no unused-import errors** (confirm `faTwitter` is gone, `faLinkedin`/`faGithub` stay used; `Image`/`Heading`/`Highlight`/`ContentItem` imports all still used). The Footer/socials, the Content page (now six items), and OG/Twitter previews render correctly in `npm run dev`/preview. Do **not** fabricate test runs — there is no test framework.

## Tasks / Subtasks

- [x] **Task 1 — Prune the Twitter social link (AC: #1, #2)**
  - [x] In `src/components/molecules/socials.tsx`, delete the Twitter `<a>` block (lines ~10–17: the `href="https://twitter.com/ZackerTheHacker"` anchor and its `faTwitter` icon).
  - [x] Remove `faTwitter,` from the `@fortawesome/free-brands-svg-icons` import; keep `faLinkedin` and `faGithub`.
  - [x] Change the wrapper `className` `grid grid-cols-3 gap-4 mt-4` → `grid grid-cols-2 gap-4 mt-4` (DECISION — Zac confirmed `grid-cols-2`).
- [x] **Task 2 — Remove "The Reactionary" content item (AC: #3)**
  - [x] In `src/app/content/page.tsx`, delete the final `<ContentItem … imageName="theReactionary">…</ContentItem>` block (lines ~108–122).
  - [x] Leave the other six `<ContentItem>`s exactly as-is. **Do NOT touch** the "Blog posts" item at line ~67 (`link="https://medium.com/@zackerthehacker"`) — it is a live link, not the dead handle.
- [x] **Task 3 — Clean up the dead thumbnail mapping + orphaned asset (AC: #4)**
  - [x] In `src/components/atoms/content-thumbnail.tsx`, remove the `theReactionary` key from `THUMBNAILS`.
  - [x] Delete `public/images/the-reactionary.jpg` (orphaned after the mapping is gone; referenced nowhere else — verify with a grep first).
- [x] **Task 4 — Strip the dead `creator:` handle from all twitter blocks (AC: #5)**
  - [x] Re-grep: `grep -rn "@zackerthehacker\|creator:" src/` to confirm the live set before editing.
  - [x] Remove the `creator: '@zackerthehacker',` line from the `twitter:` block in each of: `src/app/layout.tsx` (~L54), `src/app/page.tsx` (~L14), `src/app/about-me/page.tsx` (~L16), `src/app/resume/page.tsx` (~L16), `src/app/content/page.tsx` (~L15).
  - [x] Keep the rest of each `twitter:` card (`card`, `title`, `images`, `description` where present). Do not touch any `openGraph` block. Leave the Medium `@zackerthehacker` content link intact.
- [x] **Task 5 — Verify (AC: #6)**
  - [x] `npm run lint` — confirm clean (no unused `faTwitter`; `faLinkedin`/`faGithub` still used; no other unused imports introduced).
  - [x] `npm run build` — confirm green, pure static export (every route `○ (Static)`, no `.func`).
  - [x] Re-grep `@zackerthehacker` — confirm only the intended Medium content link remains (no `creator:` hits left).
  - [x] `npm run dev` (or deploy preview) — verified via the built static export (`out/`): socials render LinkedIn + GitHub only (no Twitter anchor), the Content page renders six items, no `the-reactionary` reference. No test suite exists; not fabricated.

## Dev Notes

### What this story is (and is not)

This is the final Epic 1 **prune/cleanup** story under the strict "zero change to structure, design, or flash; do not gold-plate" discipline. It is pure deletion of aged-out entries across a handful of files. No new files, no new dependencies, no copy rewrites, no restyling beyond the one grid-column adjustment that directly follows from removing a social icon. [Source: epics.md#Epic-1, epics.md#Story-1.4; PRD FR-5]

### Files touched (exhaustive)

| File                                         | Change                                                                 | Notes                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/components/molecules/socials.tsx`       | Remove Twitter `<a>` + `faTwitter` import; `grid-cols-3`→`grid-cols-2` | Currently a 3-col grid of Twitter/LinkedIn/GitHub anchors.                       |
| `src/app/content/page.tsx`                   | Remove the `theReactionary` `<ContentItem>`; remove `creator:` line    | Keep the Medium `@zackerthehacker` link (different item).                        |
| `src/components/atoms/content-thumbnail.tsx` | Remove `theReactionary` key from `THUMBNAILS`                          | Only consumer of `/images/the-reactionary.jpg`.                                  |
| `public/images/the-reactionary.jpg`          | Delete                                                                 | Orphaned once the mapping is gone (grep-confirmed: only ref is the mapping).     |
| `src/app/layout.tsx`                         | Remove `creator:` line from `twitter:` block                           | Keep `card`, `title`, `description`, `images`.                                   |
| `src/app/page.tsx`                           | Remove `creator:` line from `twitter:` block                           | Keep `card`, `title`, `images`.                                                  |
| `src/app/about-me/page.tsx`                  | Remove `creator:` line from `twitter:` block                           | Keep `card`, `title`, `images`. Story 1.3 deliberately left this handle for 1.4. |
| `src/app/resume/page.tsx`                    | Remove `creator:` line from `twitter:` block                           | Keep `card`, `title`, `images`.                                                  |

### ⚠️ The trap — `@zackerthehacker` is NOT all dead

A naïve "remove every `@zackerthehacker`" sweep will break a live link. The grep hits **six** lines across the codebase, but they are two different things:

- **Dead (remove):** the five `creator: '@zackerthehacker',` lines inside `twitter:` metadata blocks — these point at an abandoned X/Twitter account.
- **Live (KEEP):** `src/app/content/page.tsx:67` `link="https://medium.com/@zackerthehacker"` — this is the Medium blog URL on the "Blog posts" content item, an account that uses the same vanity handle. It is a real, working content link and is **out of scope** for removal. Leave it.

The AC is specifically "remove the `creator:` handle from every `twitter:` block, keep the rest of each card." Scope the removal to `twitter:` → `creator:` only. [Source: epics.md#Story-1.4 AC; FR-5]

### The grid-cols DECISION (the one judgment call)

`socials.tsx` wraps three anchors in `grid grid-cols-3 gap-4 mt-4`. Removing Twitter leaves two anchors in a three-column grid → they sit in the left two columns with a dead third column (visually off-centre / lopsided). Two options:

1. **Change `grid-cols-3` → `grid-cols-2` (recommended default).** The two icons span the row evenly; consistent with "keep it honest and current," not a redesign — it's the natural consequence of the deletion.
2. Leave `grid-cols-3`. Avoids any class change but leaves a visible empty column.

This is the only place the story deviates from pure deletion, so it is flagged. Implement option 1 unless Zac says otherwise. (Zac hand-edits copy/markup mid-implementation — preserve his choice if he changes it.) [Source: src/components/molecules/socials.tsx; epics.md#Epic-1 "no redesign" discipline]

### Orphaned-asset hygiene

FR-5 calls for "no orphaned asset references." The `theReactionary` mapping is the reference; the physical file `public/images/the-reactionary.jpg` (4.4 KB) becomes a true orphan once the mapping is removed (grep confirms `content-thumbnail.tsx:22` is its only referrer). Delete the file as well as the mapping so nothing dead ships in the static bundle — consistent with Story 1.1's "no stale file left orphaned" precedent. [Source: 1-1-…​.md; epics.md#Story-1.4 AC]

### Component contracts (read before editing)

- `socials.tsx` — a Server Component (no `'use client'`); a single `Socials` arrow component, default-exported. Three `<a>` anchors each wrapping a `<FontAwesomeIcon>`; the import pulls `faTwitter, faLinkedin, faGithub` from `@fortawesome/free-brands-svg-icons`. After the edit, the import must list only the two icons still rendered, or `@typescript-eslint/no-unused-vars` flags `faTwitter`. [Source: src/components/molecules/socials.tsx]
- `content/page.tsx` — a Server Component exporting `metadata` + `ContentPage`. Seven `<ContentItem>`s, each with `link`, `imageName`, optional `order`, a `title` node, and body text. Removing the last one leaves six; the `ContentItem`/`Heading`/`Highlight` imports all stay used. [Source: src/app/content/page.tsx]
- `content-thumbnail.tsx` — a Server Component; `THUMBNAILS: Record<string, {src,width,height}>` keyed by `imageName`, consumed by the `ContentThumbnail` atom via `THUMBNAILS[imageName]`. Removing the `theReactionary` key is safe because the only `imageName="theReactionary"` consumer (the content item) is removed in the same story. The `Image` import stays used by the other thumbnails. [Source: src/components/atoms/content-thumbnail.tsx]
- `twitter:`/`openGraph:` blocks — Next Metadata API objects. `twitter.creator` is an optional field; dropping it leaves a valid `Twitter` metadata object. Do not convert to a literal `@` or otherwise alter — just delete the line. [Source: project-context.md "SEO / Metadata"]

### FontAwesome / icon-tree note

`faConfig.autoAddCss = false` and the manual CSS import live in `layout.tsx`; nothing about removing one brand icon touches that wiring. `faTwitter`/`faLinkedin`/`faGithub` come from `@fortawesome/free-brands-svg-icons` (a tree-shaken named import) — dropping `faTwitter` simply removes it from the bundle. No FontAwesome config change needed. [Source: project-context.md "Icons"; src/components/molecules/socials.tsx]

### Project rules that apply here

- **No code comments** — delete cleanly; do not leave "removed Twitter" breadcrumbs. [global CLAUDE.md; project-context.md "No code comments by default"]
- **Don't build dynamic Tailwind class names** — `grid-cols-2` is a complete static string; fine. [project-context.md gotchas]
- **British spelling** — no user-facing copy changes here, so nothing to spell-check beyond not introducing American spellings. [project-context.md]
- **Email obfuscation gotcha** — not in scope here, but if you pass near the email entity, do not "clean it up." [project-context.md]
- **Static export only** — these are static pages; verification is build + lint + visual, no server features involved. [project-context.md]

### Verification standard (no test suite)

`npm test` is a stub (`exit 1`) — there is **no** test framework; do not fabricate test runs. Verification is: `npm run lint` clean (the unused-import check is the headline risk here), `npm run build` green + pure static export (every route `○ (Static)`, no `.func`), a re-grep of `@zackerthehacker` to prove only the Medium link survives, and a manual `npm run dev`/preview that socials read LinkedIn+GitHub and the Content page shows six items with no broken thumbnail. [Source: project-context.md "Testing Rules"; epics.md#AR-15]

### Previous story intelligence (Stories 1.1–1.3)

- **Story 1.1** (asset-only, done) set the Epic 1 bar: stay thin; build + lint + visual is the verification; do not leave orphaned assets in `public/` — directly relevant to deleting `the-reactionary.jpg`. The OG/Twitter `images: ['/images/zac-portrait.jpg']` references it touched are the **same metadata blocks** this story edits — only the `creator:` line changes now; leave `images`/`title`/`card` alone.
- **Story 1.2** (config + experience organism, done) verified deltas via rendered-HTML/JS-bundle greps in `out/` — a good pattern for confirming the `creator:` handle is gone from the built pages.
- **Story 1.3** (about-me, done) **deliberately deferred** the `creator:` handle removal in `about-me/page.tsx` to **this** story (it edited only the organism, not the page metadata). So `about-me/page.tsx` is expected to still contain the handle — this is the story that removes it. Carry-over: Zac hand-edits markup mid-implementation; preserve his edits, fix only accidental typos. [Source: 1-1-…​.md, 1-2-…​.md, 1-3-…​.md]

### Git intelligence

Recent commits follow `feat: Project Ariadne story 1-N created` then `… code complete` per story (e.g. `5a59d7a`, `8279c53`). Each story = a focused, single-purpose diff. Keep this diff scoped to the eight touch-points above; no drive-by edits. Baseline for this story is `5a59d7a` (Story 1.3 code complete). [Source: git log]

### Project Structure Notes

- All paths are **current** (pre-Epic-2 layout split). Epic 2 later relocates `page.tsx`/`about-me`/`resume`/`content` into `(site)/` verbatim — not this story's concern; edit them in place now. [Source: epics.md#Epic-1, AR-7]
- Atomic tiers unchanged: `socials.tsx` stays a molecule, `content-thumbnail.tsx` an atom, `content-item` an organism. No tier moves. [Source: project-context.md "Atomic Design structure"]

### References

- [Source: epics.md#Story-1.4] — story statement, acceptance criteria, FR-5 scope (re-grep instruction).
- [Source: epics.md#Epic-1] — copy/data/asset-only scope, zero-regression / no-gold-plating discipline.
- [Source: src/components/molecules/socials.tsx] — Twitter anchor + `faTwitter` import + `grid-cols-3`.
- [Source: src/app/content/page.tsx] — The Reactionary `<ContentItem>` (remove) + Medium `@zackerthehacker` link (keep) + `creator:` line.
- [Source: src/components/atoms/content-thumbnail.tsx] — `theReactionary` THUMBNAILS mapping.
- [Source: src/app/layout.tsx, page.tsx, about-me/page.tsx, resume/page.tsx] — the four other `twitter:`→`creator:` lines.
- [Source: project-context.md] — Server Components, no comments, Metadata API, Icons/FontAwesome, static export, no test suite, atomic tiers.
- [Source: global CLAUDE.md] — no code-removal comments, British spelling, minimum necessary complexity.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m]

### Debug Log References

- Re-grep before edit (`grep -rn "@zackerthehacker\|creator:" src/`): six hits — five dead `creator: '@zackerthehacker',` lines (layout, page, content, resume, about-me) + the live Medium link `content/page.tsx:67`. Matched story expectation exactly.
- Orphan check (`grep -rn "the-reactionary" src/ public/` after asset delete): no references remain.
- Post-edit re-greps: `creator:` → 0 hits; `@zackerthehacker` → 1 hit (the Medium content link only); `theReactionary`/`the-reactionary` → 0; `faTwitter`/`twitter.com` → 0.
- `npm run lint` → clean. `npm run build` → green; all 7 routes `○ (Static)`, no `.func`.
- Built-output verification (`out/`): `twitter:creator` meta → 0; reactionary YouTube channel → 0; Medium link → 1; Twitter anchor → 0; LinkedIn/GitHub anchors present.

### Completion Notes List

- Pure prune/cleanup story — no new files, deps, or copy rewrites. Eight touch-points only, scoped exactly to the story.
- The one judgment call (socials grid) confirmed by Zac: `grid-cols-3` → `grid-cols-2`.
- The `@zackerthehacker` trap avoided: only the five `twitter:` `creator:` lines removed; the live Medium content link (`https://medium.com/@zackerthehacker`) preserved.
- Orphaned asset `public/images/the-reactionary.jpg` deleted alongside its `THUMBNAILS` mapping — nothing dead ships in the bundle.
- No test framework exists (per project-context.md); verification is lint + static build + grep + built-HTML inspection. No test runs fabricated.

### File List

- `src/components/molecules/socials.tsx` (modified — removed Twitter anchor + `faTwitter` import; `grid-cols-3` → `grid-cols-2`)
- `src/app/content/page.tsx` (modified — removed "The Reactionary" `<ContentItem>`; removed `creator:` line)
- `src/components/atoms/content-thumbnail.tsx` (modified — removed `theReactionary` `THUMBNAILS` key)
- `public/images/the-reactionary.jpg` (deleted — orphaned asset)
- `src/app/layout.tsx` (modified — removed `creator:` line from `twitter:` block)
- `src/app/page.tsx` (modified — removed `creator:` line from `twitter:` block)
- `src/app/about-me/page.tsx` (modified — removed `creator:` line from `twitter:` block)
- `src/app/resume/page.tsx` (modified — removed `creator:` line from `twitter:` block)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-29 | Story 1.4 created (ready-for-dev): prune Twitter social link + `faTwitter`, "The Reactionary" content item + `theReactionary` thumbnail mapping + orphaned asset, and the dead `creator: '@zackerthehacker'` handle from all five `twitter:` blocks. Flagged the Medium-link trap and the `grid-cols-3`→`grid-cols-2` decision.         |
| 2026-06-29 | Story 1.4 code complete (review): all eight touch-points pruned. Socials grid set to `grid-cols-2` (Zac confirmed). Medium content link preserved; orphaned `the-reactionary.jpg` deleted. Lint clean, build green + pure static export, greps + built-HTML inspection confirm zero residual `creator:`/Twitter/reactionary references. |

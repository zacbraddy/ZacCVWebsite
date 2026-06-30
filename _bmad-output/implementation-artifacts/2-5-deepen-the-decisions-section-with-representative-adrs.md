# Story 2.5: Deepen the Decisions section with representative MADR-format ADRs

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the author,
I want a representative set of my strongest architectural decisions ported into the Backroom as polished, public-facing docs in MADR structure,
So that a technical evaluator sees how I actually run decisions — context, trade-offs, rejected alternatives and the trail — not a single prose retelling, and so the Decisions section earns its place beside the Pragmatism & process set (UJ-2, UJ-3).

## Story context

This is the **depth pass on the Decisions section** — distinct from Story 2.1's representative _first cut_ (which gave the Backroom breadth: Overview + two Pragmatism docs + one narrative Decisions doc). Today `docs/public/` holds exactly **four** docs and the **Decisions** section has exactly **one** entry (`framework-decision.md`) — prose _about_ a decision, not a MADR. Meanwhile 28 real internal MADRs sit in `docs/decisions/0001–0028`, and they are the differentiator the Backroom exists to convey.

This story is **almost entirely content** (markdown authored into `docs/public/`). It renders through the **already-complete** Story 2.3 Velite + Shiki pipeline and the Story 2.4 two-pane nav with **zero pipeline change** — the new docs slot into the DECISIONS group automatically on the next build (UJ-3). The **only** code/config change is folding in the one carried Shiki-fallback patch from the 2.3 review (now justified because real code blocks finally ship).

**Hard scope guard (SM-C1 — over-investment is the named failure mode):** port a **representative-and-strong cut of ~11 Decisions docs, NOT all 28.** Resist scope creep. The two-pane nav (2.4), Entry link (2.6) and console egg (2.7) are **out of scope**.

## Acceptance Criteria

**AC1 — Representative-and-strong cut derived into `docs/public/` (FR-6 depth pass).**
**Given** the internal MADR trail in `docs/decisions/0001–0028` as the **one-way** source (AR-4: `docs/decisions/` stays internal/unrendered — these are _derived_ into `docs/public/`, **not** rendered in place, never imported or symlinked)
**When** the representative cut is authored
**Then** `docs/public/` gains **10 new** polished, public-facing markdown docs (`section: Decisions`) — one per ported ADR — each derived from its source ADR with **British spelling** and **no internal audit noise** (no "Story 4.1 gate", no `[auditor]`/review tags, no BMad bookkeeping), free to deviate in depth from the source
**And** combined with the reconciled `framework-decision.md` (AC2) the Decisions section totals **11 docs**
**And** the cut leans on the headline modernisation calls per the in-story recommended list (Dev Notes → "The recommended cut"); the final list is confirmed in-story, and porting **all 28 is explicitly rejected**.

**AC2 — `framework-decision.md` reconciled (the existing Decisions doc).**
**Given** the existing `docs/public/framework-decision.md` carries `adr: 4`, but **ADR 0004 is "Full styled-components removal"** — the framework / Gatsby→Next / stack decision it actually describes is **ADR 0001**
**When** the doc is reconciled
**Then** its `adr:` value is **corrected to `1`** (the ADR it actually describes) so its `number-tile` reads `01` and it sorts first in DECISIONS
**And** it is **refactored into the MADR `h2` structure** (Context → Decision → Consequences → Rejected alternatives → Status / trail) to match the other ten docs — the existing prose already holds all the MADR ingredients (Gatsby ageing → Next 16/React 19.2/TS strict → Astro rejected → the Tailwind/styled-components/TS supporting calls), so this is a **structural reformat, not a rewrite**: the narrative warmth is preserved _inside_ Context/Decision, it is not left as a loose essay
**And** cross-links to the new deep docs for the supporting calls it mentions (styled-components, Tailwind v4, big-bang TS) are added as absolute `/backroom/<slug>` links.

> **Why MADR, not narrative:** the Decisions section exists to _demonstrate_ MADR rigour (context, trade-offs, rejected alternatives). `framework-decision` is `adr: 01` — it sorts **first** and is the **landing entry** a reader reaches via `start-here.md` (each start-here link drops the reader at the _first entry of its section_). If the headline Decisions doc is a loose essay while the rest are structured, the section's whole reason for existing is undercut at the highest-impact first click. Reformat it; keep the voice, add the bones.

**AC3 — Frontmatter contract honoured; every Decisions doc carries a real `adr` (AR-4, UX-DR15, 2.4 nav data model).**
**Given** the `docs/public/` frontmatter contract and the sectioned-nav data model
**When** each ported doc's frontmatter is authored
**Then** every file carries valid `title` (string), `section: Decisions`, `order` (number), `teaser` (string), and **`adr` (the real ADR number — required on every Decisions doc, no exceptions)**, with **no** `slug` field and **no** glyph field (slug = kebab-case filename; tile derived)
**And** each slots into the DECISIONS group with a cyan `number-tile` and sorts by `adr` ascending (filename as the stable secondary sort) with **no manual nav edit** (UJ-3)
**And** the `adr` values across the set are **unique** (no duplicate ADR numbers → no tile/sort collision).

> **Why `adr` is non-negotiable here** (carried from the 2.4 code review): `velite.config.ts` makes `adr` `optional()` independent of `section`. A `Decisions` doc that omits `adr` sorts to position 0 (via `adr ?? 0`) **and** renders a gold `◆` glyph-tile — visually identical to a Pragmatism row — instead of a cyan number-tile. Latent today (one Decisions doc, `adr: 4`); this story makes it live. The fix here is **by convention** (author `adr` on all 11), not a schema change — the schema/nav guard is logged separate deferred work, out of scope for this content story.

**AC4 — MADR shape rendered, with real syntax-highlighted code (UX-DR10/11/12/16/17, AR-13).**
**Given** the doc renderer + authoring conventions
**When** the MADR prose is written
**Then** each new doc renders the MADR shape as **`h2` sections** in the order **Context → Decision → Consequences → Rejected alternatives → Status / trail** (omit a section only if the source genuinely has nothing for it)
**And** docs whose decision genuinely involved config/code carry **real fenced code blocks** so Shiki highlighting shows actual content — closing the Story 2.3 review finding that no code shipped; **at least 6 of the new docs ship a fenced code block** (the code-bearing ADRs: 0009, 0010, 0014, 0018, 0025, 0027 — see Dev Notes), and the code-light philosophy ADRs (0002, 0004, 0005) carry a short authored illustrative fence where it aids the point
**And** pragmatism / judgement notes render as **gold blockquote call-outs** (plain markdown `> …`, no plugin), internal doc-to-doc links use **absolute `/backroom/<slug>` paths** (never `./file.md`) and point **only to docs that exist in the final set** (a missing target must not break the build — verify — but avoid authoring dead links)
**And** **Permanent Marker appears exactly once per doc** (the title, supplied by the `doc-content` header — do **not** add another `h1`/title in the body), and prose caps to the 64ch measure (handled by `doc-content.module.css` — author plain markdown, no width hacks).

**AC5 — The one carried Shiki-fallback fix (the ONLY code/config change in this story).**
**Given** real fenced code blocks now ship (including likely ` ```diff ` blocks in the before/after ADRs)
**When** `velite.config.ts` and/or `globals.css` are touched
**Then** the Shiki css-variables theme defines a fallback for **every token kind it can emit** — `--shiki-token-inserted` / `-deleted` / `-changed` and the `--shiki-ansi-*` set — so **no token in any ` ```diff `/ANSI/other fenced block falls back unstyled** (white-on-near-black default). Recommended: pass **`variableDefaults`** to `createCssVariablesTheme()` in `velite.config.ts` as the single robust catch-all, and/or define the three diff token vars explicitly in `globals.css @layer base` mapped to theme tokens (inserted → green, deleted → terracotta/red, changed → gold). See Dev Notes → "Shiki-fallback fix".
**And** the exact emitted variable names are **confirmed by inspecting `out/*.html`** after a build (grep `--shiki-`) — define against the real names Shiki emits, not assumed ones
**And** this is the **only** code/config change in the story (content-and-one-fix discipline) — **no** new dependencies, **no** pipeline/routing/nav/component change.

**AC6 — Verification (AR-15, no test suite).**
**Given** verification is build + lint + manual preview (there is **no** test framework — `npm test` is a stub; do **not** fabricate test runs)
**When** the build is run
**Then** `npm run build` is **green** with **every** new `/backroom/<slug>` statically exported (`○ (Static)`, **no `.func`**), the Velite **Zod schema validates all new docs** (deliberately break one frontmatter value once to confirm the build fails with a clear error, then fix it), **Shiki highlighting is present in the prerendered HTML** for docs containing code (grep `out/backroom/<slug>.html` / `out/backroom/<slug>/index.html` for inline `style="...var(--shiki-`), and `npm run lint` is **clean**
**And** the **theme toggle** is eyeballed on at least two new docs in both dark and light (`npm run dev`), and code blocks remain legible in both
**And** GA needs **no** new wiring (NFR-6 — same root layout already covers `/backroom/*`).

## Tasks / Subtasks

- [ ] **Task 1 — Confirm the cut and the framework-decision reconcile (AC1, AC2)**
  - [ ] Re-read the 11 source ADRs in the recommended cut (Dev Notes → "The recommended cut") to extract Context / Decision / Consequences / Rejected-alternatives for each. Do **not** trust the internal ADR's own framing of supporting decisions — derive each public doc from its own source ADR.
  - [ ] Apply the framework-decision reconcile (settled in-story): correct `adr` 4 → 1, **refactor to MADR `h2` structure**, add cross-links. Not optional — see Task 2 + AC2.
  - [ ] Lock the final slug list (filenames). Recommended slugs in Dev Notes; finalise and ensure each is unique and kebab-case.
- [ ] **Task 2 — Reconcile `docs/public/framework-decision.md` (AC2)**
  - [ ] Change frontmatter `adr: 4` → `adr: 1`. Leave `section: Decisions`, `order`, `teaser` as-is (teaser "Why Next.js, and why not Astro" stays).
  - [ ] **Refactor the body into the MADR `h2` shape** (Context → Decision → Consequences → Rejected alternatives → Status / trail), redistributing the existing prose under those headers — keep the narrative voice inside Context/Decision, don't leave it a loose essay and don't dilute it into a dry template. Same bones as the other ten docs.
  - [ ] Add absolute `/backroom/<slug>` cross-links from the body to `removing-styled-components`, `tailwind-v4-over-v3`, `big-bang-typescript` where it name-checks those supporting calls (add once the target docs exist — see Task 3 ordering).
- [ ] **Task 3 — Author the 10 new MADR docs into `docs/public/` (AC1, AC3, AC4)**
  - [ ] For **each** ADR in the cut, create one `docs/public/<slug>.md` with: valid frontmatter (`title`, `section: Decisions`, `order`, `teaser`, `adr` = real number); body in MADR `h2` shape (Context → Decision → Consequences → Rejected alternatives → Status/trail).
  - [ ] **Code-bearing docs (≥6):** 0009, 0010, 0014, 0018, 0025, 0027 already have real config/code in the source — carry a genuine fenced block (` ```css `, ` ```ts `, ` ```tsx `, ` ```diff `, etc.). Author before/after as ` ```diff ` where it reads naturally (0009 border guard, 0010 theming) so the Shiki-fallback fix (Task 4) is actually exercised.
  - [ ] **Code-light docs (0002, 0004, 0005, 0003):** prose decisions — add a **short** illustrative fence only where it sharpens the point (e.g. `tsconfig` `strict`/`allowJs:false` for 0005; the `@theme`/`@utility` shape for 0002; `output: 'export'` for 0003; before/after CSS-in-JS vs CSS-var for 0004). Keep it minimal — do not gold-plate.
  - [ ] Render pragmatism/judgement asides as **gold blockquote call-outs** (`> …`). One or two per doc, not every paragraph.
  - [ ] Internal links: **absolute `/backroom/<slug>`** only, pointing only to docs in the final set or the existing Overview/Pragmatism docs. Add a few high-value cross-links (e.g. theming `0010` ↔ border-guard `0009` ↔ tailwind `0002`; pipeline `0027` ↔ `start-here`/`building-with-ai-and-bmad`).
  - [ ] **British spelling throughout**; voice competent-and-candid, judgement-forward, never bragging (match the existing four docs' register — see Dev Notes → "Voice").
  - [ ] **Do NOT** add an in-body `h1`/title or a second Permanent-Marker line — the `doc-content` header already renders the title (Permanent Marker, once).
- [ ] **Task 4 — Fold in the carried Shiki-fallback fix (AC5) — the ONLY code change**
  - [ ] First build once so `.velite/` and `out/` exist, then grep `out/**/*.html` for `--shiki-` to capture the **exact** variable names Shiki emits for the code blocks now shipping (especially any ` ```diff `).
  - [ ] In `velite.config.ts`, add **`variableDefaults`** to `createCssVariablesTheme({ … })` covering `token-inserted`, `token-deleted`, `token-changed` and the `ansi-*` kinds (catch-all → a sensible foreground/theme colour), **and/or** add explicit `--shiki-token-inserted/-deleted/-changed` vars to `globals.css @layer base :root` (inserted → a green, deleted → terracotta/`text-tertiary`-adjacent red, changed → gold/`text-tertiary`). Pick the approach that leaves **nothing unstyled**; keep it theme-token-driven where practical (code plane is a constant near-black in both themes, so no `.light` override unless contrast demands — same call 2.3 made).
  - [ ] Re-build and re-grep to confirm the diff/ANSI tokens now resolve to a defined value (no bare `var(--shiki-…)` with no fallback and no matching declaration).
- [ ] **Task 5 — Verify (AC6)**
  - [ ] `npm run build` → green, pure static export; confirm **every** new `/backroom/<slug>` route is `○ (Static)` and there are **no** `.func` (grep the build output / `out/`).
  - [ ] Schema check: temporarily set a bad frontmatter value (e.g. `section: Decisons` typo or `adr: "four"`) on one new doc → confirm `npm run build` **fails** with a clear Velite/Zod error, then revert.
  - [ ] Highlighting check: grep at least two code-bearing rendered pages in `out/` for inline `style="...var(--shiki-` → confirm Shiki colour is baked into the prerendered HTML (zero client JS).
  - [ ] `npm run lint` → clean.
  - [ ] `npm run dev`, open two new docs, toggle dark/light → confirm theme tokens flip, code blocks legible in both, gold call-outs and cyan links render, nav shows the new cyan number-tiles in `adr` order with the active row `aria-current="page"`.
  - [ ] Do **not** fabricate any test run.

## Dev Notes

### What is already built — consume as-is, do NOT rebuild

The pipeline and nav are **done** (Stories 2.3 + 2.4). This story writes content into them and makes one fallback fix. **No** new components, routes, deps, or pipeline changes.

- **`velite.config.ts`** — collection `docs` over `public/**/*.md`; Zod schema `{ title, section enum, order, teaser, adr?, path, content }`; `.transform` derives `slug` from filename; Shiki via `@shikijs/rehype` + `createCssVariablesTheme({ variablePrefix: '--shiki-' })`. **The only file you edit here is to add `variableDefaults` (Task 4).** [Source: velite.config.ts]
- **`next.config.mjs`** (NOT `.ts` — Next 16 rejected top-level `await` in `next.config.ts` with `ERR_REQUIRE_ASYNC_MODULE`; architecture.md/ADR 0027's `next.config.ts` reference is superseded by the as-built `.mjs`) — awaits Velite `build()` before Next compiles, `VELITE_STARTED`-guarded, `watch` in dev / `clean` on build. **Do not touch.** [Source: next.config.mjs; 2-3 story Completion Notes]
- **`src/app/backroom/[slug]/page.tsx`** — `generateStaticParams` maps `docs.filter(section !== 'Overview')`; `dynamicParams = false`; renders `<DocContent doc={doc} />`. New Decisions docs are picked up automatically. **Do not touch.** [Source: src/app/backroom/[slug]/page.tsx]
- **`src/components/organisms/doc-content.tsx`** — renders the header (eyebrow = `doc.section`; **Permanent-Marker `h1` title** = `font-fancy-heading`, 38px, once; `ADR 0027`-style meta line when `adr` is set, zero-padded to 4) then injects `doc.content` HTML via `dangerouslySetInnerHTML`. So **the body must not repeat the title.** [Source: src/components/organisms/doc-content.tsx]
- **`src/components/organisms/doc-content.module.css`** — single scoped prose block (already caps **64ch**); styles `h2/h3/p/ul/ol/li/a/blockquote/pre/code/table`. Blockquote already renders as the **gold call-out** (left `--color-bg-tertiary` bar + `rgba(224,180,4,0.08)` wash + `0 8px 8px 0` radius). `pre` already sits on `--color-code-surface`. **Author plain markdown — it just works. Do not touch this file.** [Source: doc-content.module.css]
- **Nav (`backroom-nav` organism → `backroom-nav-row` molecule → `number-tile`/`glyph-tile`/`section-label` atoms)** — Server-rendered from the typed `docs` array; DECISIONS rows sort by **`adr` asc then `slug`**; `number-tile` shows the **zero-padded-to-2-digits** `adr` (`27`, `09`, `01`); empty sections omitted; active row `aria-current="page"`. A new `docs/public/*.md` slots in with **no manual nav edit**. **Do not touch.** [Source: 2-4 story; src/components/organisms/backroom-nav.tsx]

### The recommended cut (11 Decisions docs)

Confirmed by a full survey of all 28 ADRs. Keeps all 7 epics-named "prime Backroom material" candidates and rounds out with strong, code-bearing decisions. **✓code** = the source ADR already contains a literal fenced block or genuinely involves config/code to carry.

| `adr` | Source ADR                                                                 | Recommended slug                 | Teaser (≈)                                                           | Code                                                                   |
| ----- | -------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1     | 0001 (existing `framework-decision.md`, reconciled — **refactor to MADR**) | `framework-decision`             | Why Next.js, and why not Astro                                       | author a small `tsconfig`/pkg fence (e.g. `strict`/the stack versions) |
| 2     | 0002 Tailwind v4 over v3                                                   | `tailwind-v4-over-v3`            | Why start the rebuild on v4, not greenfield on v3                    | light — short `@theme`/`@utility` fence                                |
| 3     | 0003 Static-export deploy (Path A)                                         | `static-export-deploy`           | Zero-server static export over the Next runtime                      | ✓code (small `next.config` `output:'export'`)                          |
| 4     | 0004 Remove styled-components                                              | `removing-styled-components`     | Killing the CSS-in-JS runtime for CSS variables                      | light — before/after CSS-in-JS → CSS-var fence                         |
| 5     | 0005 Big-bang TypeScript                                                   | `big-bang-typescript`            | Full TS cut, not a mixed-mode seam                                   | light — `tsconfig` `strict`/`allowJs:false` fence                      |
| 9     | 0009 Tailwind v4 border guard                                              | `tailwind-border-guard`          | Restoring the v3 hairline after a silent v4 regression               | **✓code** (real CSS; natural ` ```diff `)                              |
| 10    | 0010 CSS-variable theming token system                                     | `css-variable-theming`           | Per-token `@utility`, and porting an invalid-colour quirk on purpose | **✓code** (real CSS)                                                   |
| 14    | 0014 Netlify image loader                                                  | `image-loader-no-backend`        | Serving images with no backend — a loader as URL-builder             | **✓code** (`image-loader.ts`)                                          |
| 18    | 0018 Mobile drawer on vaul                                                 | `mobile-drawer-vaul`             | Choosing vaul over a stale lib or hand-rolling a11y                  | **✓code** + honest parity-delta call-out                               |
| 25    | 0025 Route-transition FrozenRouter                                         | `route-transition-frozen-router` | Restoring out→in parity on a Next internal API                       | **✓code** (real tsx)                                                   |
| 27    | 0027 Velite + Shiki pipeline                                               | `markdown-pipeline-velite-shiki` | How this very Backroom renders — and why not react-markdown/MDX      | **✓code** (config + Zod + Shiki) — the meta/prime doc                  |

**`order`:** within DECISIONS the nav sorts by `adr`, so `order` does not drive Decisions ordering — but the schema **requires** it (`s.number()`, not optional). Set `order` = the `adr` number (or a simple ascending sequence) so it is present and sane. **Do not omit it** (Velite will fail the build).

**Code-block coverage is satisfied:** at least 6 docs (`adr` 9, 10, 14, 18, 25, 27) ship genuine fenced blocks, plus 3 (`adr` 3, and authored fences in 2, 4, 5). This decisively closes the 2.3 review finding ("no code block ships"). Author at least one ` ```diff ` block (border-guard 0009 or theming 0010 before/after are the natural homes) so AC5's diff-token fallback is actually exercised.

**Swap latitude (if Zac wants more pragmatism flavour over stack breadth):** 0026 (production cutover + rollback) or 0028 (guardrails-without-a-test-suite) are both HIGH-judgement and could replace a thinner named one (e.g. 0002 or 0005). 0022 (embla over flicking) / 0015 (server vs client animation) are next-strongest if a code-bearing slot opens. Surface as a flagged option; default to the table above.

### framework-decision.md reconcile — the flagged in-story decision (AC2)

- **The bug:** `framework-decision.md` says `adr: 4`, but its body describes the **stack/framework** decision = **ADR 0001**. ADR 0004 is _styled-components removal_. The number-tile therefore currently shows `04` for a doc that should be `01`. **Correct `adr` → 1.**
- **Settled (Zac, in-story):** **refactor it into the MADR `h2` shape** to match the other ten — this is **not** an optional/flagged choice. The Decisions section exists to demonstrate MADR rigour; `framework-decision` is `adr: 01`, sorts first, and is the **landing entry** of DECISIONS that `start-here.md` links to (each start-here link drops the reader at the _first entry of its section_). A loose essay at the headline slot undercuts the section's whole purpose at the highest-impact first click.
- It is a **structural reformat, not a rewrite**: the current prose already holds every MADR ingredient (Gatsby ageing → Next 16/React 19.2/TS strict → Astro rejected → Tailwind/styled-components/TS supporting calls). Add `## Context` / `## Decision` / `## Consequences` / `## Rejected alternatives` / `## Status` and redistribute the existing prose under them, **keeping the narrative voice inside Context/Decision** — don't flatten it into a dry template. Turn the name-checked supporting calls into `/backroom/<slug>` cross-links to the new deep docs.

### Shiki-fallback fix (AC5) — current state + the gap

`globals.css @layer base :root` currently defines **11** `--shiki-*` vars (foreground, background, token-comment/-keyword/-string/-string-expression/-constant/-function/-parameter/-punctuation/-link). [Source: globals.css:116–133]

**Missing** (so they render unstyled if emitted): `--shiki-token-inserted`, `--shiki-token-deleted`, `--shiki-token-changed`, and the `--shiki-ansi-*` set (black/red/green/yellow/blue/magenta/cyan/white + their bright/dim variants). These appear in ` ```diff ` and ANSI/console fences — which this story now ships.

- **Single robust fix:** add `variableDefaults` to `createCssVariablesTheme()` in `velite.config.ts`. `variableDefaults` bakes a CSS fallback into the emitted `var(--shiki-xxx, <default>)`, so even an undeclared var has a colour. Map `token-inserted` → green, `token-deleted` → terracotta/red, `token-changed` → gold, `ansi-*` → foreground (or per-colour).
- **Or / additionally:** declare `--shiki-token-inserted/-deleted/-changed` in `globals.css @layer base :root` mapped to theme-adjacent colours (keeps the diff colours theme-token-driven and consistent with the existing 11). The code plane is a **constant** near-black in both themes → keep light-on-dark, **no `.light` override** unless an eyeball says otherwise (the 2.3 call).
- **Verify against reality:** build first, `grep -rho '\-\-shiki-[a-z-]*' out/` to list the variable names Shiki _actually_ emitted for your blocks, and define against those exact names. [Source: 2-3 story Tasks 3 + carried patch lines 70; epics.md#Story-2.5 AC "carried Shiki-fallback patch"]

### Voice (match the existing four docs)

British spelling. Competent-and-candid, judgement-forward, **never** bragging or salesy. Show the trade-off and the rejected option honestly (e.g. 0018's modal-semantics parity delta, 0025's acknowledged Next-internal-API risk) — the candour _is_ the credibility. Strip every internal artefact: no "Story 4.1 gate", no review tags, no BMad/epic references, no "Decider: Zac" header lines. The reader is a technical evaluator weighing Zac up for work, not an auditor. See `docs/public/framework-decision.md`, `deferring-the-polish.md`, `building-with-ai-and-bmad.md`, `start-here.md` for the register. **No em-dashes in copy written in Zac's voice** — restructure the sentence (per owner preference; the existing docs use them, but going forward avoid in new prose where natural). [Source: existing docs/public/*; project memory zac-voice-no-em-dashes]

### MADR shape (per the internal ADRs — see 0025 as the model)

Internal ADRs follow MADR-lite: **Status / Date / Decider / Tags** header (DROP these from the public doc), then **Context → Decision → Consequences → Alternatives considered**. For the public docs use `h2` sections: **Context → Decision → Consequences → Rejected alternatives → Status / trail** (a short closing line: "Accepted; in force" or how it was verified). 0025 is a clean exemplar of the depth and honesty to aim for. [Source: docs/decisions/0025-*.md; docs/decisions/_template.md; epics.md#Story-2.5 AC]

### Critical project rules that bite here (project-context.md)

- **British spelling** in user-facing copy. **No code comments** by default — but this is markdown content, so prose is the point; the "no comments" rule applies to any `.ts`/`.css` you touch in Task 4.
- **Theme tokens only** in any CSS you add (the Shiki vars map to `--color-*` tokens or constant code-plane colours) — **no raw hex for themed UI**, no raw Tailwind palette. The code plane and diff colours may be constants since the code surface is constant across themes.
- **Static export only** — every new route must be `○ (Static)`, no `.func`. The pipeline already guarantees this; just verify.
- **Don't introduce new dependencies** — AC5 forbids it. Content + one fallback fix only.
- **`npm test` is a stub (`exit 1`)** — there is NO test suite. Verification = build + lint + manual preview. **Do not fabricate test runs.** [Source: _bmad-output/project-context.md]

### Project Structure Notes

- New files: `docs/public/<slug>.md` × 10 (flat, alongside the existing four). Slug = filename (kebab-case); no `slug` frontmatter field.
- Edited files: `docs/public/framework-decision.md` (frontmatter `adr` + cross-links); **one** of `velite.config.ts` / `src/app/globals.css` (Shiki fallback). **Nothing else.**
- No component, route, layout, or dependency changes. If you find yourself editing a `.tsx` component or `package.json`, you have left scope — stop and re-read the scope guard.
- `.velite/` is gitignored + ESLint-ignored (already configured) — it regenerates on build; do not commit it.

### References

- [Source: epics.md#Story-2.5] — the five ACs, the cut guidance, the in-story decisions, the Note (depth pass, not first cut; resist all 28).
- [Source: sprint-change-proposal-2026-06-29.md] — why this story exists (2.3 review: prose-heavy, Decisions underpowered, code never shipped); success criteria; "the single code/config change is the carried Shiki-fallback patch".
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — the adr-less-Decisions latent bug (AC3 rationale) and the 2.3 carried Shiki-fallback patch.
- [Source: _bmad-output/implementation-artifacts/2-3-render-public-docs-via-the-velite-shiki-pipeline.md] — pipeline as-built (`.mjs` not `.ts`, constant Shiki plane, the carried fallback patch at lines 70).
- [Source: _bmad-output/implementation-artifacts/2-4-build-the-two-pane-reading-room-and-sectioned-navigation.md] — nav data model: DECISIONS sort by `adr` then `slug`, number-tile zero-pad-2, empty-section omit, UJ-3 auto-slot.
- [Source: docs/decisions/0001–0028 + README.md] — the one-way source trail; ADR 0001 = stack (framework decision), 0004 = styled-components removal.
- [Source: velite.config.ts, next.config.mjs, src/app/backroom/[slug]/page.tsx, src/components/organisms/doc-content.tsx + .module.css, src/app/globals.css] — the consumed pipeline + renderer + tokens.
- [Source: _bmad-output/project-context.md] — stack, theming-token discipline, static-export constraint, no-test-suite verification, British spelling, dependency restraint.
- [Source: AR-4, AR-12, AR-13, AR-15, UX-DR10/11/12/15/16/17, FR-6/7/9, NFR-1/4/6/7, SM-C1] — frontmatter contract, rendered-HTML discipline, internal-link rule, verification, renderer/call-out/code/nav/type/voice specs, representative-not-comprehensive discipline.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

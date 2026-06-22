---
baseline_commit: f36c062
---

# Story 4.1: Full per-tier visual and behavioural parity sign-off

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the engineer migrating the site,
I want a complete tier-by-tier parity verification of the modern build against the live site before cutover,
so that I can prove zero visual and functional regression before the irreversible production switch.

## Context & purpose (read first)

This is the **first story of Epic 4** (Production Cutover & Decision Capture) and the **hard
gate** the entire migration has been building toward. Epics 1–3 are **code-complete**: the
themed, persistent, fully-navigable shell exists and **every route renders its real content**
(`/`, `/about-me`, `/resume`, `/content`, the 404). Story 4.1 does **not** add features — it
**verifies parity** and produces a **documented sign-off**. Story 4.2 (cutover) is **blocked**
until this story signs off green.

**This is fundamentally a human-in-the-loop, in-browser visual + behavioural comparison.**
Every Epic 1–3 story deliberately **deferred** its interactive visual check to "the Story 4.1
gate" because dev ran headless (no browser, no human eyes). **Story 4.1 is where that debt is
paid.** The dev agent **cannot** perform a side-by-side visual diff against a live site by
itself — its job here is to **(a)** run every programmatic check it can, **(b)** assemble the
**exhaustive, grounded checklist** Zac walks through, and **(c)** **honestly record Zac's
observations** as the sign-off. **Do NOT claim the visual diff was performed unless Zac
actually performed it with you** — fabricating a parity pass here would defeat the one gate
protecting an irreversible production switch (the honesty bar from 3.3/3.4/3.5, escalated).

**The single source of visual/behavioural truth is the live site `zackerthehacker.com`** (the
current **Gatsby** production build) — the existing site _is_ the UX spec (there is no UX
design doc, by design; epics.md §Overview). The thing being verified **against** it is the
**modern Next.js build**, checked **locally** (Zac's call, 2026-06-22 — the Netlify
preview/prod deploy correctness is **Story 4.2's** job, so local is the right target here; see
"Decisions confirmed with Zac"). **Local verification needs both run modes** because of the
image loader (`src/image-loader.ts`): a **production export** (`npm run build` → serve `out/`)
emits the `/.netlify/images?…` CDN URLs that **404 off-Netlify**, so images won't render
locally from `out/`; whereas **`next dev`** returns the **raw `src`**, so every image renders at
its real dimensions. **Therefore: use `out/` for the static-export structural truth (titles,
markup, no serverless) and `next dev` for the in-browser image-bearing visual pass** (crop, CLS,
layout — all className-driven, so faithful). The genuinely **CDN-served** image rendering
(optimised/responsive delivery via the Netlify Image CDN) is **not** locally observable and
rolls to the **Story 4.2** preview/prod deploy — consistent with "future stories are the Netlify
work". This is the one justified exception to "avoid `next dev`": it's the only way to see
images locally, and the layout/crop it shows is real.

**The 80% of the value in this story is the rolled-up `deferred-work.md` backlog.** Across
Epics 1–3, every parity quirk, conscious deviation, and deferred visual check was logged and
routed to "the Story 4.1 gate". This story **must not re-discover them blind** — it consumes
[`deferred-work.md`](deferred-work.md) and splits the gate backlog into **two lists the dev
agent must hand Zac** (see Dev Note "The two gate lists — the heart of this story"):

- **List A — Expected, Zac-approved deliberate deviations.** Documented, conscious steps off
  byte-for-byte parity (Theseus becomes the source of truth at cutover). These are **NOT
  parity failures** — confirm each is present and intended; do **not** "fix" them.
- **List B — Genuine open parity checks.** Real visual/behavioural items only ever verified
  _programmatically_ (or not at all) so far, needing a **dot-for-dot live-site eyeball**. If
  any is a real regression, the **gate BLOCKS** (AC #4) until fixed (or Zac grants a carve-out).

After this: with a green sign-off, **Story 4.2** performs the cutover (merge to `main`,
production = Next, retire Gatsby); **Story 4.3** collates the decision trail.

**4.1's job — prove parity and sign off (no feature work):**

- **Build the comparison harness** — a clean production export of the modern build
  (`npm run build` → green, **pure static export**) served and opened beside live
  `zackerthehacker.com`, in **both themes**, at **desktop + mobile + the `xs: 410px`
  breakpoint** (and the in-between responsive range).
- **Run every programmatic check** — build/lint/static-export green; the **border/ring/divide
  audit** (AC #2, grep + compare); the **FR-by-FR behavioural checklist** for everything
  code-verifiable.
- **Walk Zac through the tier-by-tier visual diff** — atoms → molecules → organisms → pages
  (AR7), recording observed parity per tier honestly.
- **Reconcile against `deferred-work.md`** — confirm every List-A expected deviation is
  present-and-intended; resolve every List-B open check to **pass** or **defect**.
- **Hard gate (AC #4)** — any genuine regression **blocks** cutover until resolved. Only a
  fully-green, Zac-confirmed result moves this story to done and unblocks Story 4.2.
- **Capture the sign-off** (FR26/AR19) — record the result, the confirmed deviations, and any
  defects-and-fixes. **No new ADR is expected** unless a defect fix forces a non-obvious call.

## Acceptance Criteria

1. **Per-tier side-by-side visual parity — no perceptible regression, both themes, full responsive range (NFR1, AR7, FR1–FR22).**
   **Given** the completed migration on the chosen comparison target (Netlify preview deploy
   _or_ local production export of the modern build), served alongside live `zackerthehacker.com`,
   **When** parity is verified **tier by tier** — **atoms → molecules → organisms → pages** —
   **Then** a side-by-side comparison shows **no _perceptible_ visual regression** in **both the
   dark and light themes**, on **desktop and mobile across the responsive range** including the
   custom **`xs: 410px`** breakpoint (NFR1, AR7) — where the bar is **"the modern build still
   looks good and nothing is visibly broken"**, **not** byte-for-byte pixel identity (Zac's call,
   2026-06-22): minor flicker-test differences you'd only catch toggling between old and new are
   **acceptable** and pass, provided the new build stands on its own; only a difference that makes
   the new build look **wrong, broken, or worse** is a defect,
   **And** every **List-A expected deviation** from `deferred-work.md` (see Dev Note "The two
   gate lists") is confirmed **present and intended** — counted as parity-passing, **not** a
   regression (these are Zac-approved conscious deviations: `xl:mr-0` nav shift / ADR 0016, the
   three `/content` carve-outs, the 404 `text-center`, the state-aware theme-toggle aria-label),
   **And** every **List-B open parity check** is resolved to a recorded **pass** or **defect**
   (the `border-inverse` light-theme border, the `/content` thumbnail crop incl. the portrait
   `course` image + mobile uneven heights, the mobile ✕-close placement, the route-change
   scroll-reset timing, the loading-spinner viewport coverage, the rotating-title blank-frame
   risk, the Roboto faux-bold, the theme-toggle icon-flash).

2. **Tailwind v4 border/ring/divide regression guard — confirmed, no silent `currentColor` shift (AR3, ADR 0009).**
   **Given** the v4 border default change (`border`/`ring`/`divide` default to `currentColor`
   in v4 vs `gray-200` in v3) and the explicit base-border guard from Story 1.3,
   **When** the audit checkpoint is exercised,
   **Then** **every** `border` / `ring` / `divide` usage across `src/` is confirmed to render
   the **same colour as the live site** (no silent `currentColor` shift) — the
   `@layer base` reset `border-color: var(--color-gray-200, currentColor)` in `globals.css` is
   present, and the themed `border-secondary` / `border-inverse` usages match,
   **And** the **known `border-inverse` light-theme discrepancy** (Story 2.3: Theseus light
   portrait/card border ≈ `#5a5a5a` vs archive ≈ `#333`, from the `#` added to the light token
   in Story 1.4) is **explicitly adjudicated against the live site** — the live site is the
   arbiter — and recorded as **pass (imperceptible)** or **defect (fix before cutover)**.

3. **Every FR behaviour verified identical to today — single accepted exception: theme persistence (FR10) (NFR2).**
   **Given** every functional behaviour in FR1–FR22,
   **When** each is exercised on the comparison target,
   **Then** it is verified **identical to the live site**, with the **single accepted exception
   of theme persistence (FR10)** — the one intended functional change in the whole project
   (selected theme now persists across reloads via `next-themes`; first-visit default stays
   dark, no `prefers-color-scheme` auto-adoption),
   **And** the FR-by-FR behavioural checklist (Dev Note "FR-by-FR behavioural checklist") is
   completed: nav/burger/sidebar, scrollbar + route-reset, spinner, entrance + route
   transitions, theme toggle + both palettes + body gradient, the four content pages + 404, the
   rotating job titles + mobile CTA, the testimonials carousel, the CV PDF download
   (`/pdfs/zac-braddy.pdf`), the social links (new-tab), analytics (`gtag G-F98QXJC4S0`), fonts,
   `next/image` (no CLS), and the email entity-obfuscation (`zacharybraddy&#0064;gmail.com`,
   FR22 — preserved encoded, NFR7).

4. **Hard gate — any parity defect blocks cutover until resolved (NFR1/NFR2).**
   **Given** a parity defect is found during AC #1–#3,
   **When** sign-off is attempted,
   **Then** **cutover is blocked** — the story does **not** reach done — until the defect is
   either **resolved** (fixed in code, re-verified green) **or** explicitly **reclassified by
   Zac** as an accepted deviation (a recorded carve-out, since Theseus becomes the source of
   truth at cutover),
   **And** only a **fully-green, Zac-confirmed** parity result signs the story off and unblocks
   **Story 4.2** (this is a hard gate, not advisory).

5. **Sign-off captured; scope held; no feature work; decision-capture as-you-go (FR26 / AR19 / NFR6).**
   **Given** the cross-cutting decision-capture DoD and the anti-gold-plating bar,
   **When** the verification completes,
   **Then** the **parity sign-off is recorded** in this story (Dev Agent Record + Change Log):
   the comparison target used, per-tier and per-FR results, every List-A deviation confirmed,
   every List-B check resolved, and any defect-and-fix,
   **And** **no feature work, redesign, refactor, or speculative improvement** was introduced
   (NFR6) — the **only** code changes permitted are **defect fixes** required to pass the gate
   (each one re-verified: `npm run build` green + pure static export, `npm run lint` clean),
   **And** **no new ADR is expected** — write one (next free number **0025**) **only if** a
   defect fix forces a genuinely non-obvious reconciliation; otherwise capture nothing new (do
   **not** manufacture an ADR to tick a box — NFR6; **0024 is the highest existing number**),
   **And** the deferred-work items that are confirmed Ariadne-scoped (a11y, content, editorial)
   are left **untouched** and remain routed to Project Ariadne (do **not** fix them here).

## Tasks / Subtasks

- [ ] **Task 1 — Build the comparison harness (LOCAL — both run modes)** (AC: #1, #3)
  - [ ] **Target is local** (Zac's call — Netlify deploy correctness is Story 4.2). Use **both**
        modes because of the image loader (`src/image-loader.ts`):
    - [ ] **`npm run build`** → **green**, **pure static export** (all routes `○ (Static)`, no
          `.func`/serverless). Serve `out/` (`npx serve out`) for the **structural** truth
          (titles, markup, shell) — but note **images 404 locally from `out/`** (the loader
          emits `/.netlify/images?…`, which has no server off-Netlify). Don't mistake that for a
          defect; CDN image serving is a Story 4.2 / preview-deploy check.
    - [ ] **`next dev`** for the **in-browser image-bearing visual pass** — here the loader
          returns the **raw `src`**, so all portraits/thumbnails render at real dimensions and the
          className-driven crop/CLS/layout (B1, B2, FR21) is faithfully observable. This is the
          one justified `next dev` use (it's the only way to see images locally).
  - [ ] Open the modern build **beside** live `zackerthehacker.com` (two windows / split
        screen), in **both themes**, at **desktop**, **mobile**, and the **`xs: 410px`**
        breakpoint (resize-sweep the in-between range). The live site is **Gatsby**; the
        comparison is modern-Next vs live-Gatsby.
  - [ ] Have `deferred-work.md` open — it is the gate backlog (Task 3 reconciles against it).

- [ ] **Task 2 — Programmatic checks (everything verifiable without eyes)** (AC: #2, #3, #5)
  - [ ] **Build/lint/export gate:** `npm run build` green + pure static export; `npm run lint`
        clean (TS strict, no `any`). Do **not** run `npm test` (stub `exit 1`, AR13).
  - [ ] **Border/ring/divide audit (AC #2, AR3):** grep every `border`/`ring`/`divide` usage in
        `src/components` + `src/app` and confirm each resolves to a **themed colour** (the
        `@layer base` reset `border-color: var(--color-gray-200, currentColor)` is present in
        `globals.css`; `border-secondary` → `--color-border-secondary`, `border-inverse` →
        `--color-border-inverse`). Flag any bare `border`/`ring`/`divide` that would fall to
        `currentColor` unintentionally. Cross-check against the archive's v3 colours. **Record
        the `border-inverse` light-theme discrepancy explicitly** for the visual adjudication in
        Task 4 (it is the one known border-colour parity risk — Story 2.3).
  - [ ] **FR-by-FR code-verifiable checklist (AC #3):** walk the FR list (Dev Note) and tick
        what is verifiable from the build/markup: CV PDF present at `public/pdfs/zac-braddy.pdf`
        and linked (`/pdfs/zac-braddy.pdf`, FR16); social links `target="_blank"` + correct URLs
        (FR18); analytics `gtag G-F98QXJC4S0` injected (FR19); per-page `<title>`/OG/favicon in
        each `out/*.html` (FR17); email obfuscation `zacharybraddy&#0064;gmail.com` intact in
        `out/about-me.html` (FR22); `next/image` outputs with intrinsic dimensions (FR21).
        The **interactive** FRs (transitions, carousel, scroll-reset, toggle) move to Task 4.

- [ ] **Task 3 — Reconcile the `deferred-work.md` gate backlog into the two lists** (AC: #1, #5)
  - [ ] Read **every** `deferred-work.md` entry routed to "the Story 4.1 gate" and sort each into
        **List A (expected deviation)** or **List B (open parity check)** — see Dev Note "The two
        gate lists" for the pre-sorted starting point; verify nothing in the file is missed.
  - [ ] **List A** items: during the visual diff (Task 4), confirm each is **present and
        intended**. Do **NOT** treat any as a regression and do **NOT** "fix" it (they are
        Zac-approved; Theseus is the source of truth at cutover).
  - [ ] **List B** items: each gets an explicit **pass/defect** verdict in Task 4 against the
        live site. A genuine regression → **defect → blocks the gate** (Task 5).
  - [ ] Confirm the **Ariadne-scoped** deferrals (multiple-`<h1>`, carousel a11y, testimonial
        grammar, certification acronyms, `prefers-reduced-motion`, etc.) are **out of scope
        here** — they are **not** parity-gate items (NFR6/NFR7); leave them for Ariadne.

- [ ] **Task 4 — Human-in-the-loop tier-by-tier visual + behavioural diff (with Zac)** (AC: #1, #2, #3)
  - [ ] **Most of this is already done** (Zac, 2026-06-22): pages have been visually verified
        as-they-went (3.2/3.3 confirmed locally, etc.), and the bar is "looks good standalone",
        not byte-parity. So this task is **mostly confirmation**, and the **List-B residue is
        expected to be short**. The job: run the checklist, surface the **small set** of items
        that genuinely need a fix, **batch them**, and hand Zac **one** combined pass to review
        (he does **not** want to be pinged item-by-item). Still **do NOT fabricate** the pass —
        record what was actually confirmed vs assumed-from-prior-stories.
  - [ ] Walk **atoms → molecules → organisms → pages** (AR7), each in **both themes**, **desktop +
        mobile + `xs:410px`**:
    - [ ] **Atoms:** heading, pill, nav-link, highlight, stat-row, portrait-image (incl.
          `border-inverse` border — List B), theme-toggle (icon-flash — List B; state-aware
          aria-label — List A), loading-spinner (viewport coverage — List B), timeline-divider,
          timeline-time-company, content-thumbnail (crop — List B), animate-on-change fades.
    - [ ] **Molecules:** nav-links (+`xl:mr-0` shift — List A), socials (new-tab), mobile-menu
          (✕ placement — List B; same-tab download edge case), rotating-job-title (blank-frame —
          List B), testimonial, skills-list, ability-description, thing-i-like, content-transition
          (scroll-reset timing — List B).
    - [ ] **Organisms:** about-me, what-i-do, testimonials (carousel parity — prev/next, author
          block placement), things-i-like, experience (timeline), certifications, content-item
          (alternating layout, thumbnail), timeline-item (divider dots + connector).
    - [ ] **Pages:** `/` (rotating titles + mobile CTA), `/about-me` (incl. carousel + email),
          `/resume` (timeline + divider + skills), `/content` (gallery + carve-outs — List A),
          404 (centred + `text-center` — List A). Each: title, layout, both themes, full
          responsive range.
  - [ ] **Behavioural pass (AC #3):** nav + burger open/close + navigate, sidebar at `lg`+,
        custom scrollbar + **route-change scroll-reset** (scroll down page A → navigate to B →
        confirm **no outgoing-page jump mid-fade** and incoming starts at top — the explicit
        2.5 trigger, List B), entrance + route transitions, theme toggle flips both palettes +
        body gradient, CV PDF downloads, rotating titles cycle (no blank flash — List B).
        **Theme persistence (FR10) is the single accepted change** — verify it persists across
        reload but do **not** count it as a regression.
  - [ ] **Record honestly, per tier and per FR:** pass / pass-with-expected-deviation / defect.
        If Zac does not perform a given check this session, **say so explicitly** — do not imply
        it passed.

- [ ] **Task 5 — Defect handling + hard gate (BATCH the fixes)** (AC: #4, #5)
  - [ ] **Collect all genuine defects into one batch** — Zac wants a single combined review, not
        per-item pings. For each **List-B / behavioural defect** that genuinely makes the new
        build look **wrong/broken/worse** (not a mere flicker-test delta — threshold per AC #1):
        **block the gate**. Either **fix in code** (minimal, parity-restoring change — re-verify
        `npm run build` green + pure static export + `npm run lint` clean) **or** get Zac's
        **explicit carve-out** reclassifying it as an accepted deviation (record it like the
        `xl:mr-0`/`text-center` deviations). Apply the batch, then hand Zac **one** consolidated
        visual review of all changes together. Re-run the affected checks after the batch.
  - [ ] **Do not** sign off until **all** List-B checks are pass-or-carve-out, **all** FRs are
        identical-or-FR10, and Zac confirms. A non-green result keeps the story **out of done**
        and **Story 4.2 blocked**.

- [ ] **Task 6 — Capture the sign-off + decision trail** (AC: #5)
  - [ ] Record the **parity sign-off** in the Dev Agent Record + Change Log: comparison target
        used, per-tier result, per-FR result, List-A deviations confirmed, List-B verdicts, any
        defect-and-fix, and the final green/blocked status.
  - [ ] **Expect no new ADR.** Write `docs/decisions/0025-<short-title>.md` (from `_template.md`;
        Status: Accepted; Decider: Zac) **only if** a defect fix forces a non-obvious
        reconciliation; add its row to `docs/decisions/README.md`. **0024 is the highest
        existing number; 0025 is next.** Do not manufacture one (NFR6).
  - [ ] If any List-B item is reclassified as an accepted deviation, **append it to
        `deferred-work.md`** (story-4.1) for the record, mirroring the existing deviation log.
  - [ ] Leave **all** Ariadne-scoped deferrals untouched and still routed to Ariadne.

## Dev Notes

### This is a verification gate, not a build story (read first)

Story 4.1 produces a **sign-off**, not a feature. The **only** code changes allowed are
**defect fixes** required to restore parity (AC #5/NFR6). Do **not** refactor, "tidy",
"improve", add a11y, or touch frozen content — every such temptation is logged in
`deferred-work.md` as **Ariadne's** scope, deliberately out of the parity box. If you find
yourself writing a component, stop: either it's a parity-restoring defect fix (allowed,
minimal) or it's out of scope.

### The honesty bar (escalated — this is the one gate before an irreversible switch)

Every Epic 1–3 story honestly recorded "in-browser visual diff **not** performed in this
headless run → Story 4.1 gate". **4.1 is the gate.** The dev agent runs headless and **cannot**
eyeball two sites side by side. Its deliverable is the **prepared checklist + honest capture of
Zac's observations** — not a self-asserted pass. **If Zac has not done the visual pass, the
story is not done.** A fabricated parity sign-off would wave an irreversible production cutover
through unverified — the exact failure this gate exists to prevent. Record precisely what was
and was not checked, by whom.

### The two gate lists — the heart of this story

`deferred-work.md` is the accumulated gate backlog. Pre-sorted (verify against the file — don't
trust this blindly; confirm nothing's missed):

**List A — Expected, Zac-approved deliberate deviations (NOT failures; confirm present + intended):**

| #   | Item                                                                                                                               | Source               | What to confirm                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------- |
| A1  | `xl:mr-0` nav margin fix → nav sits ~14px further right at `xl`+ than the (equally-bugged) live site                               | Story 2.2 / ADR 0016 | Present at `xl`+; intended, not a regression                     |
| A2  | `/content` carve-outs: Tabs&Spaces **Spotify link** added; **YouTube** casing (×3); heading **"Content I've Created"** (capital C) | Story 3.4            | All three present; expected differences vs live                  |
| A3  | 404 paragraph `text-center` (centres wrapped lines the live site leaves ragged-left)                                               | Story 3.5            | Present on `/404`; intended                                      |
| A4  | Theme-toggle **state-aware aria-label** ("Switch to light/dark mode") vs archive static "Dark mode switch"                         | Story 1.5            | Screen-reader-only; invisible to visual diff; intended           |
| A5  | **Theme persistence (FR10)** — the one accepted functional change                                                                  | FR10/NFR2            | Persists across reload; default still dark; **not** a regression |

**List B — Genuine open parity checks (need a dot-for-dot live eyeball; a real regression BLOCKS):**

| #   | Item                                                                                                                       | Source          | The specific check                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | `border-inverse` **light-theme** border: Theseus ≈ `#5a5a5a` vs archive ≈ `#333` (the `#` added to the light token in 1.4) | Story 2.3 / 1.4 | Portrait + `/content` card borders **in light theme** — perceptible? Live site is arbiter                                                                                           |
| B2  | `/content` **thumbnail crop** (GatsbyImage `CONSTRAINED` → `next/image`, ADR 0024)                                         | Story 3.4       | Desktop `md:w-48`×`md:h-36` cover-crop, esp. the **portrait `course` 360×450**; **mobile uneven heights** (square `tabsAndSpaces` vs portrait `course`); long-copy text-column clip |
| B3  | Mobile **✕-close button placement** (CSS-only port lost `react-burger-menu`'s lib-injected absolute corner position)       | Story 2.4       | Cross renders cornered (not inline at panel top) vs live                                                                                                                            |
| B4  | **Route-change scroll-reset timing** (imperative `[pathname]` reset may scroll the **outgoing** page mid-fade)             | Story 2.5       | Scroll down A → nav to B → **no outgoing jump**, incoming at top, **both themes**                                                                                                   |
| B5  | Loading-spinner **viewport coverage** (`absolute inset-0`)                                                                 | Story 2.6       | Hard-reload/throttle with real content → splash covers viewport, no gap                                                                                                             |
| B6  | Rotating-title **blank-frame** risk (advances on `transitionend`; a missed event can blank one ~4s cycle)                  | Story 3.1       | No blank/stuck title flash on `/` vs live                                                                                                                                           |
| B7  | **Roboto faux-bold** (single weight 400 → browser-synthesised bold for `<strong>`/`<b>`)                                   | Story 1.6       | Any bold text matches live (live also loads only 400 — likely already matches)                                                                                                      |
| B8  | Theme-toggle **icon-less flash** on load (sub-100ms hydration-guard blip)                                                  | Story 1.7       | Cosmetic; confirm acceptable (Zac already accepted)                                                                                                                                 |

**Immaterial / accepted deltas (record, don't act):** the 404 inherited `og:title`
(`Zac Braddy - CV website` vs archive's unsuffixed `404: Not found`) on a `noindex`/unshared
page — settled, do not "fix" (Story 3.5). The `404: Not found` / `404: Not Found` title-vs-heading
casing is **frozen content → Ariadne**, not a parity item.

### FR-by-FR behavioural checklist (AC #3)

Verify each **identical to the live site** (single exception: FR10). Code-verifiable ones can be
ticked in Task 2; interactive ones need Zac in Task 4.

- **FR1** persistent shell (content pane + entrance animation + desktop sidebar) — _interactive_
- **FR2** primary nav (Home/About/Resume/Content + Download CV; labels, icons, order, dests) — _interactive_
- **FR3** burger menu below `lg` (open → navigate → closes) — _interactive_
- **FR4** sidebar at `lg`+ (portrait, name, job title, socials, nav) — _interactive_
- **FR5** custom scrollbar + **route-change scroll-reset** (B4) — _interactive_
- **FR6** loading spinner until ready, then removed (B5) — _interactive_
- **FR7** entrance + route-change transitions — _interactive_
- **FR8** theme toggle (moon/sun, fixed top-left); both palettes + body gradient identical — _interactive_
- **FR9** `--color-*` token system; both palettes exact, incl. body `:before` gradient — _interactive + code_
- **FR10** theme **persistence** — **ACCEPTED CHANGE** (the one allowed difference); default dark, no `prefers-color-scheme` auto-adopt
- **FR11** Home: name + rotating job-title animation (B6) + mobile-only "Take a look around" CTA — _interactive_
- **FR12** About Me: About/What I Do/Testimonials(carousel)/Things I Like — _interactive_
- **FR13** Resume: experience timeline, certs, other skills — _interactive_
- **FR14** Content gallery: 7 items, thumbnail/copy/alternating layout/external link (B2 + A2) — _interactive_
- **FR15** 404 for unknown routes (A3) — _interactive_
- **FR16** CV PDF at `/pdfs/zac-braddy.pdf` via Download CV — _code + interactive_
- **FR17** per-page SEO: `%s - Zac Braddy` title template, description, OG, Twitter summary-large-image, wizard-hat favicon — _code_ (inspect `out/*.html`)
- **FR18** social links (Twitter/LinkedIn/GitHub) correct URLs, new tab — _code + interactive_
- **FR19** Google Analytics `gtag G-F98QXJC4S0` firing — _code_ (injected) **+ confirmed live in 4.2**
- **FR20** fonts: Permanent Marker (fancy headings) + Roboto (body) render identically (B7) — _interactive_
- **FR21** portrait + content images optimised/responsive, **no CLS** (AR17) — _interactive + code_
- **FR22** email entity-obfuscation `zacharybraddy&#0064;gmail.com` preserved encoded (NFR7) — _code_ (in `out/about-me.html`)

### Comparison target — LOCAL, both run modes (settled — Zac, 2026-06-22)

Verify **locally** (the Netlify preview/prod deploy is **Story 4.2's** scope — "future stories
are the Netlify work"). The wrinkle is the image loader (`src/image-loader.ts`), which branches
on `NODE_ENV`:

| Mode                           | Image loader behaviour                                                  | Use it for                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run build` → serve `out/` | emits `/.netlify/images?…` → **404 off-Netlify** (images blank locally) | static-export **structure**: titles, markup, shell, no-serverless, the FR17/FR22 `out/*.html` greps |
| `next dev`                     | returns **raw `src`** → images render at real dimensions                | the **in-browser visual pass**: layout, crop (B1/B2), CLS, responsive, both themes                  |

So this is the one place `next dev` is **correct** to use — it's the only way to see images
locally, and the crop/layout it shows is className-driven and faithful. Do the **structural**
confirmation against `out/`, the **visual** pass against `next dev`. The genuinely **CDN-served**
image rendering (optimised/responsive delivery) is **not** locally observable and is a **Story
4.2 / preview-deploy** check — do not block 4.1 on it, and don't mistake locally-blank `out/`
images for a defect.

### Tier-by-tier method (AR7) and the responsive range

Port-order was atoms → molecules → organisms → pages; verify in the **same order** so a
low-tier discrepancy is caught before it compounds upward. For **each** tier, check **both
themes** and **three viewport bands**: desktop (`lg`+), the `xs: 410px` custom breakpoint, and
mobile (< `xs`), plus a resize-sweep through the in-between range to catch breakpoint-transition
glitches (the nav `lg` collapse, the sidebar `lg` appearance, the content `md` column collapse,
the `sm`/`xs` type-size jumps). The custom `xs: 410px` is defined in `globals.css`
(`--breakpoint-xs: 410px`) — it is an explicit AC #1 / NFR1 checkpoint, easy to forget.

### Scope: defect fixes only — everything else is Ariadne or out (NFR6)

The deferred-work backlog contains many **Ariadne-scoped** items that are **NOT** parity-gate
items and must be **left untouched**: multiple-`<h1>` document outline (3.2/3.3/3.4/404),
carousel-control a11y (3.2), testimonial grammar "he's be an asset" (3.2), certification
acronyms `MSCD`/`MCSP` + `(Python-react)` casing (3.3), inert Tailwind classes `flex-flow-col`
etc. (3.3 — **do NOT "fix" `flex-flow-col`→`flex-col`**, the live layout is the `row` fallback),
`prefers-reduced-motion` on the spinner (2.6), the analytics consent/env-gate (1.6), the
`AnimateOnChange` rapid-nav handshake hardening (2.1). These are **content/a11y/polish**, not
zero-regression parity — they belong to Project Ariadne ([[theseus-content-frozen-ariadne-owns-refresh]]).
Touching them here is gold-plating (NFR6) and re-opens frozen content. The **only** code this
story may change is a parity-restoring defect fix.

### Decision capture (FR26 / AR19) — expect no new ADR

This is a verification story executing the accepted decisions, not making new ones. The sign-off
record itself is the captured artefact. Write **ADR 0025 only if** a defect fix forces a
non-obvious reconciliation (NFR6 — do not manufacture one). Reclassified deviations get logged
in `deferred-work.md` (story-4.1), mirroring the `xl:mr-0` / `text-center` precedent.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **No source changes expected** beyond possible defect fixes. Any fix follows Theseus
  conventions: TS strict (no `any`, no `.js` source — AR2); Prettier `^3.x` law (single quotes,
  `arrowParens: avoid`); kebab-case files / PascalCase components; **themed colours only** (no
  raw hex — the `--color-*` tokens); **no interpolated Tailwind class names** (static literals
  only — PurgeCSS/Tailwind-v4 scan safety); no code comments by default; British spelling in
  user-facing copy. (project-context's PropTypes/Gatsby/styled-components rules describe the
  **archive** stack — follow the Theseus artifacts where they diverge, as 1.7–3.5 established.)
- **Atomic design** tiers are the verification structure (atoms/molecules/organisms/pages), not
  just an organisation rule here.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it or invent a
suite. Verification = `npm run build` green + pure static export, `npm run lint` clean, the
**border/ring/divide audit**, the **code-verifiable FR checks** against `out/*.html`, and the
**human-driven in-browser visual + behavioural diff** against `zackerthehacker.com`. Record
honestly what was and was not observed, and by whom.

### Project Structure Notes

- This story touches **no `src/` files** in the happy path — its outputs are the **sign-off
  record** (this file) and (only if defects surface) minimal parity-fix edits + possibly ADR
  0025 + `deferred-work.md` (story-4.1) entries.
- It is the **hard gate** before Story 4.2 (cutover) — done **only** on a green, Zac-confirmed
  result.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] — the four ACs: per-tier
  side-by-side visual diff (both themes, desktop+mobile, incl. `xs:410px`) with no perceptible
  regression (NFR1, AR7); the border/ring/divide guard audit checkpoint (AR3); every FR
  behaviour identical except theme persistence (FR10) (NFR2); hard gate blocking Story 4.2.
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4] — verify parity tier-by-tier, then
  the irreversible switch; this story is the parity sign-off, 4.2 is cutover, 4.3 collates the trail.
- [Source: _bmad-output/planning-artifacts/epics.md#FR1–FR22, #NFR1, #NFR2, #NFR6, #NFR7, #AR3, #AR6, #AR7, #AR13, #AR17, #AR19]
  — the parity requirements, the single accepted FR10 exception, anti-gold-plating, preserve-quirks,
  the border guard, preview-deploy-then-cutover, tier-by-tier diffing, no-fabricated-suite, CLS guard,
  decision capture.
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — **the gate backlog.** Every
  "→ Story 4.1 gate" item; the source for List A (expected deviations) and List B (open parity
  checks) in Dev Note "The two gate lists", plus the Ariadne-scoped items to leave untouched.
- [Source: src/app/globals.css] — the `@layer base` border guard
  (`border-color: var(--color-gray-200, currentColor)`, ADR 0009); the `--color-border-secondary`
  / `--color-border-inverse` tokens (dark vs `.light`, incl. the `border-inverse` light `#5a5a5a`
  that drives B1); the `--breakpoint-xs: 410px` custom breakpoint (AC #1 checkpoint); the body
  `:before` gradient (FR9, AR16).
- [Source: src/components/{atoms,molecules,organisms}/ + src/app/**/page.tsx + not-found.tsx] —
  the component tiers and routes to diff (atoms 19, molecules 11, organisms 8, pages
  `/`,`/about-me`,`/resume`,`/content`,404).
- [Source: src/components/molecules/nav-links.tsx] — the Download CV link `/pdfs/zac-braddy.pdf`
  (FR16); the social links (FR18); the `xl:mr-0` nav margin (A1).
- [Source: src/components/organisms/about-me.tsx] — the email obfuscation
  `zacharybraddy&#0064;gmail.com` (FR22, NFR7).
- [Source: public/pdfs/zac-braddy.pdf] — the CV PDF (FR16).
- [Source: netlify.toml + next.config.ts] — `next build` → `out` static export, `HUSKY=0`; the
  Netlify Image CDN loader (relevant to B2 thumbnail verification and the local-vs-preview target choice).
- [Source: docs/decisions/0009-tailwind-v4-border-ring-divide-guard.md] — the border guard the
  AC #2 audit confirms.
- [Source: docs/decisions/0016-shared-nav-active-link-port-and-sidebar-mount.md] — the `xl:mr-0`
  deviation (A1). [0021] — the metadata convention (per-page titles, FR17). [0023] — spacing
  parity. [0024] — the GatsbyImage→`next/image` thumbnail reconciliation (B2).
- [Source: docs/decisions/_template.md + README.md] — ADR format + index, **only** if a 0025
  defect-reconciliation ADR becomes necessary; **0024 is the highest existing number, 0025 is next.**
- [Source: _bmad-output/implementation-artifacts/3-5-404-page.md] — the immediately-prior story;
  the established verification-honesty bar, the "execute accepted decisions, no new ADR unless
  forced" capture pattern, and the deviation-logging precedent (`text-center`).
- [Source: _bmad-output/project-context.md] — atomic structure, Prettier law, themed-colour rule,
  Tailwind-v4 scan safety, no-comments default; describes the **archive** stack — follow the
  Theseus artifacts where they diverge.
- [Source: zackerthehacker.com] — the **live Gatsby site**, the authoritative visual/behavioural
  reference for every comparison in this story.

## Decision trail

1. **Story 4.1 is a verification gate, not a build (settled — Epic 4 design).** It produces a
   documented sign-off; the only permitted code changes are parity-restoring defect fixes (NFR6).
2. **Comparison = modern Next build vs live Gatsby `zackerthehacker.com`, verified LOCALLY
   (settled — Zac 2026-06-22).** The live site is the UX spec (no UX doc, by design). Local, both
   modes: `out/` for static-export structure, `next dev` for the image-bearing visual pass (the
   loader returns raw `src` in dev; `out/` images 404 off-Netlify). CDN-served image rendering →
   Story 4.2. Netlify preview/prod correctness is 4.2's scope.
3. **The `deferred-work.md` gate backlog drives the story (settled).** Split into List A
   (expected, Zac-approved deviations — confirm, don't fix) and List B (open parity checks —
   pass/defect). Ariadne-scoped a11y/content items are out of scope (NFR6/NFR7).
4. **Theme persistence (FR10) is the single accepted functional difference (settled — NFR2).**
   Everything else must be identical to today.
5. **Hard gate, "imperceptible = pass" threshold (settled — AC #4 / Zac 2026-06-22).** Any
   regression that makes the new build look **wrong/broken/worse** blocks Story 4.2 until fixed
   or Zac-reclassified; mere flicker-test deltas pass. Fixes are **batched** for one combined Zac
   review. Only a green, Zac-confirmed result signs off.
6. **No new ADR expected (settled — NFR6).** ADR 0025 only if a defect fix forces a non-obvious
   reconciliation; 0024 is the highest existing number.
7. **The visual/behavioural diff is human-driven and honestly recorded (settled — honesty bar).**
   The dev agent prepares the checklist and captures Zac's observations; it does not self-assert
   a visual pass it cannot perform.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Decisions confirmed with Zac (2026-06-22 — all settled, do NOT re-raise)

1. **Comparison target → LOCAL (Zac confirmed).** Verify locally, not against a Netlify
   preview — the Netlify deploy correctness is **Story 4.2's** scope ("future stories are the
   Netlify work"). Use **both** local modes per the loader split (Dev Note "Comparison target"):
   `out/` for static-export structure, `next dev` for the image-bearing visual pass. **CDN-served
   image rendering is explicitly deferred to 4.2** — do not block 4.1 on it.

2. **Mostly already verified as-you-go; BATCH the residue (Zac confirmed).** Pages have been
   visually checked along the way, so the List-B set needing action is **expected to be short**.
   Do **not** ping Zac item-by-item — **collect all genuine fixes into one batch** and hand him
   a **single** combined review. He'll check them all at once.

3. **Threshold → "imperceptible = pass", NOT byte-for-byte (Zac confirmed).** Not chasing
   perfection. Most pages have small differences you'd only notice flicking between old and new —
   **that's fine** as long as the new build **still looks good standalone**. Only a difference
   that makes the new build look **wrong/broken/worse** is a defect. Don't gild the lily on
   byte-for-byte parity. (Applies directly to borderline List-B items like **B1**
   `border-inverse` ≈`#5a5a5a` vs ≈`#333` and **B7** Roboto faux-bold — accept + log unless they
   actually look bad.)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-22 | Story 4.1 created (ready-for-dev): the full per-tier visual + behavioural parity sign-off — Epic 4's hard gate before cutover. Verification-only (no feature work; defect fixes only). Rolls up the entire `deferred-work.md` "→ Story 4.1 gate" backlog into List A (5 expected Zac-approved deviations — confirm, don't fix) and List B (8 open parity checks — pass/defect). ACs: per-tier visual diff both themes/desktop+mobile/`xs:410px` (NFR1, AR7); border/ring/divide guard audit (AR3); FR-by-FR behavioural checklist with theme-persistence (FR10) the single accepted exception (NFR2); hard gate blocking Story 4.2; sign-off captured (FR26). Honesty bar escalated — the human-driven visual pass must not be fabricated.                                                        |
| 2026-06-22 | Three decisions confirmed with Zac and folded in (now settled, not open): (1) **comparison target = LOCAL** — Netlify deploy correctness is Story 4.2; local uses both modes (`out/` for static-export structure, `next dev` for the image-bearing visual pass, since the loader 404s `out/` images off-Netlify but returns raw `src` in dev; CDN image rendering deferred to 4.2). (2) **Mostly already verified as-you-go → batch the residue** — List-B action set expected short; collect all fixes into one combined review, no item-by-item pings. (3) **Threshold = "imperceptible = pass", not byte-for-byte** — minor flicker-test deltas are fine if the new build looks good standalone; only wrong/broken/worse is a defect (applies to borderline B1 border-inverse + B7 faux-bold). |

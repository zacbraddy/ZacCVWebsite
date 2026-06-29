---
baseline_commit: ec9998b
---

# Story 2.2: Split the layout into two rooms

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the maintainer,
I want the layout split into a global root shell, a front-of-house room, and a Backroom room,
so that the Backroom can have its own chrome without the front-of-house sidebar leaking into it — while the front-of-house renders byte-identically (zero regression).

## Acceptance Criteria

1. **Root layout reduced to global chrome only (AR-7 / D4).** `src/app/layout.tsx` keeps **only** the globals: `<html>`/`<body>` (with the existing font `variable` classes + `suppressHydrationWarning`), the `faConfig.autoAddCss = false` + FontAwesome CSS import, `import './globals.css'`, `<LoadingSpinner />`, `<Providers>` (theme), `<ThemeToggle />`, `<GoogleAnalytics gaId="G-F98QXJC4S0" />`, and the `export const metadata` block (with the `'%s - Zac Braddy'` template). `MenuProvider` **stays in the root** wrapping `{children}` so the shared vaul drawer keeps working across both rooms (AR-7). The root layout does **not** render the FoH sidebar/hero/nav/`ContentTransition`/`MobileMenu` any more. (The console egg added in Story 2.6 will live here too, but this story does **not** require it to exist.)

2. **FoH shell moved verbatim into `src/app/(site)/layout.tsx` (AR-7 / G1).** A new `(site)/layout.tsx` holds the front-of-house shell **relocated verbatim** from the current root layout body: `<MobileMenu />` plus the `<main className="p-2 h-screen">…</main>` block — the centred container, the `hero` sidebar (`PortraitImage`, name/`config.JOB_TITLE`/`Socials`, `<nav>` + `NavLinks`), and `<ContentTransition>{children}</ContentTransition>`. The markup, class strings, and imports are **byte-identical** to the current shell (no reflow, no "tidy-ups", no class reordering). `(site)/layout.tsx` is a **Server Component** (no `'use client'`), matching the current root layout.

3. **FoH pages move into `(site)/`, URLs unchanged (AR-7).** `src/app/page.tsx`, `src/app/about-me/page.tsx`, `src/app/resume/page.tsx`, and `src/app/content/page.tsx` move into `src/app/(site)/` (→ `(site)/page.tsx`, `(site)/about-me/page.tsx`, `(site)/resume/page.tsx`, `(site)/content/page.tsx`). Their **file contents are unchanged** (this story is the move only; FR-2/FR-4/FR-5 edits already landed in Epic 1). Because route groups are URL-invisible, the served URLs stay exactly `/`, `/about-me`, `/resume`, `/content`. The home page keeps its `title: { absolute: 'Home - Zac Braddy' }` (correct: `absolute` bypasses the now-applicable root template — see Dev Notes); the child pages keep their single-segment `title` relying on the root template.

4. **A minimal Backroom room exists at `/backroom`, isolated from the FoH shell.** A new Backroom layout and a placeholder `/backroom` page are created such that `/backroom` resolves as a **static route** that renders the global chrome (theme toggle, GA, spinner) **but not** the FoH sidebar/hero/nav. The placeholder page renders at least a heading and the Backroom layout includes a **`back to the site`** affordance (a plain `<Link href="/">` is sufficient for this story; the styled `back-link` atom is Story 2.3/2.4). The exact folder path resolves the AR-14 open question — **recommended: a plain `src/app/backroom/` folder** (`backroom/layout.tsx` + `backroom/page.tsx`), matching the architecture directory tree (lines 406–412); see Dev Notes "Route-group path resolution".

5. **GA covers the new `/backroom` route automatically (NFR-6).** Because `<GoogleAnalytics>` lives in the (now global-only) root layout, the new `/backroom` route inherits it with **no new wiring**. Verify a page-view fires for `/backroom` during the story (GA real-time on a deploy preview, or confirm the gtag `config`/`page_view` call carries the `/backroom` path in the network tab).

6. **G1 zero-regression gate (NFR-2).** After the move: `npm run build` is a clean static export (every route `○ (Static)`, no `.func`, incl. `/`, `/about-me`, `/resume`, `/content`, `/backroom`), `npm run lint` is clean, and the **front-of-house shows zero visual or functional regression** — sidebar, portrait, hero, name/title/socials, nav links, the route-transition fade/scroll-reset animation, and the mobile vaul drawer all behave exactly as the live site. Verify by side-by-side comparison (before/after) on `npm run dev` and/or a deploy preview, including the responsive collapse to the mobile drawer.

7. **Scope discipline — this story is structural only.** No new dependencies, no Velite/Shiki, no `globals.css` token edits, no new atoms/molecules/organisms beyond what AC#4 needs, no console egg, no Entry link, no two-pane reading-room styling. Those are Stories 2.3–2.6. The diff is: root `layout.tsx` reduced, `(site)/layout.tsx` created, four pages moved, and a minimal Backroom room created (plus the `not-found.tsx` decision in Dev Notes).

## Tasks / Subtasks

- [x] **Task 1 — Reduce the root layout to global chrome only (AC: #1)**
  - [x] In `src/app/layout.tsx`, keep the imports/uses for: fonts (`Permanent_Marker`, `Roboto` + the `variable` classes on `<html>`), `GoogleAnalytics`, `faConfig`, the FontAwesome CSS, `./globals.css`, `Providers`, `LoadingSpinner`, `ThemeToggle`, `MenuProvider`, and the `metadata` export.
  - [x] Replace the `<MenuProvider>…</MenuProvider>` body so it wraps **`{children}`** directly: `<Providers><ThemeToggle /><MenuProvider>{children}</MenuProvider></Providers>` (LoadingSpinner before Providers, GoogleAnalytics after — keep the existing ordering).
  - [x] **Remove from root** the imports now only used by the shell: `ContentTransition`, `NavLinks`, `MobileMenu`, `PortraitImage`, `Socials`, `config`, and `styles` (`@/components/layout.module.css`). (They move to `(site)/layout.tsx`.) Confirm no unused-import lint error remains.
- [x] **Task 2 — Create `src/app/(site)/layout.tsx` with the verbatim FoH shell (AC: #2)**
  - [x] Create the `src/app/(site)/` directory and `(site)/layout.tsx` as a Server Component: `export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>)`.
  - [x] Return a fragment containing `<MobileMenu />` then the `<main className="p-2 h-screen">…</main>` block **copied verbatim** from the current root layout (lines 76–104), with `<ContentTransition>{children}</ContentTransition>` in place. Do not alter any class string or markup. (Verified: all 9 shell `className` strings byte-identical to the original; only indentation differs.)
  - [x] Add the imports the shell needs: `ContentTransition`, `NavLinks`, `MobileMenu`, `PortraitImage`, `Socials`, `config`, and `styles from '@/components/layout.module.css'`. Do **not** export `metadata` from `(site)/layout.tsx` (metadata stays in root — see Dev Notes "Metadata behaviour").
- [x] **Task 3 — Move the four FoH pages into `(site)/` (AC: #3)**
  - [x] `git mv src/app/page.tsx src/app/(site)/page.tsx`; same for `about-me/page.tsx`, `resume/page.tsx`, `content/page.tsx` (preserve the directory names → `(site)/about-me/page.tsx` etc). Use `git mv` so history follows.
  - [x] Do **not** edit page contents. Confirm the `@/...` path-alias imports inside each page still resolve (they are unaffected by the file's new location).
  - [x] Confirm `src/app/page.tsx` no longer exists at root (so `/` is served solely by `(site)/page.tsx` — no duplicate-route error).
- [x] **Task 4 — Create the minimal Backroom room (AC: #4)**
  - [x] Create `src/app/backroom/layout.tsx` (Server Component) rendering its `{children}` inside a minimal container, with a `back to the site` affordance — a plain `<Link href="/">◀ back to the site</Link>` is sufficient here (the styled `back-link` atom + two-pane shell are Stories 2.3/2.4). No FoH sidebar.
  - [x] Create `src/app/backroom/page.tsx` (Server Component) as a placeholder Overview — a heading (e.g. "The Backroom") and a line of placeholder copy. No Velite, no `docs/public` consumption (Story 2.3).
  - [x] Confirm `/backroom` renders the global chrome (theme toggle works, no FoH sidebar) and is statically exported. (Verified: `out/backroom.html` is `○ (Static)`, zero FoH nav links, no rendered portrait `<img>`, GA script present.)
- [x] **Task 5 — Resolve the root `not-found.tsx` shell-inheritance behaviour (AC: #6; see Dev Notes)**
  - [x] **Zac's decision (overrides the story's recommended option (a)):** give each room its own section-scoped 404. Implemented a shared `not-found-content.tsx` organism rendered by three boundaries — root `not-found.tsx` (the single static `404.html` for genuinely-unmatched URLs → global chrome), `(site)/not-found.tsx` (renders in the FoH shell on any FoH `notFound()`), and `backroom/not-found.tsx` (renders in the Backroom shell on a Backroom `notFound()` — the missing-doc case in Stories 2.3/2.4). No route group needed for the Backroom; a plain `backroom/` folder owns its own not-found boundary. **Residual flagged for Zac:** a cold-loaded bogus URL always resolves to the single global-chrome `404.html` (no JS runs to pick a room) — see Completion Notes.
  - [x] Whichever is chosen, confirm a bad URL still returns the themed 404 and the build stays clean. (Verified: single `/_not-found` route, `out/404.html` themed + global chrome, build green.)
- [x] **Task 6 — Verify the G1 zero-regression gate (AC: #5, #6)**
  - [x] `npm run lint` → clean (no unused-import errors from the root-layout reduction).
  - [x] `npm run build` → green, pure static export; confirm `/`, `/about-me`, `/resume`, `/content`, **`/backroom`** all show `○ (Static)` and there is no `.func` in `out/`. (Verified: 8 routes all `○ (Static)`, no `.func`.)
  - [ ] Manual FoH parity check (`npm run dev` and/or deploy preview): sidebar/portrait/hero/nav, the content fade + scroll-reset transition between pages, and the mobile drawer (resize below `lg`, open/close) all behave exactly as before. Compare side-by-side with the live site. **(For Zac — runtime/visual; cannot be confirmed headlessly. Static structure verified: shell byte-identical, `ContentTransition`/`FrozenRouter`/`CustomScroll` relocated verbatim, `MenuProvider` stays in root so `MobileMenu` + `TakeALookAroundButton` keep menu context.)**
  - [ ] Verify GA fires a page-view for `/backroom` (NFR-6) — GA real-time on a deploy preview, or the gtag call in the network tab. Do **not** fabricate this check. **(For Zac — needs a live preview. Static confirmation: the `G-F98QXJC4S0` gtag script is present in `out/backroom.html`, inherited from the now global-only root layout, so no new wiring was needed.)**

### Review Findings

_Code review 2026-06-29 (Blind Hunter + Edge Case Hunter + Acceptance Auditor). 1 decision-needed (resolved), 0 patch, 2 deferred, 5 dismissed as noise._

- [x] [Review][Decision] `backroom/not-found.tsx` cannot fire on the static host — **RESOLVED: keep, by Zac's call.** With `output: 'export'`, Next emits a single `out/404.html` from the **root** `not-found.tsx`; nested not-found boundaries only fire on an in-app `notFound()`, and the project has zero dynamic segments and zero `notFound()` callers. Netlify serves `404.html` for every unmatched path, so a cold-loaded `/backroom/garbage` renders the FoH-shelled global 404, never `BackroomLayout`'s 404. Even after Stories 2.3/2.4, statically-generated doc routes only link to real docs, so a bad doc URL is also a cold load → root 404. **Decision (Zac): keep the boundary deliberately as a forward-looking resilience guardrail — in a codebase with no test suite, a per-room not-found that predates the failure path it catches is a feature, not dead code. Captured in [ADR 0028](../../docs/decisions/0028-section-scoped-not-found-boundaries-as-guardrails.md).** [src/app/backroom/not-found.tsx]

- [x] [Review][Defer] `NotFoundContent` vertical centering breaks inside `BackroomLayout` [src/components/organisms/not-found-content.tsx] — deferred, pre-existing (backroom-404 styling is a later story). `NotFoundContent`'s root uses `h-full ... justify-center`, which only resolves inside `SiteShell`'s unbroken `h-full` chain. `BackroomLayout` has no height ancestor (`min-h-screen` → `max-w-screen-md` → `pt-8`), so the 404 would collapse to content height and hug the top. Only matters if/when the backroom 404 actually renders (see decision item above).
- [x] [Review][Defer] Duplicated 404 metadata across two files [src/app/not-found.tsx + src/app/backroom/not-found.tsx] — deferred, pre-existing (contingent on the backroom-404 decision). Identical `title: { absolute: '404: Not found - Zac Braddy' }` is hand-copied into both not-found files (the body was extracted to `NotFoundContent`, the metadata was not). Two sources of truth that can drift; evaporates if the backroom not-found is removed.

## Dev Notes

### What this story is (and is not)

This is the **foundational layout split** for the Backroom (AR-7 / D4) — the structural move that lets the Backroom have its own chrome while the front-of-house relocates **verbatim** so it renders byte-identically. It is the project's **highest-attention zero-regression gate (G1)**. It is a pure **relocation + isolation** story: reduce the root layout to global chrome, lift the FoH shell into a `(site)` route group, move the four FoH pages into it, and stand up a minimal isolated `/backroom` room. It does **not** build the Velite/Shiki pipeline, the two-pane reading room, the sectioned nav, the styled atoms, the Entry link, or the console egg — those are Stories 2.3–2.6. The discipline is the same "stay thin" guardrail as the rest of Ariadne. [Source: epics.md#Story-2.2, #AR-7, #Epic-2; architecture.md#D4, #G1; project-context.md]

### Files touched (exhaustive)

| File                               | Change             | Notes                                                                                     |
| ---------------------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`               | **EDIT**           | Reduce to global chrome only; `MenuProvider` wraps `{children}`; drop shell-only imports. |
| `src/app/(site)/layout.tsx`        | **NEW**            | FoH shell moved verbatim (Server Component); shell imports.                               |
| `src/app/(site)/page.tsx`          | **MOVE**           | from `src/app/page.tsx` (contents unchanged).                                             |
| `src/app/(site)/about-me/page.tsx` | **MOVE**           | from `src/app/about-me/page.tsx`.                                                         |
| `src/app/(site)/resume/page.tsx`   | **MOVE**           | from `src/app/resume/page.tsx`.                                                           |
| `src/app/(site)/content/page.tsx`  | **MOVE**           | from `src/app/content/page.tsx`.                                                          |
| `src/app/backroom/layout.tsx`      | **NEW**            | minimal Backroom room + `back to the site` link.                                          |
| `src/app/backroom/page.tsx`        | **NEW**            | placeholder Overview.                                                                     |
| `src/app/(site)/not-found.tsx`     | **NEW (optional)** | only if option (b) chosen for the 404 (see below).                                        |

**Unchanged at root** (stay put): `globals.css` (edited in Story 2.3, not here), `providers.tsx`, `icon.svg`, and `not-found.tsx` (unless option (b)). No component files under `src/components/` are edited — the shell components move only by being imported from a different layout file; their `@/...` import paths are unaffected. [Source: architecture.md#Project-Structure tree (lines 389–432)]

### The current root layout — what it does today (READ THIS before editing)

`src/app/layout.tsx` currently does **two jobs** that this story separates:

- **Global chrome (stays in root):** `<html lang="en" className="${roboto.variable} ${permanentMarker.variable}" suppressHydrationWarning>`, `<body>`, `faConfig.autoAddCss = false`, the FontAwesome CSS + `globals.css` imports, `<LoadingSpinner />`, `<Providers>` (next-themes), `<ThemeToggle />`, `<GoogleAnalytics gaId="G-F98QXJC4S0" />`, and the `metadata` export (title template `'%s - Zac Braddy'`, OG/Twitter defaults).
- **FoH shell (moves to `(site)`):** `<MobileMenu />` and the `<main className="p-2 h-screen">` block — the animated centred container (`styles.animatedContainer`/`styles.container`), the `hero` sidebar (`PortraitImage`, name + `config.JOB_TITLE` + `Socials`, the `<nav>` with `NavLinks`), and the content pane wrapping `<ContentTransition>{children}</ContentTransition>`.
- **`MenuProvider` (stays global, AR-7):** currently wraps `MobileMenu` + `main`. It must **stay in the root** wrapping `{children}`, because the shared vaul drawer state must be available to both rooms. Critically, `take-a-look-around-button.tsx` (rendered on the home page) and `mobile-menu.tsx` both call `useMenuOpen()` — so the provider must remain an ancestor of the `(site)` pages. With `MenuProvider` wrapping `{children}` in root and the `(site)` layout/pages rendered as those children, context still flows correctly. `ThemeToggle` does **not** use menu context, so its position (inside `Providers`, outside `MenuProvider`) is preserved. [Source: src/app/layout.tsx; src/context/menu-open-context.tsx; src/components/atoms/take-a-look-around-button.tsx; src/components/molecules/mobile-menu.tsx]

**What must be preserved:** the LoadingSpinner-before-Providers and GoogleAnalytics-after-Providers ordering; the font `variable` classes and `suppressHydrationWarning` on `<html>` (next-themes hydration safety — see project-context gotchas); the `disableTransitionOnChange` theme provider config (in `providers.tsx`, untouched); and the exact shell markup/classes (G1).

### Target structure (after this story)

```
src/app/
├── layout.tsx            global chrome only; MenuProvider wraps {children}
├── providers.tsx         unchanged
├── globals.css           unchanged (Story 2.3 edits it)
├── not-found.tsx         root 404 (see decision below)
├── icon.svg              unchanged
├── (site)/               [NEW group, URL-invisible]
│   ├── layout.tsx        FoH shell, verbatim
│   ├── page.tsx          / (home)
│   ├── about-me/page.tsx /about-me
│   ├── resume/page.tsx   /resume
│   └── content/page.tsx  /content
└── backroom/             [NEW]
    ├── layout.tsx        minimal room + back-to-site
    └── page.tsx          /backroom placeholder Overview
```

Recommended root layout body after reduction:

```tsx
<body>
  <LoadingSpinner />
  <Providers>
    <ThemeToggle />
    <MenuProvider>{children}</MenuProvider>
  </Providers>
  <GoogleAnalytics gaId="G-F98QXJC4S0" />
</body>
```

### Route-group path resolution (resolves the AR-14 open question)

AR-14 explicitly defers this: the loose prose (AR-14 / D4) says "`(backroom)`" while the **architecture directory tree (lines 406–412) shows a plain `src/app/backroom/` folder**. They are URL-equivalent. **Recommendation: use the plain `src/app/backroom/` folder.** Rationale:

- The `(site)` group is **necessary**: its pages (`/about-me`, `/resume`, `/content`, `/`) must keep their URLs with **no** `/site/` prefix, so the group's URL-invisibility is doing real work.
- The Backroom's URLs are **already** `/backroom/*` by virtue of the folder name, so a route group buys **nothing** — a `(backroom)/backroom/` nesting would add a redundant invisible layer for no URL benefit (it violates minimum-necessary-complexity).
- With the root layout now global-only, a plain `backroom/` folder already gets exactly the desired isolation: **root global chrome + its own `backroom/layout.tsx`**, no FoH sidebar.
- This matches the explicit architecture tree. The AC#4 wording ("`(backroom)` route group") is the loose phrasing AR-14 flagged for resolution; the plain folder satisfies the same intent (isolated room, `/backroom` URL) more simply.

If Zac prefers the symmetry of `(site)` + `(backroom)` groups, the alternative is `src/app/(backroom)/backroom/layout.tsx` + `(backroom)/backroom/page.tsx` (same URLs). Flag the choice; default to the plain folder. [Source: architecture.md#AR-14, #D4, #Project-Structure tree (lines 406–412); epics.md#Story-2.2 AC2; memory "don't-assert-secondhand-decisions-as-closed"]

### Metadata behaviour after the move (subtle — verify, don't regress)

In the App Router, a title `template` applies to **descendant** segments, not the segment where it is defined. Today `src/app/page.tsx` is in the **same** segment as the root layout, so the template does **not** apply to it — which is exactly why home uses `title: { absolute: 'Home - Zac Braddy' }`. After the move, `(site)/page.tsx` becomes a **descendant** segment (the route group is still a segment for metadata purposes), so the root template **would** now apply — **but `absolute` always bypasses the template**, so the home `<title>` stays exactly `Home - Zac Braddy`. **No change needed, and do not "simplify" the home title to a plain string** (that would start getting templated → `Home - Zac Braddy - Zac Braddy`). The child pages (`about-me`/`resume`/`content`) already rely on the template and continue to work. **Do not export `metadata` (especially not a `template`) from `(site)/layout.tsx`** — keep the single template in the root layout to avoid double-application. [Source: src/app/page.tsx; src/app/layout.tsx; project-context.md#SEO/Metadata; ADR 0021]

### The `not-found.tsx` consideration (flag for Zac)

Today `src/app/not-found.tsx` renders **inside the root layout**, so a 404 currently shows **with the full FoH shell** (sidebar/portrait/nav). Once the root layout is global-only, the root not-found renders in **global chrome only** → a themed, centred 404 **without** the sidebar. This is a (small) visual change to a non-primary page, and the architecture lists `not-found.tsx` as "unchanged (root-level)" — which appears to have overlooked this shell-inheritance effect.

Two options:

- **(a) Accept the bare themed 404 (recommended).** Minimum complexity, arch-aligned (not-found stays root-level), still fully themed and on-brand. A genuinely-unmatched URL (e.g. `/nonsense`) renders the **root** not-found regardless, so this is also the most predictable behaviour. The only delta is "no sidebar on the 404".
- **(b) Preserve the shell on the 404.** Add `src/app/(site)/not-found.tsx` (verbatim copy of the current one). Caveat: in the App Router an unmatched top-level URL renders the **root** not-found, not a group's, and these pages never call `notFound()` — so `(site)/not-found.tsx` would rarely (if ever) be the one shown. This adds a file for little practical gain and does **not** fully restore "bad URL → 404 with shell".

Because (b) cannot cleanly restore the old behaviour for the common case (bad URL) without duplicating the shell into the global-only root (which defeats the split), **recommend (a)** and surface it to Zac as the one conscious visual delta of the split. [Source: src/app/not-found.tsx; architecture.md#Project-Structure tree (line ~394); epics.md#Story-2.2 AC3 (NFR-2)]

### Transitions / Backroom (not in scope this story, but be aware — AR-8 / G4)

The FoH route-transition (`ContentTransition` → `AnimateOnChange` + `FrozenRouter` + `CustomScroll` scroll-reset) relocates **verbatim into `(site)/layout.tsx`** and must keep working for FoH (part of the G1 gate). The minimal Backroom room created here simply **omits** `ContentTransition` (path of least resistance → likely no inter-doc transition). Do **not** add a transition to the Backroom in this story; the conditional G4 review happens in Story 2.4 when the real two-pane layout lands. Front↔back navigation (`/` ↔ `/backroom`) is a plain navigation either way. [Source: architecture.md#D4 transitions, #G4; epics.md#AR-8; src/components/molecules/content-transition.tsx; src/components/atoms/frozen-router.tsx]

### Verification standard (no test suite)

`npm test` is a stub (`exit 1`) — there is **no** test framework; do not fabricate test runs (AR-15). Verification is:

1. `npm run lint` clean (watch for unused-import errors after the root-layout reduction).
2. `npm run build` green + **pure static export** — every route `○ (Static)` incl. `/`, `/about-me`, `/resume`, `/content`, **`/backroom`**; no `.func` in `out/`.
3. **G1 manual FoH parity** (`npm run dev` / deploy preview, side-by-side with live): sidebar, portrait, name/title/socials, nav links, the content fade + scroll-reset transition, and the mobile vaul drawer (resize below `lg`, open/close) — all identical to before.
4. **GA page-view for `/backroom`** (NFR-6): GA real-time on a deploy preview, or the gtag call carrying `/backroom` in the network tab.

[Source: project-context.md#Testing-Rules; epics.md#AR-15, #Epic-2; architecture.md#Development/Build/Deploy]

### Previous story intelligence (Epic 1 + Story 2.1)

- **Story 2.1** (done) authored the four `docs/public/*.md` files; it touched **no** `src/` and **no** layout. This story is the **first `src/` / structural** Epic 2 story. The `docs/public/` content is not consumed until Story 2.3 (Velite), so it is irrelevant to the build here.
- **Epic 1** (Stories 1.1–1.4, all done) already applied FR-2/FR-3/FR-4/FR-5 edits to the pages that this story now **moves**. So when you `git mv` `about-me/page.tsx`, `resume/page.tsx`, and `content/page.tsx`, you are moving the **already-edited** versions — **do not** re-apply or revert any Epic 1 content edit; this story is the move only. [Source: 2-1 story; epics.md#Epic-1; git log]
- **Discipline carry-over:** every Epic 1 story emphasised "stay thin, don't gold-plate" and "keep the diff scoped." Same here — the diff is the split and nothing else. [Source: 1-2/1-3/1-4 dev notes]
- **Zac hand-edits / signs off.** Surface the two flagged decisions (route-group path, not-found behaviour) for Zac rather than silently baking them. [Source: memory "don't-assert-secondhand-decisions-as-closed"]

### Git intelligence

Recent commits follow `feat: Project Ariadne story 2-N created` → `… code complete`, one focused diff per story (`ec9998b` = Story 2.1 code complete, the baseline for this story). Keep this diff scoped to `src/app/` (the layout reduction, the `(site)` group + page moves, the minimal `backroom/` room). Use `git mv` for the page moves so history follows the files. No drive-by edits to components, config, or `globals.css`. [Source: git log]

### Project Structure Notes

- Route groups (`(site)`) are **URL-invisible** — `(site)/about-me/page.tsx` serves `/about-me`. This is the whole mechanism that lets the FoH shell apply to FoH pages without prefixing their URLs. [Source: architecture.md#File/Route-Layout; epics.md#AR-7]
- Atomic-design tiers, theming tokens, and the styled Backroom components are **not** touched here (the styled `back-link`/tiles/nav are Stories 2.3/2.4). The placeholder Backroom uses plain markup. [Source: architecture.md#Component-Placement; project-context.md]
- `(site)/layout.tsx` and the Backroom layout/page are **Server Components** (no `'use client'`) — they render existing client islands (`MobileMenu`, `ContentTransition`) as children, exactly as the current root layout does. The lone planned client island for Epic 2 is the console egg (Story 2.6). [Source: project-context.md#Server-vs-Client; architecture.md#Component-boundary]

### References

- [Source: epics.md#Story-2.2] — story statement, the three ACs (root→global, `(site)` verbatim move, G1 gate + GA).
- [Source: epics.md#Epic-2, #AR-7, #AR-8, #AR-14, #AR-15, #NFR-2, #NFR-6] — route-group split, MenuProvider-stays-global, transitions gate, component placement / `(backroom)` path note, verification standard, zero-regression, GA continuity.
- [Source: architecture.md#D4 (lines 203–224)] — the layout restructure decision and the verbatim-relocation zero-regression key.
- [Source: architecture.md#Project-Structure tree (lines 389–432)] — the explicit target tree (`(site)/` group + plain `backroom/` folder + global root).
- [Source: architecture.md#G1 (lines ~528–529), #G4 (lines ~535–538)] — the highest-attention FoH-zero-regression gate and the conditional Backroom-transition gate.
- [Source: src/app/layout.tsx] — the current combined layout being split (global chrome lines 60–110; shell lines 76–104).
- [Source: src/app/providers.tsx] — next-themes provider config (unchanged).
- [Source: src/context/menu-open-context.tsx; src/components/molecules/mobile-menu.tsx; src/components/atoms/take-a-look-around-button.tsx] — MenuProvider must stay an ancestor of the `(site)` pages.
- [Source: src/app/page.tsx; src/app/not-found.tsx] — home `absolute` title; root 404 shell-inheritance.
- [Source: project-context.md] — Server-Components-by-default, atomic tiers, static export, no test suite, SEO/Metadata template, British spelling, no comments.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context)

### Debug Log References

- Baseline build (pre-change) + post-change build both green; pure static export, no `.func`.
- Verified shell relocation is verbatim by diffing all `className` strings between the original root layout and `(site)/layout.tsx` — 9/9 shell classes identical; only the `<html>` font-variable class differs (correctly stays in root).
- Verified Backroom isolation in emitted HTML: `out/backroom.html` has 0 `/about-me` nav links and no rendered portrait `<img>` (the 4 `portrait` string hits are OG/Twitter metadata image URLs only). FoH pages retain the full shell (index `portrait`×23, about-me ×29).
- Verified single static `404.html` now renders global chrome (portrait references dropped 23 → 4 metadata-only) and keeps the themed 404 copy.
- Verified titles: `/` `Home - Zac Braddy` (absolute, no double-suffix), `/about-me` `About Me - Zac Braddy` (templated), `/backroom` `The Backroom - Zac Braddy` (templated), `404.html` `404: Not found - Zac Braddy`.

### Completion Notes List

- **Layout split done (AR-7 / D4, G1 gate).** Root layout reduced to global chrome only (`<html>`/`<body>` + fonts + `suppressHydrationWarning`, `faConfig`, FontAwesome CSS + `globals.css`, `LoadingSpinner`, `Providers` → `ThemeToggle` + `MenuProvider`, `GoogleAnalytics`, `metadata`). `MenuProvider` now wraps `{children}` so the shared vaul drawer context still reaches both rooms. FoH shell relocated **verbatim** into `(site)/layout.tsx` (Server Component); four FoH pages `git mv`-ed into `(site)/` with URLs unchanged.
- **Backroom path:** plain `src/app/backroom/` folder (Zac's Q1 pick), not a route group. A route group buys nothing for `/backroom` (the folder name already gives the URL); the `(site)` group is the only one doing real URL-invisibility work.
- **404 behaviour — Zac overrode the story's recommended option (a).** Instead of accepting a single bare root 404, each room gets a section-scoped 404 via a shared `not-found-content.tsx` organism. Correction to my initial (wrong) advice: nested `not-found.tsx` boundaries **do** render client-side in a static export when a rendered page calls `notFound()` (per the Next.js error-handling docs) — no server needed. So `backroom/not-found.tsx` will render inside the Backroom shell for the missing-doc case in Stories 2.3/2.4, and `(site)/not-found.tsx` covers any future FoH `notFound()`.
- **Residual limitation (honest flag).** The one case that _can't_ be section-scoped is a cold-loaded URL that matches no route at all (e.g. typing `/asdf`): static export bakes exactly one `out/404.html` from the **root** not-found, and Netlify serves that file for every unmatched path — so it always wears global chrome, never a room's shell. This is fine and on-brand; just be aware `(site)/not-found.tsx` only fires on an in-app `notFound()`, of which the FoH currently has none (forward-looking).
- **Metadata preserved.** Home keeps `title: { absolute: 'Home - Zac Braddy' }` (now a descendant segment, but `absolute` bypasses the root template → no double-suffix). No `metadata`/`template` exported from `(site)/layout.tsx`; the single template stays in root.
- **Scope held.** No new dependencies, no Velite/Shiki, no `globals.css` edits, no new styled atoms beyond the shared 404 organism Zac requested, no console egg, no Entry link. Diff is the split + the section-404 set.
- **Smoke-test follow-up (Zac, post-implementation).** Added temporary `notFound()`-triggering routes + links in both rooms so Zac could click-test the boundaries; Zac confirmed they work, then they were removed. The test surfaced a concrete Next 16 behaviour: a **route-group** `not-found.tsx` (`(site)/`) does **not** inherit its group layout (FoH `<nav>` absent), whereas a **plain-folder** one (`backroom/not-found.tsx`) **does** (back-to-site link present). The global/unmatched-URL 404 is served by the **root** `not-found.tsx`, which only the global root layout wraps — hence "the global 404 has no layout".
- **Global 404 now wears the FoH shell (Zac's follow-up request).** Extracted the FoH shell verbatim into `src/components/organisms/site-shell.tsx` (G1: all 9 classNames byte-identical). `(site)/layout.tsx` now delegates to `SiteShell`; the root `not-found.tsx` renders `<SiteShell><NotFoundContent/></SiteShell>`, so the single static `404.html` shows the sidebar + working nav links (`/about-me`, `/resume`, `/content` verified present) — a lost user can navigate back. Removed the now-redundant `(site)/not-found.tsx` (a FoH `notFound()` bubbles to this same shell-wrapped root 404). The Backroom 404 rendering is deferred to the later Backroom-layout story per Zac.
- **For Zac to confirm on `npm run dev` / a deploy preview (not headlessly verifiable):** (1) FoH visual + behavioural parity — route-transition fade, scroll-reset, mobile vaul drawer open/close below `lg`; (2) GA real-time page-view for `/backroom`.

### File List

- `src/app/layout.tsx` — EDIT (reduced to global chrome; `MenuProvider` wraps `{children}`; dropped shell-only imports)
- `src/app/not-found.tsx` — EDIT (global 404 — renders `NotFoundContent` **inside `SiteShell`** so it wears the FoH sidebar/nav; per Zac, a lost user can navigate back via the nav)
- `src/app/(site)/layout.tsx` — NEW (delegates to `SiteShell`; Server Component)
- `src/app/(site)/page.tsx` — MOVE (from `src/app/page.tsx`)
- `src/app/(site)/about-me/page.tsx` — MOVE (from `src/app/about-me/page.tsx`)
- `src/app/(site)/resume/page.tsx` — MOVE (from `src/app/resume/page.tsx`)
- `src/app/(site)/content/page.tsx` — MOVE (from `src/app/content/page.tsx`)
- `src/app/backroom/layout.tsx` — NEW (minimal Backroom room + back-to-site link)
- `src/app/backroom/page.tsx` — NEW (placeholder Overview)
- `src/app/backroom/not-found.tsx` — NEW (Backroom-shell 404 boundary; renders in the Backroom layout — refined in a later Backroom-layout story)
- `src/components/organisms/site-shell.tsx` — NEW (FoH shell extracted verbatim; shared by `(site)/layout.tsx` and the global 404; all 9 shell classNames byte-identical to the original — G1 holds)
- `src/components/organisms/not-found-content.tsx` — NEW (shared 404 content organism)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-29 | Story 2.2 created (ready-for-dev): split the layout into a global root shell, a verbatim `(site)` front-of-house room, and a minimal isolated `/backroom` room (AR-7 / D4, the G1 zero-regression gate). Resolved the AR-14 route-group path (recommend plain `src/app/backroom/`) and flagged the root `not-found.tsx` shell-inheritance behaviour (recommend accepting the global-chrome 404). Structural only — no pipeline/components/tokens/entry-link/console-egg (Stories 2.3–2.6).                                                                                                                                                                                                                                  |
| 2026-06-29 | Story 2.2 code complete (review): root layout reduced to global chrome (`MenuProvider` wraps `{children}`); FoH shell relocated verbatim into `(site)/layout.tsx` (9/9 className strings byte-identical); four FoH pages `git mv`-ed into `(site)/` (URLs unchanged); minimal `/backroom` room added (plain folder, back-to-site link, GA inherited). Per Zac's decision, replaced the single bare-404 recommendation with section-scoped 404s: shared `not-found-content.tsx` organism rendered by root + `(site)` + `backroom` not-found boundaries. Lint clean; build green, pure static export (8 routes `○ (Static)`, no `.func`). FoH visual/behaviour parity + GA `/backroom` real-time left for Zac on dev/preview. |
| 2026-06-29 | Post-smoke-test refinement (Zac): temporary `notFound()` test routes/links added, confirmed working by Zac, then removed. Per Zac's request the **global 404 now wears the FoH shell** — extracted the shell verbatim into `site-shell.tsx` (G1 holds, 9/9 classNames identical), `(site)/layout.tsx` delegates to it, and root `not-found.tsx` renders `<SiteShell><NotFoundContent/></SiteShell>` so `404.html` shows the sidebar + working nav links. Removed the redundant `(site)/not-found.tsx`. Backroom 404 styling deferred to the later Backroom-layout story. Rebuild green, FoH parity + `/backroom` isolation re-verified.                                                                                     |

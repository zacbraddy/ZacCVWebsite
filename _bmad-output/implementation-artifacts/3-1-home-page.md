---
baseline_commit: 3e91785
---

# Story 3.1: Home page (`/`)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the home page with Zac's name, the cycling job titles, and the mobile call-to-action,
so that the landing experience is identical to today.

## Context & purpose (read first)

This is the **first story of Epic 3** (Content Pages at Parity). Epics 1 and 2 are **done**: the
themed, persistent, fully-navigable shell exists — root `layout.tsx` (Server Component) wraps
every route with the desktop sidebar, mobile drawer, theme toggle, loading spinner, custom
scrollbar, and the per-route entrance/transition animation (`ContentTransition`). **Epic 3 now
fills that shell with the real content, one route at a time, at byte-for-byte parity.** This
story does the `/` route.

Today the home route renders, inside the content pane: **"Zac Braddy"** in the fancy heading
font, a **rotating job title** that cycles a fixed list every 4 seconds with a 750ms fade, and —
**only below `lg`** — a **"Take a look around"** pill button that opens the mobile menu. That is
all this page is. The single source of visual/behavioural truth is the **live site**
(`zackerthehacker.com`) and the archived Gatsby implementation
(`archive/src/pages/index.js`). This is a **parity port** (NFR1 zero-visual-regression, NFR2
zero-functional-regression, NFR7 preserve quirks) — the rotating titles are intentional flair,
reproduced verbatim, **not** "fixed".

**Right now `src/app/page.tsx` is still the `create-next-app` placeholder** (the Next/Vercel
logo splash). This story **replaces it wholesale** with the real home page and removes the
placeholder's orphaned `src/app/page.module.css`.

**3.1's job — five things:**

1. **Move the job-title list into `src/config`.** The archive defines `JOBTITLES` **inline in
   `index.js`**; the AC requires the list come **from `src/config`** (config indirection). Add
   `JOB_TITLES` to `src/config/index.ts`, preserving the exact 11 entries and their order (the
   first entry is the existing `JOB_TITLE`).
2. **Build the rotating-title `'use client'` leaf** (`molecules/rotating-job-title.tsx`) — the
   `setInterval` cycle (4000ms) wrapped in the existing `AnimateOnChange` atom (AR14: the
   rotating job-title animation is a named client leaf).
3. **Build the mobile CTA `'use client'` leaf** (`atoms/take-a-look-around-button.tsx`) — the
   `lg:hidden` pill that calls `setMenuOpen(true)` via the existing `useMenuOpen()` hook.
4. **Rewrite `src/app/page.tsx` as a Server Component** that composes the static `<h1>` + the two
   client leaves and exports per-page `metadata` (FR17). Delete the orphaned `page.module.css`.
5. **Capture the page-title/metadata convention** (ADR 0021) — the home `<title>` is a **single**
   `Home - Zac Braddy`, consciously not reproducing the archive's accidental **double**-suffix.

This is the first content route. After it: About Me (3.2), Resume (3.3), Content (3.4), 404 (3.5).

## Acceptance Criteria

1. **The home route renders Zac's name and the rotating job-title animation at parity, with the
   rotation in a `'use client'` leaf (FR11, AR14, NFR7).**
   **Given** the home route,
   **When** it renders,
   **Then** it shows **"Zac Braddy"** in the fancy heading and the **rotating job-title
   animation** cycling the existing 11-entry title list **on the existing 4000ms interval**, with
   the same 750ms cross-fade as today (FR11),
   **And** the title list is sourced from **`src/config`** (`config.JOB_TITLES`), not hardcoded in
   the page or the leaf (config indirection),
   **And** the rotation is implemented in a **`'use client'`** leaf
   (`src/components/molecules/rotating-job-title.tsx`) that reuses the existing
   `AnimateOnChange` atom (AR14) — the cycling is intentional flair, preserved verbatim (NFR7),
   **And** the markup/classes match the archive verbatim: `<h1>` =
   `font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4`; the title `<div>` =
   `text-tertiary sm:text-2xl`.

2. **The mobile-only "Take a look around" CTA appears below `lg` and opens the menu; it is hidden
   at `lg`+ (FR11).**
   **Given** a viewport **below `lg`**,
   **When** the home page renders,
   **Then** the **"Take a look around"** pill button appears (classes verbatim:
   `lg:hidden font-bold text-md border-4 rounded-full px-4 py-2 text-secondary border-secondary flex mx-auto mt-8`),
   **And** when activated it **opens the mobile menu** by calling `setMenuOpen(true)` via the
   existing `useMenuOpen()` hook from `@/context/menu-open-context` (FR11),
   **And** it is a **`'use client'`** leaf (`src/components/atoms/take-a-look-around-button.tsx`).

   **Given** a viewport at **`lg`+**,
   **When** the home page renders,
   **Then** the CTA is **not shown** (the `lg:hidden` utility), matching today.

3. **`src/app/page.tsx` is a Server Component composing static markup + the two client leaves; the
   placeholder is gone (NFR5, AR14).**
   **Given** the Server/Client boundary discipline,
   **When** the page is built,
   **Then** `src/app/page.tsx` is a **Server Component** (no `'use client'`) that renders the
   outer layout markup and the static `<h1>Zac Braddy</h1>` directly, delegating only the two
   interactive pieces (rotating title, mobile CTA) to their client leaves,
   **And** the `create-next-app` placeholder content is **entirely removed**, and the orphaned
   `src/app/page.module.css` (imported only by the placeholder) is **deleted**,
   **And** the page wrapper markup matches the archive verbatim:
   outer `div` = `pt-32 h-full sm:flex sm:items-center sm:justify-center md:pt-24`, inner `div` =
   `flex flex-col justify-center items-center lg:pb-4`.

4. **Per-page SEO metadata matches today's home page via the Metadata API — single title suffix
   (FR17).**
   **Given** the Next Metadata API,
   **When** the route is served,
   **Then** `src/app/page.tsx` exports `metadata` with **`title: 'Home'`**, which the root
   `%s - Zac Braddy` template renders as **`<title>Home - Zac Braddy</title>`** (a **single**
   suffix — see ADR 0021 / Dev Note: the archive accidentally double-suffixes; we ship the clearly
   intended single),
   **And** `openGraph.title` and `twitter.title` are set to **`'Home - Zac Braddy'`** to match the
   archive's per-page OG/Twitter title (the archive `Seo` emitted `og:title`/`twitter:title` =
   the page title),
   **And** description, OG image, Twitter `summary_large_image` card, and favicon **inherit** the
   already-correct root-layout defaults (Story 1.6) — they are **not** re-declared here,
   **And** no `react-helmet` is used (FR17).

5. **Build green; static export intact; parity verified; scope held (NFR1/NFR2/NFR5/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TypeScript `strict`, **no `any`**, no lint errors) and the build stays
   a **pure static export** (route `/` shows as `○ (Static)`, no serverless functions),
   **And** the home page (name, rotating title + fade, mobile CTA opening the menu below `lg` and
   hidden at `lg`+) is verified in a browser in **both themes**, desktop **and** mobile, against
   the live site,
   **And** the **only** files touched are: `src/app/page.tsx` (rewrite), the new
   `rotating-job-title.tsx` + `take-a-look-around-button.tsx`, `src/config/index.ts` (add
   `JOB_TITLES`), the deleted `src/app/page.module.css`, the new ADR 0021 + its index row, and the
   sprint/story tracking — **no** edits to the Epic 1–2 shell (layout, theming, fonts, metadata
   defaults, nav, sidebar, mobile menu/context, scrollbar, spinner) and **no** other Epic 3 page.

6. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious call in this story is made,
   **Then** it is recorded in a new ADR (next free number **0021**), indexed in
   `docs/decisions/README.md`: the **page-title / per-page-metadata convention for Epic 3** —
   pages export `title: '<Page>'` and rely on the root `%s - Zac Braddy` template (a **single**
   suffix), consciously **not** reproducing the archive's double-suffixed `<title>` bug; per-page
   `openGraph.title`/`twitter.title` set to the full `'<Page> - Zac Braddy'`; description/image/
   card inherited from the root defaults. (Plus the `JOB_TITLES`-into-config move, if you judge it
   worth a line.)

## Tasks / Subtasks

- [ ] **Task 1 — Move the job-title list into `src/config`** (AC: #1)
  - [ ] Add `JOB_TITLES` to `src/config/index.ts`, preserving the archive's **exact 11 entries in
        order** (`archive/src/pages/index.js:8–20`). The **first entry is the existing
        `JOB_TITLE`** — reference it rather than duplicating the string, mirroring the archive:

    ```ts
    const JOB_TITLE = 'Contract Software Engineer';

    const config = {
      JOB_TITLE,
      JOB_TITLES: [
        JOB_TITLE,
        'Chief Technology Officer',
        'Mutant Code Monkey',
        'Principal Software Engineer',
        'Prolific Content Creator',
        'Code Chameleon',
        'Lead Web Developer',
        'Music Fanatic',
        'Javascript/Python Enthusiast',
        '1337 Video Gamer',
        'Former .NET Hacker',
      ],
    } as const;

    export default config;
    ```

  - [ ] Keep `JOB_TITLE` unchanged (the sidebar and the loading spinner already consume it — do
        **not** break them). `as const` is fine; do not over-type.

- [ ] **Task 2 — Build the rotating-title `'use client'` leaf** (AC: #1)
  - [ ] Create `src/components/molecules/rotating-job-title.tsx` with `'use client'` at the top.
        Port the archive's cycle (`archive/src/pages/index.js:22–36`): `useState(0)` index, a
        `useEffect` that sets a `setInterval` advancing the index (`i => i >= len - 1 ? 0 : i + 1`)
        **every 4000ms** and clears it on cleanup. Wrap the current title in the existing
        `AnimateOnChange` atom:
    ```tsx
    <AnimateOnChange durationOut={750}>
      <div className="text-tertiary sm:text-2xl">
        {config.JOB_TITLES[index]}
      </div>
    </AnimateOnChange>
    ```
  - [ ] **Pass only `durationOut={750}`** — that reproduces today's fade exactly. The archive home
        passed `durationIn={750} durationOut={750}`, but `durationIn` was **never used** by
        `AnimateOnChange` (neither the archive's nor the Theseus port destructure it); only
        `durationOut` drives the opacity transition. Do **not** wire `durationIn` to "fix" this —
        it is a no-op in both, and the fade timing is governed by `durationOut`. (Optional: pass
        `durationIn={750}` too for literal fidelity; it has no effect. Prefer omitting it —
        minimum necessary complexity.)
  - [ ] Use the keyed list from config (`config.JOB_TITLES`), not a local copy. Interval `4000` is
        a local constant in this file (the archive kept it inline; no need to put it in config).
  - [ ] **Lint note:** `setInterval`'s callback calling `setIndex` is **not** the
        `react-hooks/set-state-in-effect` pattern that bit Stories 2.5/2.6 — that rule fires on a
        **synchronous** setState in the effect body; an interval callback is async/event-driven and
        is fine. No `useSyncExternalStore` gymnastics needed here. Just confirm lint is green.

- [ ] **Task 3 — Build the mobile CTA `'use client'` leaf** (AC: #2)
  - [ ] Create `src/components/atoms/take-a-look-around-button.tsx` with `'use client'`. Port the
        archive button (`archive/src/pages/index.js:51–56`) verbatim, swapping the menu access to
        the Theseus hook:

    ```tsx
    'use client';

    import { useMenuOpen } from '@/context/menu-open-context';

    const TakeALookAroundButton = () => {
      const { setMenuOpen } = useMenuOpen();
      return (
        <button
          className="lg:hidden font-bold text-md border-4 rounded-full px-4 py-2 text-secondary border-secondary flex mx-auto mt-8"
          onClick={() => setMenuOpen(true)}
        >
          Take a look around
        </button>
      );
    };

    export default TakeALookAroundButton;
    ```

  - [ ] **Keep the class string verbatim**, including `text-md`. `text-md` is **not** a real
        Tailwind utility (it is a no-op — there is `text-sm`/`text-base`/`text-lg`, no `text-md`),
        so it emits nothing in v4 and the button inherits its font size. It has **zero** visual
        effect either way; preserve it for byte-faithfulness — do **not** "fix" it to `text-base`
        (that would change rendering and break parity). All classes stay **static literals** (no
        interpolation — Tailwind v4 scan safety).
  - [ ] The menu wiring is via `useMenuOpen()` (the `MenuOpenContext` provider already wraps the
        tree in `layout.tsx` since Story 2.4) — do **not** add a new provider or context.

- [ ] **Task 4 — Rewrite `page.tsx` as a Server Component + metadata; delete the placeholder CSS**
      (AC: #3, #4)
  - [ ] Replace the entire contents of `src/app/page.tsx` (currently the `create-next-app`
        placeholder) with the real home page — a **Server Component** (no `'use client'`):

    ```tsx
    import type { Metadata } from 'next';
    import RotatingJobTitle from '@/components/molecules/rotating-job-title';
    import TakeALookAroundButton from '@/components/atoms/take-a-look-around-button';

    export const metadata: Metadata = {
      title: 'Home',
      openGraph: { title: 'Home - Zac Braddy' },
      twitter: { title: 'Home - Zac Braddy' },
    };

    export default function Home() {
      return (
        <div className="pt-32 h-full sm:flex sm:items-center sm:justify-center md:pt-24">
          <div className="flex flex-col justify-center items-center lg:pb-4">
            <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">
              Zac Braddy
            </h1>
            <RotatingJobTitle />
            <TakeALookAroundButton />
          </div>
        </div>
      );
    }
    ```

  - [ ] **Delete `src/app/page.module.css`** — it is imported **only** by the placeholder page
        (verified) and is dead once the page is rewritten. Do **not** leave a stray import.
  - [ ] Do **not** re-declare description / OG image / Twitter card / favicon — they inherit the
        root-layout defaults (Story 1.6), which already match the archive. Only `title` (+ the OG/
        Twitter title overrides) is page-specific here.
  - [ ] Leave the page **outside** any extra wrapper — it is rendered as `children` inside
        `ContentTransition` (the route fade + custom scrollbar) in `layout.tsx`. The outer `h-full`
        is correct for the scroll container; do not add height hacks.
  - [ ] **Optional, non-blocking:** the `create-next-app` leftover SVGs in `public/`
        (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) are now unreferenced.
        Removing them is tidy but **out of scope** for 3.1 (NFR6) — if you remove them, note it;
        otherwise leave for a later cleanup. Do **not** touch `public/images/` or `public/pdfs/`.

- [ ] **Task 5 — Verify (build, lint, static export, in-browser parity)** (AC: #5)
  - [ ] `npm run build` → green, **pure static export** (`/` listed as `○ (Static)`, no `.func`).
        Confirm `out/index.html` contains the home markup (`Zac Braddy` heading, the first job
        title, the CTA) and **not** the old Next/Vercel placeholder.
  - [ ] `npm run lint` → clean (TS strict, **no `any`**, no lint errors).
  - [ ] `npm run dev`, load `/` in a browser and compare to the live site, in **both themes**,
        **desktop and mobile**: (a) "Zac Braddy" in the marker font, cyan (`text-secondary`);
        (b) the job title cycling every ~4s with the 750ms fade, gold (`text-tertiary`);
        (c) **below `lg`** the "Take a look around" pill shows and **opens the mobile drawer** when
        tapped; (d) **at `lg`+** the pill is hidden; (e) the page entrance/route-transition
        animation and scrollbar still behave (Epic 2 shell unchanged). Record honestly what was
        observed; route the final all-tier visual sign-off to the **Story 4.1 gate**.
  - [ ] `npm run format`. Confirm `git diff` shows only the AC5 files — in particular that **no
        Epic 1–2 shell file** (layout, theming, nav, sidebar, mobile menu, scrollbar, spinner) was
        reopened, and **no other Epic 3 page** was added.
  - [ ] Do **not** run `npm test` (stub `exit 1`, AR13).

- [ ] **Task 6 — Decision capture** (AC: #6)
  - [ ] Create `docs/decisions/0021-<short-title>.md` from `docs/decisions/_template.md`
        (Status: Accepted; Date: 2026-06-17; Decider: Zac; Tags: `theseus`, `metadata`, `seo`)
        capturing the **page-title / per-page-metadata convention for Epic 3**: pages export
        `title: '<Page>'` → root `%s - Zac Braddy` template → a **single**-suffix `<title>`;
        the archive's `Seo` + `titleTemplate` accidentally produced a **double** suffix
        (`Home - Zac Braddy - Zac Braddy`) which we deliberately do **not** reproduce (obvious bug,
        per the "fix obvious bugs, don't port verbatim" principle); per-page
        `openGraph.title`/`twitter.title` = `'<Page> - Zac Braddy'` to match the archive's per-page
        OG/Twitter title; description/image/card inherited from root defaults. Optionally note the
        `JOB_TITLES`-into-config move (config indirection).
  - [ ] Add the 0021 row to the ADR index table in `docs/decisions/README.md`.
  - [ ] If a genuinely-deferrable item surfaces, log it in
        `_bmad-output/implementation-artifacts/deferred-work.md` (story-3.1) — do **not**
        gold-plate (NFR6).

## Dev Notes

### What this story changes (small surface)

- **New:** `src/components/molecules/rotating-job-title.tsx` (`'use client'` cycle leaf),
  `src/components/atoms/take-a-look-around-button.tsx` (`'use client'` mobile CTA leaf),
  `docs/decisions/0021-…md`.
- **Modified:** `src/app/page.tsx` (placeholder → real home, Server Component),
  `src/config/index.ts` (add `JOB_TITLES`), `docs/decisions/README.md` (index 0021),
  `_bmad-output/implementation-artifacts/sprint-status.yaml`, this story file.
- **Deleted:** `src/app/page.module.css` (orphaned placeholder CSS).
- **Not touched:** the entire Epic 1–2 shell — `layout.tsx`, `globals.css`/theming tokens,
  fonts/metadata-defaults/GA, `nav-links`/`nav-link`, `portrait-image`/`socials`, `mobile-menu`/
  `menu-open-context`, `content-transition` (scrollbar + route fade), `loading-spinner`,
  `theme-toggle`, `animate-on-change`/`animations.ts`. **Do not re-open earlier work.**

### Server/Client decomposition (AR14, NFR5)

The archive home was a single client component (the whole page used hooks). The idiomatic-Next
shape (AR14: "content organisms render on the server; `'use client'` leaves only for … the
rotating job-title animation … the mobile menu") is:

- **`page.tsx` = Server Component** — owns the static markup (`<h1>`), the `metadata` export, and
  composes the two leaves. No hooks, no `'use client'`.
- **`rotating-job-title.tsx` = client leaf** — the only reason it's client is the `useState` +
  `setInterval`. It composes the `AnimateOnChange` **atom** (which is itself `'use client'`).
- **`take-a-look-around-button.tsx` = client leaf** — client only because of `onClick` +
  `useMenuOpen()` (context).

Keeping the `<h1>` and `metadata` on the server is the whole point of the split — do **not**
collapse the page into one big client component "for simplicity"; that would regress the
server-by-default posture (NFR5) the Epic 2 stories established (`ThemeToggle`, `MobileMenu`,
`ContentTransition` are all client leaves under a Server-Component `layout.tsx`).

### The rotating title — fade timing, and why `durationOut` is enough

`AnimateOnChange` (`src/components/atoms/animate-on-change.tsx`) is the Story 2.1 port of the
archive atom. **Neither version uses `durationIn`** — it is present in the Theseus prop type but
unread; only `durationOut` drives the styling (the `opacity … ms ease-out` transition and
`animationDuration`). With **no `animation` prop** (as on the home title), `AnimateOnChange` takes
its opacity-transition path: the title fades out to `opacity: 0` over `durationOut`ms, swaps text
on `transitionend`, then fades back. So `durationOut={750}` reproduces today's 750ms cross-fade
exactly. The archive's `durationIn={750}` was always a no-op — don't be misled into wiring it.

The cycle itself: `setInterval(… , 4000)` advancing `index` with the wrap
`i => i >= JOB_TITLES.length - 1 ? 0 : i + 1`, cleared on unmount. Verbatim from
`archive/src/pages/index.js:26–36`. This is **intentional flair preserved** (NFR7) — not a bug to
remove.

### The mobile CTA — menu wiring

The archive used `useContext(MenuOpenContext)` then `menuContext.setMenuOpen(true)`. In Theseus
the context moved to `src/context/menu-open-context.tsx` (Story 2.4) and exposes a convenience
hook **`useMenuOpen()`** returning `{ menuOpen, setMenuOpen }`. Use the hook (it's what the rest
of the shell uses). The `MenuProvider` already wraps everything in `layout.tsx`, so the button
just consumes it — no provider/setup needed. `lg:hidden` keeps it mobile-only (parity with today;
the desktop sidebar nav replaces it at `lg`+).

### Metadata / the title double-suffix bug (ADR 0021) — and why we ship the single

The archive `Seo` component (`archive/src/components/seo.js`) renders
`<Helmet title={seo.title} titleTemplate="%s - Zac Braddy">`, and **every page passed the already
suffixed full string** as `title` (home: `"Home - Zac Braddy"`). react-helmet applies the
template to the document title, so the live `<title>` is **`Home - Zac Braddy - Zac Braddy`** — a
doubled suffix. That is an obvious, unintended bug (the same doubling exists on every archive
page).

Theseus fixes it the idiomatic way: the **root layout** already defines
`title.template = '%s - Zac Braddy'` (Story 1.6), so the home page exports just `title: 'Home'` →
`<title>Home - Zac Braddy</title>` (single, intended). This follows the project's standing
"**fix obvious bugs, don't port verbatim**" principle — the parity bar is the live site's
_intended_ appearance, and a doubled `<title>` suffix is plainly not intended.

For the **social/OG** tags: the archive `Seo` set `og:title`/`twitter:title` = the raw `title`
prop = `"Home - Zac Braddy"` (the template does **not** apply to meta tags in react-helmet). So to
match per-page OG/Twitter exactly, set `openGraph.title` and `twitter.title` to
`'Home - Zac Braddy'` on the page. Description, OG image (`/images/zac-portrait.jpg`), the
`summary_large_image` card, and the wizard-hat favicon are all already correct as **root
defaults** (Story 1.6) and the archive home didn't override them — so **inherit**, don't
re-declare.

This convention is **cross-cutting across Epic 3** (every page: `title: '<Page>'`,
`og/twitter.title: '<Page> - Zac Braddy'`, inherit the rest), which is exactly why it's worth an
ADR (0021) now rather than a per-page decision. 3.2–3.5 will follow this same shape, with their
own page titles (About Me, Resume, Content I've Created; and 3.5's 404 follows the same template
mechanism).

> **Resolved (Zac, 2026-06-17):** ship the **single**-suffix `<title>` — the doubling is a bug, so
> the code produces the intended result, not the archive's accident. This is a deliberate, narrow
> step off strict-verbatim parity (a bug-fix, per "fix obvious bugs, don't port verbatim") → ADR 0021. Do **not** reproduce the doubled `<title>`.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** the CTA is an **atom** (single button, no composition); the rotating title is
  a **molecule** (composes the `AnimateOnChange` atom + config + state). Filenames
  **kebab-case**, component identifiers **PascalCase** (`RotatingJobTitle`,
  `TakeALookAroundButton`), **default export** (matches the existing atoms/molecules).
- **TypeScript strict, no `.js` source** (AR2) — new files are `.tsx`; **no `any`**; use TS types,
  not `PropTypes`. (project-context.md's PropTypes/Gatsby/`useStaticQuery` rules describe the
  **archive** stack — follow the Theseus artifacts where they diverge, as Stories 1.7–2.6
  established.)
- **Prettier is law** (`^3.x` here): single quotes, `arrowParens: avoid` (write `arg => …`,
  `() => setMenuOpen(true)`). Run `npm run format`; Husky `pretty-quick --staged` on commit.
- **No code comments by default** — none are warranted here.
- **British spelling** in user-facing copy — none is added (the only copy is "Zac Braddy", the job
  titles, and "Take a look around", all verbatim from the archive). Keep CSS/JS identifiers
  canonical.
- **Config indirection** — the job-title list comes from `@/config` (`JOB_TITLES`), the page does
  not inline it. `JOB_TITLE` stays for the sidebar/spinner.
- **Themed colours only** — `text-secondary` / `text-tertiary` / `border-secondary` utilities
  (all defined in `globals.css`, verified) drive every colour; **no raw hex**. All class strings
  are **static literals** (no interpolation — Tailwind v4 PurgeCSS/scan safety). The
  `font-fancy-heading` token (Permanent Marker) is defined in `@theme`.

### Scope seams — do NOT build now (NFR6)

Out of scope for 3.1: **any other Epic 3 page** (About Me / Resume / Content / 404 — those are
3.2–3.5). Do **not** rework the Epic 2 shell to "improve" the home page — the entrance animation,
route transition, scrollbar, sidebar, mobile drawer, and spinner are all done and must stay
untouched. Do **not** add a title-persistence, analytics event, or any feature the archive home
didn't have. Do **not** "fix" the rotating titles, the `text-md` no-op, or the email/quirks
(there's no email on home anyway). The full-shell, all-tier visual sign-off is the **Story 4.1
gate**, not this story.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it as a test or
invent a suite. Verification = `npm run build` green + pure static export, `npm run lint` clean,
and **manual behavioural parity** in a browser (both themes, desktop + mobile: name, cycling title

- fade, CTA opens the menu below `lg` / hidden at `lg`+). Record honestly what was observed; the
  all-tier visual sign-off is the Story 4.1 gate.

### Project Structure Notes

- The home page decomposes into a Server-Component page + two named client leaves — the AR14 shape
  the Epic 2 shell already follows. No new context, no new provider; the CTA consumes the existing
  `MenuOpenContext` (Story 2.4) and the rotating title composes the existing `AnimateOnChange`
  atom (Story 2.1).
- `page.tsx` is rendered as `children` inside `ContentTransition` (Story 2.5) within the content
  pane (`bg-primary-400` … in `layout.tsx`) — so the page supplies only its own inner markup, not
  any shell chrome.
- `JOB_TITLES` joins `JOB_TITLE` in `src/config/index.ts` — the single config module the shell
  already imports; no new config file.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — the four Given/When/Then ACs
  (name + rotating titles from `src/config` on the existing interval, `'use client'` leaf, NFR7;
  mobile CTA opens the menu below `lg`; CTA hidden at `lg`+; per-page SEO via the
  `%s - Zac Braddy` template).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] — Epic 3 = fill the shell page-by-page
  at byte-for-byte parity; content organisms render on the server, interactive bits are
  `'use client'`.
- [Source: _bmad-output/planning-artifacts/epics.md#FR11] — Home: name, rotating job-title
  animation (existing list + interval), mobile-only "Take a look around" CTA that opens the menu.
- [Source: _bmad-output/planning-artifacts/epics.md#FR17] — per-page SEO via the Metadata API
  (`%s - Zac Braddy` template), not react-helmet. [Source: #Additional Requirements] — AR4 (static
  export), AR13 (no fabricated suite), AR14 (named `'use client'` leaves; rotating title named
  explicitly), AR19 (decision-capture DoD).
- [Source: archive/src/pages/index.js] — the **authoritative** home page to port: the `JOBTITLES`
  list (11 entries, first = `config.JOB_TITLE`), the `useState`/`setInterval(4000)` cycle with the
  wrap, `<AnimateOnChange durationIn={750} durationOut={750}>` (only `durationOut` has effect), the
  `<h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">Zac Braddy</h1>`,
  the title `<div className="text-tertiary sm:text-2xl">`, and the
  `lg:hidden … text-md border-4 rounded-full … text-secondary border-secondary …` CTA that calls
  `setMenuOpen(true)`.
- [Source: archive/src/components/seo.js + archive/gatsby-config.js] — the `Seo` +
  `titleTemplate: '%s - Zac Braddy'` mechanism that doubles the `<title>` suffix on every page (the
  bug ADR 0021 consciously does not reproduce); `og:title`/`twitter:title` set to the raw page
  title; the default description/image/twitterUsername now carried as Theseus root-layout defaults.
- [Source: src/app/page.tsx] — the current `create-next-app` **placeholder** to fully replace; its
  `import './page.module.css'` is the only reference to that file (delete both the import and the
  CSS).
- [Source: src/app/layout.tsx:38–59] — the root `metadata` (template `%s - Zac Braddy`, default
  title/description, OG image `/images/zac-portrait.jpg`, `summary_large_image` card) the home page
  inherits; only `title` (+ OG/Twitter title) is page-specific.
- [Source: src/app/layout.tsx:74–106] — the shell: `<ContentTransition>{children}</ContentTransition>`
  inside the `bg-primary-400` content pane; the page renders as `children`.
- [Source: src/components/atoms/animate-on-change.tsx] — the Story 2.1 atom; `durationIn` is typed
  but **unused**, `durationOut` drives the opacity-transition fade; with no `animation` prop it
  takes the opacity path (the home title case).
- [Source: src/context/menu-open-context.tsx] — `useMenuOpen()` ⇒ `{ menuOpen, setMenuOpen }`; the
  `MenuProvider` wraps the tree in `layout.tsx` (Story 2.4). The CTA calls `setMenuOpen(true)`.
- [Source: src/config/index.ts] — `config.JOB_TITLE = 'Contract Software Engineer'`; add
  `JOB_TITLES` alongside it (first entry = `JOB_TITLE`).
- [Source: src/app/globals.css:6–7,57–71] — the `font-fancy-heading` token and the
  `text-secondary` / `text-tertiary` / `border-secondary` utilities the home markup uses (all
  present; themed, no raw hex).
- [Source: _bmad-output/implementation-artifacts/2-6-loading-spinner.md] — the house standard for
  this story: Server-Component-page + `'use client'`-leaf discipline, the
  `react-hooks/set-state-in-effect` lint gate (does **not** apply to interval callbacks here), ADR
  capture (0020 → 0021), the verification-honesty bar, "project-context describes the archive stack
  — follow Theseus artifacts where they diverge".
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0021 capture; 0020
  is the highest existing number, **0021** is next.
- [Source: _bmad-output/project-context.md] — atomic structure, kebab-case files / PascalCase
  components, Prettier law, no-comments default, config indirection, themed-colour rule,
  no-interpolated-classnames; describes the **archive** stack — follow the Theseus artifacts where
  they diverge.

## Decision trail

1. **Page-title / metadata convention — single suffix (RESOLVED Zac 2026-06-17, → ADR 0021).** The
   archive double-suffixes `<title>` on every page (`Seo` passes the full string into a
   `%s - Zac Braddy` template). Theseus ships the clearly-intended **single** suffix via
   `title: 'Home'` + the root template, per "fix obvious bugs, don't port verbatim". Per-page
   `og/twitter.title` = `'Home - Zac Braddy'` to match the archive's social tags;
   description/image/card inherited from root defaults. **Zac confirmed (2026-06-17): the doubling
   is a bug — produce the intended single-suffix result, do not reproduce it.** Cross-cutting for
   all Epic 3 pages.
2. **`JOBTITLES` → `src/config` (settled by the AC).** The list moves from inline-in-`index.js` to
   `config.JOB_TITLES` (config indirection; AC1 requires "from `src/config`"). First entry
   references the existing `JOB_TITLE` to avoid duplication, mirroring the archive.
3. **Two named client leaves vs one client page (settled — AR14).** Rotating title and mobile CTA
   are separate `'use client'` leaves; the page stays a Server Component holding the static `<h1>`
   - `metadata`. No collapsing into a single client component.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-17 | Story created (ready-for-dev). First story of Epic 3. Metadata single-suffix convention recommended → ADR 0021; `JOBTITLES` → `config.JOB_TITLES`; two `'use client'` leaves + Server-Component page.                                                                                                                                 |
| 2026-06-17 | Zac confirmed the title-doubling is a bug → ship the intended single suffix (not the archive's doubled `<title>`). Also confirmed Epic 3 stays **pure like-for-like translation** — content refresh (new CV, missing jobs, copy/photo currency) is Project Ariadne's scope, not Theseus's. Decision trail + Dev Note marked resolved. |

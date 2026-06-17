---
baseline_commit: 8d333a3
---

# Story 2.6: Loading spinner

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want a loading indicator until the page is ready,
so that the perceived loading experience matches today.

## Context & purpose (read first)

This is the **sixth and final story of Epic 2** (Persistent App Shell & Navigation). After
Stories 2.1–2.5 the shell is complete: the animated content pane (2.1), the shared nav +
Download CV (2.2), the desktop sidebar (2.3), the mobile burger drawer (2.4), and the custom
scrollbar + route-change scroll-reset (2.5). **This story ports the last shell piece — the
full-screen loading spinner that covers the page on initial load and is removed once the
document is ready (FR6).** Completing it closes Epic 2: a fully navigable, responsive shell in
both themes, built once.

Today, on initial page load, the live site shows a **full-viewport overlay** — a near-white
panel with an animated **Pac-Man spinner** (gold) and, beneath it, **"Zac Braddy"** and the
job title (cyan) — that disappears the moment the browser finishes loading the document
(`document.readyState === 'complete'`). This story reproduces that **verbatim** (FR6, NFR1
zero-visual-regression, NFR7 preserve intentional behaviour).

**The single source of visual/behavioural truth is the live site** (`zackerthehacker.com`)
and the archived Gatsby implementation (`archive/src/components/atoms/loading-spinner.js`,
`archive/src/components/layout.js:42,47–56,64–68`). This is a **parity port** (NFR1/NFR2) for
the structure, library, and behaviour — with **one deliberate, Zac-elected improvement**: the
splash is made **theme-reactive** (it follows the active theme) rather than reproducing the
archive's always-dark splash. That is a conscious, narrow step off strict parity (the 2.4 `vaul`
modal-semantics / 1.5 state-aware `aria-label` pattern, not the 2.5 zero-delta call) — see the
Dev Note "Theme-reactive splash — the elected improvement (Zac's call)".

**2.6's job — four things:**

1. **Re-add `react-spinners` (pinned `^0.17.0`, React-19-supported)** and build a
   `src/components/atoms/loading-spinner.tsx` `'use client'` atom that renders the archive's
   full-viewport overlay using `PacmanLoader` — byte-identical to today.
2. **Reproduce the `readyState` show/hide trigger** faithfully: the overlay shows from first
   render and is removed once `document.readyState === 'complete'` (FR6) — see the lint
   gotcha in AC4 and the Dev Note "The `readyState` trigger — and the
   `react-hooks/set-state-in-effect` gotcha (the 2.5 trap)".
3. **Make the splash theme-reactive** via the `var(--color-*)` tokens, so a light-theme visitor
   gets a light-palette splash and a dark-theme visitor the dark one. This is the **elected
   improvement** over the archive (which hardcodes the dark palette unconditionally) — the one
   intended delta in this story; see the Dev Note "Theme-reactive splash — the elected
   improvement (Zac's call)".
4. **Mount it once in `src/app/layout.tsx`** as the first child of `<body>` (the only edit to
   `layout.tsx`, which **stays a Server Component**) — the overlay covers the whole shell at
   `z-index: 30`, exactly as today.

This is the last brick in Epic 2. After this, Epic 3 fills the shell with real content.

## Acceptance Criteria

1. **The full-viewport loading overlay renders on initial load, byte-identical to today, in a
   `'use client'` boundary (FR6, NFR1).**
   **Given** a page is not yet ready,
   **When** the visitor is waiting,
   **Then** a **full-viewport overlay** displays as it does today (FR6) — a fixed panel
   covering `top/right/bottom/left: 0` at `z-index: 30`, with the `--color-bg-inverse`
   background, centring an animated **`PacmanLoader`** (`--color-text-tertiary`) above the text
   **"Zac Braddy"** and the job title (`--color-text-secondary`, bold, 18px), laid out exactly
   as `archive/src/components/atoms/loading-spinner.js` — structurally byte-identical, with the
   three colours now theme-reactive (AC4) rather than the archive's fixed dark palette. In
   **dark** theme this is the archive's exact look (background `#fafafa`, Pac-Man `#e0b404`,
   text `#04b4e0`); in **light** theme it follows the light palette,
   **And** it is implemented as a self-contained **`'use client'`** atom
   (`src/components/atoms/loading-spinner.tsx`) — the overlay owns its own ready-state, so no
   other component or context is involved.

2. **The spinner is removed once the document is ready — the `readyState` trigger reproduced
   faithfully (FR6, NFR7).**
   **Given** the page becomes ready,
   **When** rendering completes (`document.readyState === 'complete'`),
   **Then** the overlay is **removed from the DOM** (not merely hidden), reproducing today's
   behaviour where `setLoading(false)` fires on `readyState === 'complete'`
   (`archive/src/components/layout.js:47–56`),
   **And** the overlay is present from the component's first render (initial state =
   "loading"), so it covers the page during the static-export prerender and through hydration
   until ready — exactly as today.

3. **The spinner library is the archive's own, at its modern release — no hand-rolling, no
   alternative lib (NFR5, NFR6).**
   **Given** the idiomatic-Next, modern-stack posture and the zero-regression bar,
   **When** the spinner is implemented,
   **Then** it uses **`react-spinners` pinned `^0.17.0`** (React-19-supported peer range) and
   its **`PacmanLoader`** as the **only** new direct dependency — **not** a hand-rolled CSS
   Pac-Man animation, **not** a different spinner (a generic `ClipLoader`/`BeatLoader`, a
   FontAwesome spin icon, `react-loader-spinner`, etc.),
   **And** this mirrors the **2.5 precedent** (re-adding the archive's own now-modern library
   for byte-identical parity); record it in ADR 0020.

4. **The colours are theme-reactive `var(--color-*)` tokens — the elected improvement over the
   archive's always-dark splash (Zac's call, 2026-06-17).**
   **Given** the archive renders the spinner from `darkThemeValues` **unconditionally**
   (`archive/src/components/atoms/loading-spinner.js:2,18,46,55` — `import { darkThemeValues }`,
   so a light-theme visitor still gets the dark splash today),
   **When** the spinner is built,
   **Then** its three colours use the project's **theme-reactive tokens** —
   `var(--color-bg-inverse)` (background), `var(--color-text-tertiary)` (Pac-Man),
   `var(--color-text-secondary)` (text) — so the splash **follows the active theme**: white/gold/
   cyan in dark (= the archive's exact look), and the light palette (`#333` bg / `#cc715f`
   Pac-Man / `#49629c` text) in light,
   **And** this **honours** the project-context "themed colours only" rule (no literal hexes in
   the component) and is a **deliberate, intended visual delta** vs the live site's always-dark
   splash — recorded in ADR 0020(b) and flagged for the Story 4.1 gate as expected, not a
   regression,
   **And** because next-themes sets the `.light`/`.dark` class on `<html>` via its **blocking
   pre-paint script** (Story 1.5 / ADR 0011), the tokens resolve correctly from the **first
   paint** — no `useTheme()` hook, no theme-flash, no hydration mismatch (the colours are pure
   CSS driven by the html class; verified that `PacmanLoader` passes `color` straight into CSS
   so a `var(...)` value works — see Dev Note).

5. **`src/app/layout.tsx` stays a Server Component; the spinner is mounted once; minimal
   surface (NFR5, NFR6, AR14).**
   **Given** the Server/Client boundary discipline,
   **When** the spinner is mounted,
   **Then** `<LoadingSpinner />` is rendered as the **first child of `<body>`** in
   `src/app/layout.tsx` (a Server Component rendering a client leaf — `layout.tsx` keeps its
   `metadata` export and `'use client'` is **not** added to it),
   **And** the only files changed are the new `loading-spinner.tsx`, `src/app/layout.tsx` (the
   one-line mount + import), `package.json`/`package-lock.json` (add `react-spinners`), the new
   ADR 0020 + its index row, and the sprint/story tracking — **no** edits to the 2.1 animations,
   2.2 nav, 2.3 sidebar, 2.4 mobile menu/context, 2.5 scrollbar, theming, fonts, or analytics.

6. **Build green; static export intact; parity verified; scope held (NFR1/NFR2/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TS strict, **no `any`**, no lint errors — watch the
   `react-hooks/set-state-in-effect` rule, see Dev Note) and the build stays a **pure static
   export** (routes `○ (Static)`, no serverless functions),
   **And** the spinner overlay (layout, Pac-Man animation, the name + job title, and its removal
   on load) is verified in a browser in **both themes** — **dark** matches the live site exactly,
   **light** correctly shows the light palette (the intended theme-reactive delta, AC4),
   **And** Epic 2 is now complete — no Epic 3 content is added and no unrelated files are
   touched.

7. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious calls in this story are made,
   **Then** they are recorded in a new ADR (next free number **0020**), indexed in
   `docs/decisions/README.md`: (a) **the spinner mechanism — `react-spinners@0.17.0` /
   `PacmanLoader`** over a hand-rolled animation or an alternative lib (rationale: byte-identical
   parity, the archive's own now-modern library, React-19-supported; the 2.5/2.4 precedent of
   re-adding the archive's own modern lib); (b) **the theme-reactive colours** (the elected
   improvement, Zac's call — archive uses `darkThemeValues` unconditionally; Theseus drives the
   three colours from `var(--color-*)` tokens so the splash follows the active theme — an
   intended delta vs the live site's always-dark splash, with the dark-theme look unchanged);
   (c) **the `readyState` trigger mechanism** actually shipped (literal `useState` + effect, or —
   if the lint rule forces it — a `useSyncExternalStore`/listener adaptation; behaviour preserved
   either way).

## Tasks / Subtasks

- [ ] **Task 1 — Add the `react-spinners` dependency** (AC: #3, #7)
  - [ ] Install `react-spinners` pinned `^0.17.0`. Confirm it lands in `package.json`
        `dependencies` (not dev) and `package-lock.json` updates. This is the **only** new
        direct dependency in this story.
  - [ ] **Verify React 19 peer compatibility installs cleanly** (no peer-dep error — `0.17.0`
        declares `react` / `react-dom` peer `^16 || ^17 || ^18 || ^19`). Do **not** add
        `--legacy-peer-deps` to mask a conflict; if one appears, stop and flag it.
  - [ ] **Confirm the installed type situation**: `react-spinners` ships its own types — verify
        `import { PacmanLoader } from 'react-spinners'` resolves under `strict` with no
        implicit-`any`. If types are somehow missing, add a minimal ambient declaration typing
        only `PacmanLoader`'s used prop (`color?: string`) — **no `any`**, and record it in ADR
        0020(c). (Prefer the bundled types; only declare if genuinely absent.)
  - [ ] Do **not** add `react-loader-spinner`, a FontAwesome spin icon, or any other spinner
        package.

- [ ] **Task 2 — Build the `LoadingSpinner` `'use client'` atom** (AC: #1, #2, #4)
  - [ ] Create `src/components/atoms/loading-spinner.tsx` with `'use client'` at the top. Port
        the archive's overlay structure from `archive/src/components/atoms/loading-spinner.js`
        **verbatim in layout/visuals**: - **Outer overlay**: fixed/absolute panel covering `top/right/bottom/left: 0`,
        flex-centred (`display:flex; align-items:center; justify-content:center`), background
        `var(--color-bg-inverse)`, `z-index: 30`. The background uses the existing
        `bg-inverse`-style token — note there is **no `@utility bg-inverse`** in `globals.css`
        today (only `bg-primary-200/400`, `bg-secondary`, `bg-tertiary` are defined). Use an
        inline `style={{ background: 'var(--color-bg-inverse)' }}` (the archive itself used
        inline styles for the overlay) **rather than** adding a new Tailwind utility — minimum
        necessary complexity (NFR6); do not extend `globals.css`. The rest can be Tailwind:
        `absolute inset-0 z-30 flex items-center justify-center`. - **Inner grid**: `display:grid; grid-template-rows: repeat(2, minmax(0,1fr)); height:
      6rem` (Tailwind `grid grid-rows-2 h-24`). - **Pac-Man row**: flex-centred with `margin-right: 2rem` (`flex items-center
      justify-center mr-8`) containing `<PacmanLoader color="var(--color-text-tertiary)" />`
        — **pass only `color`** (as a CSS-var string; verified `PacmanLoader` inserts it
        straight into CSS, so the var resolves), leave size/margin at the library defaults
        (the archive passes only `color`, AC1). - **Text row**: `margin-top: 3rem`, `font-weight: 700`, `font-size: 18px`, flex column
        centred, **text colour `var(--color-text-secondary)`** via the existing
        **`text-secondary`** utility (already defined in `globals.css`): `mt-12 text-secondary
      font-bold text-lg flex flex-col items-center justify-center` (`text-lg` = 1.125rem =
        18px exactly), containing two divs: `Zac Braddy` and `{config.JOB_TITLE}`.
  - [ ] **Use `config.JOB_TITLE`** from `@/config` for the second line — do **not** hardcode
        "Contract Software Engineer" (config indirection; the archive uses `config.JOB_TITLE`).
  - [ ] **Use the theme-reactive tokens, not literal hexes** (AC4) — `var(--color-bg-inverse)`
        (bg), `var(--color-text-tertiary)` (Pac-Man), `var(--color-text-secondary)`/
        `text-secondary` (text). This **honours** the project-context themed-colour rule and is
        the elected delta vs the archive's always-dark `darkThemeValues`. No literal hexes in the
        component; no new `globals.css` utility (use the existing `text-secondary` and an inline
        `var(...)` for the two without a utility). No comment needed (the tokens self-document).

- [ ] **Task 3 — Wire the `readyState` show/hide trigger** (AC: #2, #6)
  - [ ] The overlay must render from first paint (initial "loading" state = true, so it appears
        in the static-export HTML and through hydration) and be **removed** once
        `document.readyState === 'complete'` — the faithful port of
        `archive/src/components/layout.js:42,47–56,64–68`.
  - [ ] **Mind the `react-hooks/set-state-in-effect` lint rule (the 2.5 trap).** The literal
        archive port calls `setLoading(false)` **synchronously inside a `useEffect`** when
        `readyState` is already `complete` — which is exactly the error-level rule that bit
        Story 2.5 (AC6 requires lint green). **Preferred mechanism:** read the ready-state via
        **`useSyncExternalStore`** (precedent: the `ThemeToggle` hydration guard already uses
        `useSyncExternalStore` in this codebase) — `subscribe` adds/removes the
        `readystatechange` listener, `getSnapshot` returns `document.readyState === 'complete'`,
        `getServerSnapshot` returns `false` (so the overlay renders during prerender). This
        reproduces "show until complete, then remove" with no setState-in-effect and adds the
        listener cleanup the archive omitted — behaviour preserved (NFR7). See the Dev Note for
        the exact shape. If you instead keep the `useState` + effect literal and lint passes,
        that's acceptable — but **verify lint is green** (it likely is not; do not silently
        suppress the rule).
  - [ ] **No SSR/hydration mismatch:** initial client render and the server prerender must agree
        (both "loading"/overlay-present). `useSyncExternalStore`'s `getServerSnapshot` ⇒ `false`
        (loading) handles this; the `useState(true)` literal also agrees (server and first
        client render both `true`). Either way the overlay must NOT depend on `window`/`document`
        **during render** (only in subscribe/effect) so the static export prerenders cleanly.

- [ ] **Task 4 — Mount the spinner in `layout.tsx` (the one layout edit)** (AC: #5)
  - [ ] In `src/app/layout.tsx`, add `import LoadingSpinner from
    '@/components/atoms/loading-spinner';` and render `<LoadingSpinner />` as the **first
        child of `<body>`** (before `<Providers>`), mirroring the archive order where the
        spinner is the first thing in the layout fragment
        (`archive/src/components/layout.js:64–68`). It sits **outside** `<Providers>` because its
        theming is pure CSS driven by the `.light`/`.dark` class on `<html>` (set by next-themes'
        pre-paint script), **not** the `ThemeProvider` React context — so it needs no
        `useTheme()` and no provider wrapper (AC4).
  - [ ] **Do not add `'use client'` to `layout.tsx`** — it stays a Server Component rendering a
        client leaf (the same pattern as `ThemeToggle`, `MobileMenu`, `ContentTransition`
        already established). Confirm the `metadata` export is untouched.
  - [ ] **Confirm z-order against the shell:** the overlay's `z-30` matches the archive
        (`zIndex: 30`). On initial load the mobile drawer is closed, so there is no z-index
        conflict with `vaul`; do not adjust other components' z-index.

- [ ] **Task 5 — Verify (build, lint, static export, in-browser parity)** (AC: #6)
  - [ ] `npm run build` → green, **pure static export** (routes `○ (Static)`, no `.func`).
        Confirm `out/index.html` contains the spinner overlay markup (initial loading state is
        prerendered). **Watch for any `window`/`document`-at-render error** from the spinner
        during prerender — there should be none if the ready-state read is confined to
        subscribe/effect/`getSnapshot`; if the build throws, the read leaked into render — fix
        it (do not add a blanket `ssr:false` unless genuinely required, NFR6).
  - [ ] `npm run lint` → clean (TS strict, no `any`, **no `react-hooks/set-state-in-effect`
        error**). Record the exact mechanism shipped in the Dev Agent Record.
  - [ ] `npm run dev`, load `/` in a browser in **both themes** and compare to the live site:
        (a) the white/gold/cyan splash covers the viewport on (re)load; (b) the Pac-Man
        animation matches; (c) "Zac Braddy" + job title render bold/18px/cyan; (d) the overlay
        **disappears once the page is ready**; (e) the splash is **theme-reactive** — **dark**
        matches the live site exactly (white/gold/cyan), **light** shows the light palette
        (dark-grey/coral/slate), the intended delta (AC4). Because the overlay vanishes on `readyState
    complete`, you may need to throttle the network / hard-reload to observe it; state
        honestly in the Dev Agent Record what was observed.
  - [ ] `npm run format`. Confirm `git diff` shows only the expected files (AC5) — in
        particular that `layout.tsx` changed **only** by the import + the one `<LoadingSpinner />`
        line, and no 2.1–2.5 work was reopened.
  - [ ] Do **not** run `npm test` (stub `exit 1` — AR13).

- [ ] **Task 6 — Decision capture** (AC: #7)
  - [ ] Create `docs/decisions/0020-<short-title>.md` from `docs/decisions/_template.md`
        (Status: Accepted; Date: 2026-06-17; Decider: Zac; Tags: `theseus`, `spinner`,
        `dependencies`) capturing: (a) **`react-spinners@0.17.0` / `PacmanLoader`** over a
        hand-rolled animation and over alternative spinner libs (byte-identical parity + the
        archive's own now-modern, React-19-supported library; the 2.5/2.4 re-add-the-archive's-
        own-modern-lib precedent); (b) **the theme-reactive colours** (the elected improvement,
        Zac's call 2026-06-17 — `darkThemeValues` used unconditionally in the archive; Theseus
        drives the three colours from `var(--color-*)` tokens so the splash follows the theme; an
        intended delta vs the live site's always-dark splash, dark-theme look unchanged, honours
        the themed-colour rule); (c) **the `readyState` trigger mechanism** actually
        shipped (and, if `useSyncExternalStore` was used, that it was driven by the
        `set-state-in-effect` lint gate — behaviour preserved, listener-cleanup added).
  - [ ] Add the 0020 row to the ADR index table in `docs/decisions/README.md`.
  - [ ] **Epic 2 is now complete.** If a genuinely-deferrable item surfaces, log it in
        `_bmad-output/implementation-artifacts/deferred-work.md` (story-2.6) — do **not**
        gold-plate it in (NFR6). The full-shell visual sign-off across all tiers remains the
        Story 4.1 gate.

## Dev Notes

### What this story changes (small surface)

- **New:** `src/components/atoms/loading-spinner.tsx` (the `'use client'` overlay atom),
  `docs/decisions/0020-…md`.
- **Modified:** `src/app/layout.tsx` (one import + render `<LoadingSpinner />` as first child of
  `<body>` — **stays a Server Component**), `package.json` + `package-lock.json` (add
  `react-spinners`), `docs/decisions/README.md` (index 0020),
  `_bmad-output/implementation-artifacts/sprint-status.yaml`, this story file.
- **Not touched:** the 2.1 animations (`animate-on-change.*`, `animations.ts`,
  `layout.module.css`), the 2.2 nav (`nav-links.tsx`, `nav-link.tsx`), the 2.3 sidebar
  (`portrait-image.tsx`, `socials.tsx`, the identity grid), the 2.4 mobile menu
  (`mobile-menu.*`, `menu-open-context.tsx`), the 2.5 scrollbar (`content-transition.*`),
  `ThemeToggle`, `Providers`, `globals.css`, theming/tokens, fonts/metadata/GA. **Do not
  re-open earlier work.**

### Decision: the spinner is built on `react-spinners@0.17.0` / `PacmanLoader` (ADR 0020) — and why

The archive used `react-spinners` (`import PacmanLoader from 'react-spinners/PacmanLoader'`,
`archive/src/components/atoms/loading-spinner.js:3`, `react-spinners@^0.13.8`). The library has
since shipped **`0.17.0`**, whose peer range is `react`/`react-dom` `^16 || ^17 || ^18 ||
^19` — i.e. **React-19-supported** (verified on the npm registry, June 2026). Options weighed:

- **Hand-roll the Pac-Man animation in CSS** — rejected: `PacmanLoader` is a distinctive,
  multi-element keyframed animation (the mouth-chomping arc plus the trailing dots); a
  hand-rolled clone would be **non-byte-identical** and is **more** work for **less** parity, on
  a zero-visual-regression migration (NFR1).
- **A different spinner** (`ClipLoader`/`BeatLoader`, a FontAwesome `fa-spin` icon,
  `react-loader-spinner`) — rejected: not the same visual; an unjustified parity break.
- **`react-spinners@0.17.0` / `PacmanLoader` (CHOSEN)** — the archive's **own** library, now a
  **modern, React-19-supported** release. Yields **byte-identical** visuals and the component
  ports verbatim (pass only `color`). This is exactly the **Story 2.5 precedent**
  (`react-custom-scroll@7.2.0`) and the 2.4 `vaul` lib-choice pattern: re-add the archive's own
  now-modern library when it gives exact parity, rather than hand-roll or swap.

**No parity delta is expected here** (contrast 2.4's `vaul` modal-semantics delta). The only
"watch" items are verification details (the bundled types resolve under strict; the static
export prerenders cleanly; `PacmanLoader`'s default size/margin in `0.17.0` still match
`0.13.8` — confirm visually at the browser check / Story 4.1 gate), not intended behavioural
changes.

> **Memory note (idiomatic-Next vs re-adding a stale lib):** the project's standing principle
> is "prefer a modern maintained primitive over re-adding a stale lib or hand-rolling". Here the
> re-added library **is** the modern, maintained, React-19-tested release — so the principle is
> satisfied, not bent. The stale `^0.13.8` does not return; `^0.17.0` does. This is the same
> reasoning the 2.5 ADR (0019) used and Zac accepted.

### Theme-reactive splash — the elected improvement (Zac's call)

This is the one **intended visual delta** in the story, decided by Zac on 2026-06-17 ("make the
splash theme-reactive — the juice is worth the squeeze"). The archive's spinner imports the
**dark** theme object and uses it **unconditionally**, irrespective of the active theme
(`archive/src/components/atoms/loading-spinner.js`):

```js
import { darkThemeValues } from '../theme-styles';
// ...
background: darkThemeValues.backgroundColor.inverse,   // #fafafa
// ...
<PacmanLoader color={darkThemeValues.textColor.tertiary} />   // #e0b404
// ...
color: darkThemeValues.textColor.secondary,            // #04b4e0
```

So on the live site, a visitor with the **light** theme persisted **still** sees the
white/gold/cyan (dark-palette) splash. That is the one rough edge we're consciously polishing:
**Theseus drives the three colours from the theme-reactive `var(--color-*)` tokens** so the
splash matches whichever theme the visitor is in.

The mapping is one-to-one with the archive's `darkThemeValues` fields, just expressed as tokens
(defined on both `:root` and `.light` in `src/app/globals.css`):

| Archive (dark, fixed)                        | Theseus token (theme-reactive) | dark → light          |
| -------------------------------------------- | ------------------------------ | --------------------- |
| `backgroundColor.inverse` (`#fafafa`)        | `var(--color-bg-inverse)`      | `#fafafa` → `#333`    |
| `textColor.tertiary` (`#e0b404`, Pac-Man)    | `var(--color-text-tertiary)`   | `#e0b404` → `#cc715f` |
| `textColor.secondary` (`#04b4e0`, name/role) | `var(--color-text-secondary)`  | `#04b4e0` → `#49629c` |

In **dark** theme this renders the archive's **exact** look (the tokens' `:root` values are the
archive hexes), so the only place the delta is visible is **light** theme — where the splash now
correctly goes dark-grey/coral/slate instead of staying white/gold/cyan. This **honours** the
project-context "themed colours only / no raw hex" rule (no literals in the component) — the
elegant outcome is that the _more idiomatic_ implementation is also the _improved_ one.

**Why this is clean and flash-free:** next-themes sets the `.light`/`.dark` class on `<html>`
via its **blocking pre-paint `<script>`** (Story 1.5 / ADR 0011, verified in `out/index.html`),
so the tokens already resolve to the correct palette on the **first paint** — before hydration,
before any effect. The spinner therefore needs **no `useTheme()` hook**, has **no theme-flash**,
and raises **no hydration mismatch** (the colours are pure CSS driven by the html class, not JS
state). The `PacmanLoader` `color` prop is the only "will a CSS var work here?" risk — and it's
cleared: `react-spinners@0.17.0` inserts `color` **straight into CSS** (`...solid ${color}` for
the shape borders, `backgroundColor: color` for the dots; **no `calculateRgba`/hex parsing** —
verified against the `0.17.0` source), so `color="var(--color-text-tertiary)"` resolves natively.

**Record this as the intended delta** in ADR 0020(b): a conscious, narrow step off strict parity
(the 2.4 `vaul`-delta / 1.5 state-aware-`aria-label` pattern), improving on the archive rather
than reproducing its always-dark quirk. Flag it for the **Story 4.1 gate** as _expected_ — the
light-theme splash will differ from the live site **by design**, and that is correct, not a
regression to chase.

### The `readyState` trigger — and the `react-hooks/set-state-in-effect` gotcha (the 2.5 trap)

The archive controls visibility in `layout.js` (not in the spinner atom):

```js
const [loading, setLoading] = useState(true);
useEffect(() => {
  if (document.readyState === 'complete') {
    setLoading(false); // <-- synchronous setState in an effect
    return;
  }
  document.addEventListener('readystatechange', event => {
    if (document.readyState === 'complete') setLoading(false);
  });
}, []);
// ...
{
  loading && <LoadingSpinner />;
}
```

In Theseus the ready-state lives **inside the atom** (the atom owns its own visibility; nothing
else needs to know), so `layout.tsx` just renders `<LoadingSpinner />` unconditionally and the
atom removes itself when ready (returns `null`).

**The trap:** the literal port calls `setLoading(false)` **synchronously inside `useEffect`**
when `readyState` is already `complete`. That is precisely the error-level
**`react-hooks/set-state-in-effect`** rule that bit Story 2.5 (ADR 0019(b)) — and AC6 needs lint
green. On most loads, by the time React hydrates and the effect runs, `readyState` **is** already
`'complete'`, so this branch fires every time.

**Preferred mechanism — `useSyncExternalStore`** (React's idiomatic way to read external mutable
browser state; the codebase already uses it in `ThemeToggle`):

```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { PacmanLoader } from 'react-spinners';
import config from '@/config';

const subscribe = (onChange: () => void) => {
  document.addEventListener('readystatechange', onChange);
  return () => document.removeEventListener('readystatechange', onChange);
};
const getSnapshot = () => document.readyState === 'complete';
const getServerSnapshot = () => false; // render the overlay during prerender

const LoadingSpinner = () => {
  const ready = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (ready) return null;

  return (
    /* overlay markup — fixed dark-value colours, PacmanLoader, name + JOB_TITLE */
  );
};

export default LoadingSpinner;
```

This reproduces "overlay shown until `readyState === 'complete'`, then removed" with **no
setState-in-effect** (lint-clean), no hydration mismatch (`getServerSnapshot` ⇒ overlay
present, matching the prerender), and it **adds the listener cleanup the archive omitted**
(behaviour preserved, a latent leak fixed — NFR7-compatible: the visible behaviour is
identical). If you instead keep the `useState` + effect literal and lint genuinely passes, that
is acceptable — but verify, and **do not** suppress the rule with a disable comment. Record the
shipped mechanism in ADR 0020(c).

> Note the read must stay in `subscribe`/`getSnapshot` (post-mount / client-only) — never touch
> `document` **during render** — so the `output: 'export'` prerender doesn't throw (AR4). The
> `'use client'` atom is still server-prerendered for the initial HTML; `getServerSnapshot`
> governs that pass.

### Positioning & mount point

- The archive overlay is `position: absolute` with `top/right/bottom/left: 0` and `zIndex: 30`,
  rendered as the **first element of the layout fragment** with **no positioned ancestor** — so
  it resolves against the initial containing block and covers the viewport. Mounting
  `<LoadingSpinner />` as the **first child of `<body>`** in Theseus reproduces that (body is not
  a positioned ancestor; `absolute inset-0` covers the viewport). `fixed inset-0` would be
  marginally more robust and visually identical here; **prefer `absolute` for byte-faithfulness**
  to the archive unless the browser check shows a difference, then `fixed` is an acceptable
  parity-neutral swap (note it in the Dev Agent Record if used).
- It sits **outside `<Providers>`** (no theme dependency) and **above** the shell at `z-30`. The
  mobile `vaul` drawer is closed on initial load, so there is no z-index interplay to manage.

### Static-export / SSR compatibility (AR4)

`LoadingSpinner` is a `'use client'` atom. Next still **prerenders** client components on the
server for the initial HTML under `output: 'export'`. Because the ready-state read is confined
to `subscribe`/`getSnapshot`/`getServerSnapshot` (or an effect, in the literal variant) and
never runs during render, the static build will not throw on `document`. The overlay markup
(loading state) is what gets baked into `out/index.html` — which is correct (the splash should
be in the first paint). Verify the build is green (Task 5); only add an explicit guard if it
actually fails (NFR6 — minimum necessary complexity).

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** the spinner is an **atom** (`src/components/atoms/loading-spinner.tsx`),
  mirroring `archive/src/components/atoms/loading-spinner.js`. Filenames **kebab-case**,
  component identifier **PascalCase** (`LoadingSpinner`), **default export** (matches the
  archive and the other atoms).
- **TypeScript strict, no `.js` source** (AR2) — the new file is `.tsx`; **no `any`**. Use TS
  types, not `PropTypes`. (project-context.md's PropTypes/Gatsby rules describe the **archive**
  stack; follow the Theseus artifacts where they diverge, as 1.7/2.1–2.5 established.)
- **Prettier is law** (`^3.8.4`): single quotes, `arrowParens: avoid` (write `arg => …`). Run
  `npm run format`; Husky `pretty-quick --staged` on commit.
- **No code comments by default** — none are warranted here; the `var(--color-*)` tokens
  self-document the theming. Don't leave "removed code" comments.
- **British spelling** in any user-facing copy; none is added here (the only copy is "Zac Braddy"
  - the existing `config.JOB_TITLE`). Keep CSS/JS identifiers canonical (`color`, `background`).
- **Config indirection** — the job-title line uses `config.JOB_TITLE` from `@/config` (already
  exists, value `'Contract Software Engineer'`); do not hardcode it.
- **Themed-colour rule — honoured (and the source of the elected improvement).** The three
  colours use `var(--color-*)` tokens / the existing `text-secondary` utility — no literal hexes
  in the component. That compliance is exactly what makes the splash theme-reactive (the elected
  delta vs the archive's hardcoded dark palette; see the crux Dev Note). All class strings remain
  **static literals** — no string interpolation of class names (Tailwind v4 scan safety).

### Scope seams — do NOT build now (NFR6)

Out of scope for 2.6: **any Epic 3 content** (Home/About/Resume/Content/404 — do not add page
content to "exercise" the spinner; a hard reload / network throttle is enough to see it). Do
**not** rework the 2.1 animation handshake, the 2.5 scrollbar, or any 2.2–2.4 shell piece. Do
**not** over-engineer the elected theme-reactive splash beyond the three-token swap — no
`useTheme()` hook, no per-theme branching, no new `globals.css` utilities (the html class drives
it, see the crux Dev Note). Do **not** add a second spinner style or a route-transition spinner (FR6 is
the **initial-load** spinner only — the route-transition animation is 2.1's `AnimateOnChange`,
already shipped). The full-shell, all-tier visual sign-off is the **Story 4.1 gate**, not this
story.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it as a test or
invent a suite. Verification: `npm run build` green + pure static export, `npm run lint` clean
(esp. no `react-hooks/set-state-in-effect`), and **manual behavioural parity** in a browser in
**both themes** (the white/gold/cyan splash on load, the Pac-Man animation, the name + job
title, removal on ready, and the same look in light as in dark). The overlay vanishes on
`readyState complete`, so use a hard reload / network throttle to catch it; record honestly what
was observed and route the final all-tier visual sign-off to the Story 4.1 gate.

### Project Structure Notes

- The spinner is a self-contained atom owning its own ready-state — unlike the archive, where
  `layout.js` held the `loading` state and conditionally rendered the spinner. Folding the
  state into the atom is the minimum-complexity Theseus placement: `layout.tsx` stays a Server
  Component and renders `<LoadingSpinner />` unconditionally; the atom removes itself (`return
null`) when ready. No new context, no new client boundary beyond the atom itself.
- Mount order mirrors the archive (spinner first in the layout). The `MenuOpenContext.Provider`
  and `<Theme>` that surrounded it in the archive are already handled elsewhere in Theseus
  (`MenuProvider` at layout level since 2.4; `next-themes` `Providers` since 1.5) — the spinner
  needs neither.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6] — the two Given/When/Then ACs
  (spinner displays while not ready (FR6); spinner removed once rendering completes).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — shell decomposition; 2.6 = the
  loading spinner, the **final** Epic 2 piece; FR6 listed under Epic 2.
- [Source: _bmad-output/planning-artifacts/epics.md#FR6] — "A loading spinner displays until the
  page is ready, then is removed."
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR4 (static
  export), AR13 (no fabricated suite), AR14 (named `'use client'` leaves), AR19
  (decision-capture DoD).
- [Source: archive/src/components/atoms/loading-spinner.js] — the **authoritative** spinner
  markup to port verbatim: the absolute full-viewport overlay (`#fafafa`, `z-index:30`), the
  2-row `6rem` grid, the `PacmanLoader color={…tertiary}` (= `#e0b404`) with `mr:2rem`, and the
  `mt:3rem` / `#04b4e0` / `700` / `18px` text block ("Zac Braddy" + `config.JOB_TITLE`). Note the
  **unconditional `darkThemeValues`** import — the always-dark behaviour Theseus deliberately
  improves on by swapping these three values for theme-reactive tokens (AC4).
- [Source: archive/src/components/layout.js:42,47–56,64–68] — the `loading` state, the
  `document.readyState === 'complete'` / `readystatechange` show-hide trigger (no cleanup), and
  `{loading && <LoadingSpinner />}` rendered first in the layout.
- [Source: src/app/layout.tsx:60–110] — the current Server-Component layout; `<LoadingSpinner />`
  mounts as the first child of `<body>` (the **only** edit). Confirms the `'use client'`-leaf
  pattern (`ThemeToggle`, `MobileMenu`, `ContentTransition`) the spinner follows.
- [Source: src/app/globals.css:10–40] — the theme tokens the spinner uses. `:root` (dark)
  `--color-bg-inverse: #fafafa`, `--color-text-tertiary: #e0b404`, `--color-text-secondary:
#04b4e0` reproduce the archive's exact dark look; the `.light` overrides
  (`#333`/`#cc715f`/`#49629c`) are what make the splash theme-reactive in light (the elected
  delta, AC4). Note: there is **no `bg-inverse` utility** here (only `bg-primary-*`,
  `bg-secondary`, `bg-tertiary`, and the `text-*`/`border-*` utilities) — use inline
  `background: var(--color-bg-inverse)`; `text-secondary` exists and is used for the text.
- [Source: src/app/providers.tsx] — `next-themes` `ThemeProvider` (dark default, `attribute=
"class"`); the spinner mounts **outside** it — its theming is pure CSS via the html
  `.light`/`.dark` class (set by next-themes' pre-paint script), not the provider context, so it
  needs no `useTheme()`.
- [Source: src/config/index.ts] — `config.JOB_TITLE = 'Contract Software Engineer'`, used for the
  spinner's second text line (config indirection).
- [Source: _bmad-output/implementation-artifacts/2-5-custom-scrollbar-with-route-change-scroll-reset.md]
  — the direct precedent: re-adding the archive's own now-modern library for byte-identical
  parity (ADR 0019), the `react-hooks/set-state-in-effect` lint gate and its
  ref/`useSyncExternalStore`-style resolution, the Server-Component-layout invariant, the ADR
  discipline (0019 → 0020), and the verification-honesty bar.
- [Source: src/components/atoms/theme-toggle.tsx + deferred-work.md (story-1.7)] — the existing
  `useSyncExternalStore` hydration-guard precedent in this codebase (the pattern the spinner's
  ready-state read should follow).
- [Source: react-spinners (npm, `0.17.0`) — registry peerDependencies] — `react`/`react-dom`
  peer `^16 || ^17 || ^18 || ^19` (React-19-supported); `import { PacmanLoader } from
'react-spinners'`; ships its own types. The archive used `^0.13.8` / `PacmanLoader`.
- [Source: _bmad-output/project-context.md] — atomic structure, kebab-case files / PascalCase
  components, Prettier law, no-comments default, config indirection, **themed-colour rule
  (honoured here via tokens — the source of the elected theme-reactive delta, AC4)**,
  no-interpolated-classnames; describes the **archive** stack — follow the Theseus artifacts
  where they diverge.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0020 capture;
  0019 is the highest existing number, 0020 is next. ADR 0019 (re-add `react-custom-scroll@7.2.0`)
  and 0018 (`vaul`) are the nearest precedents for re-adding the archive's own modern lib.

## Decision trail (resolved 2026-06-17)

All three calls are settled:

1. **Spinner mechanism — `react-spinners@0.17.0` / `PacmanLoader` (settled).** The archive's own
   library shipped a modern, React-19-supported `0.17.0`; re-adding it gives byte-identical
   parity and ports the component verbatim. Hand-rolling the Pac-Man animation or swapping in a
   different spinner was rejected (more work, less parity). This is the 2.5/2.4 precedent
   (re-add the archive's own now-modern lib). → ADR 0020(a).

2. **`readyState` trigger mechanism (settled in approach, confirm at build).** Reproduce the
   archive's show-until-`complete` behaviour, but read ready-state via `useSyncExternalStore`
   (codebase precedent: `ThemeToggle`) to avoid the error-level `react-hooks/set-state-in-effect`
   rule that bit 2.5, and to add the listener cleanup the archive omitted — behaviour preserved
   (NFR7). The literal `useState` + effect is acceptable only if lint genuinely passes. → ADR
   0020(c).

3. **Theme-reactive splash — RESOLVED: Zac elected the improvement (2026-06-17).** At creation
   this was surfaced as an open question — strict parity = the archive's **always-dark**
   white/gold/cyan splash (it imports `darkThemeValues` unconditionally), with a theme-reactive
   splash as the _optional_ polish. **Zac's call: make it theme-reactive** ("the juice is worth
   the squeeze") — a small, worthwhile improvement that won't meaningfully deviate. So the three
   colours are driven by the `var(--color-*)` tokens (`bg-inverse` / `text-tertiary` /
   `text-secondary`); the splash follows the active theme. The **dark** look is unchanged from
   the live site (the tokens' dark values are the archive hexes); **light** now shows the light
   palette instead of staying dark — the **one intended visual delta** in this story, flagged for
   the Story 4.1 gate as _expected_. Verified the implementation is flash-free and hook-free (the
   html `.light`/`.dark` class drives it pre-paint; `PacmanLoader` passes the `var(...)` straight
   into CSS). → ADR 0020(b).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-17 | Story created (ready-for-dev). Spinner mechanism resolved to `react-spinners@0.17.0` / `PacmanLoader` (ADR 0020, pending).                                                                                                                                                                       |
| 2026-06-17 | Zac elected the **theme-reactive splash** improvement over the archive's always-dark quirk — three colours now driven by `var(--color-*)` tokens (one intended delta vs the live site, dark look unchanged). Story updated: Context, AC1/AC4/AC6/AC7, Task 2/5/6, crux Dev Note, Decision trail. |

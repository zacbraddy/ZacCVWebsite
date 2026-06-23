---
baseline_commit: 41bbda4143a7ea2362c9f44bb64486c8006bf0bd
---

# Story 2.1: Persistent layout shell, content pane, and animations

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the same animated content frame to wrap every page,
so that navigating the site feels exactly as polished and consistent as it does today.

## Context & purpose (read first)

This is the **first story of Epic 2** (Persistent App Shell & Navigation) and the first UI built
in the migration. Epic 1 stood up the foundation — Next 16 + React 19.2 + TS-strict, Tailwind v4,
the CSS-variable theming + `next-themes` toggle, `next/font`, the Metadata API, GA — all proven
green on a Netlify preview. Now we build **the chrome every route shares**, inside the root
`layout.tsx`.

Epic 2 is decomposed so that **this story builds only the structural frame + the two animations**.
The other pieces of the shell are deliberately **separate, later stories** — do **not** build them
here (NFR6 anti-gold-plating):

| Shell piece                                         | Story   | Status in 2.1                        |
| --------------------------------------------------- | ------- | ------------------------------------ |
| Primary navigation + Download CV                    | **2.2** | Leave a seam in the sidebar/menu     |
| Desktop sidebar content (portrait/name/socials/nav) | **2.3** | Build the sidebar **container** only |
| Mobile burger menu + `MenuOpenContext`              | **2.4** | Not built; content renders directly  |
| Custom scrollbar + route-change scroll reset        | **2.5** | Not built; content renders directly  |
| Loading spinner                                     | **2.6** | Not built                            |

So 2.1's job: port the archive `layout.js` **outer structure** (the `<main>` → frame → sidebar
container + content pane), the **entrance fade-up animation**, and the **route-change transition
animation**, rendering `{children}` in the content pane. Everything inside the sidebar, the
scrollbar, the burger menu, the `MenuOpenContext` provider, and the spinner are **later stories that
slot into seams this story leaves** — build the layering so they insert without restructuring.

**The single source of visual/behavioural truth is the live site** (`zackerthehacker.com`) and the
archived Gatsby implementation at `archive/src/components/layout.js`. This is a zero-regression
parity port (NFR1/NFR2): the frame structure, classes, and animations must match today.

## Acceptance Criteria

1. **Persistent shell structure in the root layout (FR1).**
   **Given** the foundation from Epic 1,
   **When** the root `src/app/layout.tsx` is built,
   **Then** it wraps every route with the established structure — a `<main>` containing the centred
   frame, a left **sidebar container** (shown at `lg`+), and a **content pane** that renders
   `{children}` — matching today's layout markup and responsive behaviour (the exact Tailwind classes
   and breakpoints from `archive/src/components/layout.js` lines 86–137),
   **And** the sidebar **container** is present with its archive classes but its inner content
   (portrait, name, job title, socials, nav) is **intentionally left empty** for Stories 2.2/2.3 — no
   placeholder copy, no reinvented nav,
   **And** `layout.tsx` remains a **Server Component** (it still exports `metadata`); no `'use client'`
   is added to the layout file itself (NFR5).

2. **Entrance fade-up-in animation, ported off styled-components (FR7, FR24, AR15).**
   **Given** a page loads,
   **When** the frame first renders,
   **Then** the initial fade-up-in entrance animation plays exactly as today — the archive
   `fadeUpIn` keyframe (`transform: translateY(1rem)` → `none`, `opacity: 0` → `1`) over
   `0.5s linear 1`,
   **And** it is implemented as a **CSS Module class** carrying a CSS `@keyframes` (replacing the
   styled-components `keyframes` + `AnimatedContainer`), with **no CSS-in-JS runtime** remaining,
   **And** because this is a one-shot mount animation it needs **no `'use client'` boundary** — it is
   pure CSS applied to the server-rendered frame div.

3. **Route-change transition animation, reusing the existing tokens (FR7, FR24, AR15, NFR7).**
   **Given** the visitor navigates between routes,
   **When** the route changes,
   **Then** the per-page content-pane transition animation plays as today — the archive
   `AnimateOnChange` out→in behaviour (`animationIn="fadeInUp"`, `animationOut="bounceOut"`,
   `durationIn="100"`, `durationOut="100"`),
   **And** it is implemented behind a `'use client'` boundary (the route transition needs client state
   - `usePathname`), wrapping `{children}` in the content pane,
     **And** the existing plain-CSS animation tokens are **reused, not redefined** — the `animations`
     token map (`archive/src/components/animations.js`) and the `@keyframes` in
     `archive/src/components/atoms/animate-on-change.css` are ported across faithfully (AR15: "Existing
     plain-CSS animations port across untouched"),
     **And** the `@keyframes` are kept in a **global** (non-CSS-Module) stylesheet so the string-name
     lookups in the `animations` map still resolve (a `.module.css` would hash the keyframe names and
     silently break the animation — see Dev Notes).

4. **`AnimateOnChange` ported as a reusable atom (anti-reinvention).**
   **Given** `AnimateOnChange` is consumed by **both** this layout **and** the Home page's rotating
   job-title animation (`archive/src/pages/index.js:46`, Story 3.1),
   **When** it is ported,
   **Then** it is a single reusable atom at `src/components/atoms/animate-on-change.tsx` (TypeScript,
   `strict`-clean, function-component + hooks, `PropTypes` not needed — use TS prop types), preserving
   **both** its modes: the keyframe-animation mode (used by the layout, `className` + `animationIn/Out`
   given) and the opacity-transition fallback mode (used by Home, no `className`),
   **And** Story 3.1 will **reuse** this atom rather than re-implement it.

5. **Idiomatic-Next boundaries, no new dependencies (NFR5, NFR6).**
   **Given** the Server/Client boundary discipline,
   **When** the shell is built,
   **Then** Server Components are the default and only the route-transition wrapper is a `'use client'`
   leaf (the entrance animation and the sidebar/content structure stay on the server),
   **And** **no new runtime dependency is added** — `AnimateOnChange` is hand-ported (no
   `react-animate-on-change`/`react-custom-scroll`/`react-burger-menu` — those belong to 2.4/2.5),
   **And** no `styled-components` is reintroduced (FR24).

6. **Build green; parity verified locally; scope held (NFR1/NFR2/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TS strict, no `any`, no lint errors), the build stays a pure static export,
   **And** the entrance animation and route-change transition are verified visually against the live
   site in **both themes** (dark + light) on **desktop and mobile** (incl. the custom `xs: 410px`
   breakpoint),
   **And** none of the deferred shell pieces (nav, sidebar content, scrollbar, burger menu, spinner)
   are built in this story.

7. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious calls in this story are made,
   **Then** they are recorded in a new ADR (next free number **0015**), indexed in
   `docs/decisions/README.md`: specifically (a) refining AR14's "entrance-animation wrapper is a client
   leaf" — the entrance animation is realised as **pure CSS on the server frame**, with only the
   route-transition as the client leaf; (b) the **global-vs-module CSS** split for the ported keyframes;
   (c) the route-transition **trigger** approach chosen in AC3 (children-driven faithful port and/or
   `usePathname`), with its rationale.

## Tasks / Subtasks

- [x] **Task 1 — Port the animation token map to TypeScript** (AC: #3, #4)
  - [x] Create `src/components/animations.ts` porting `archive/src/components/animations.js` verbatim:
        the `easings` map and the `animations` map (named `export const` — matches existing module
        conventions). Same cubic-bezier values, same animation shorthand strings (`fade-in-up 800ms …`,
        `pop-out 300ms …`, etc.). No behavioural change; just `.js` → `.ts`.
  - [x] These strings reference keyframe **names** (`fade-in`, `fade-in-up`, `pop-in`, `pop-out`,
        `slide-in`, `slide-out`) — those keyframes live in the global CSS from Task 2. Keep the names
        identical.
- [x] **Task 2 — Port the route-transition keyframes as a global stylesheet** (AC: #3)
  - [x] Create `src/components/atoms/animate-on-change.css` porting
        `archive/src/components/atoms/animate-on-change.css` verbatim (the six `@keyframes`: `fade-in`,
        `fade-out`, `fade-in-up`, `pop-in`, `pop-out`, `slide-in`, `slide-out`).
  - [x] **Critical:** this MUST be a **plain global `.css`** (imported as a side-effect), **not** a
        `.module.css`. CSS Modules hash `@keyframes` names, which would break the literal-string lookups
        in `animations.ts` (`animations['fadeInUp']` → `'fade-in-up 800ms …'`). Import it once — either
        in the `animate-on-change.tsx` atom (`import './animate-on-change.css'`) or in `globals.css`.
- [x] **Task 3 — Port `AnimateOnChange` as a reusable client atom** (AC: #3, #4)
  - [x] Create `src/components/atoms/animate-on-change.tsx` with `'use client'` at the top, porting the
        archive component (`archive/src/components/atoms/animate-on-change.js`) faithfully: the
        `useState`/`useEffect`/`useRef` out→in state machine, the `firstUpdate` guard (don't animate on
        first render), the `onTransitionEnd`/`onAnimationEnd` → `showDisplayContent` swap, and **both**
        styling modes (keyframe mode when `className` given; opacity-transition mode otherwise).
  - [x] Type the props in TS (`children: React.ReactNode`, `className?`, `animation?`, `animationIn?`,
        `animationOut?`, `durationIn?`, `durationOut?`, `style?`) — no `any`. Replace the legacy
        `defaultProps` with a default parameter (`durationOut = 200`) — React 19 deprecates `defaultProps`
        on function components.
  - [x] Look up tokens from the `src/components/animations.ts` `animations` map (`animations[animationIn]
|| animationIn`), mirroring the archive logic exactly.
- [x] **Task 4 — Create the layout CSS Module (structure + entrance animation)** (AC: #1, #2)
  - [x] Create `src/components/layout.module.css` (or co-locate next to the shell component you choose
        in Task 5) porting `archive/src/components/layout.module.css`: `.container` (`max-height: 80%`;
        `85%` at `min-width: 640px`) and `.hero` (`margin-right: -1rem; padding-right: 1rem` at
        `min-width: 1024px`).
  - [x] Add an `.animatedContainer` class with the **entrance** keyframe (replacing the styled-components
        `fadeUpIn` + `AnimatedContainer`):
        `@keyframes fadeUpIn { from { transform: translateY(1rem); opacity: 0 } to { transform: none;
opacity: 1 } }` and `.animatedContainer { animation: fadeUpIn 0.5s linear 1 }`. This keyframe
        **can** live in the module (it is referenced by the `animation` property within the same file, so
        CSS-Module name-hashing is consistent) — unlike the Task 2 keyframes which are looked up by string.
- [x] **Task 5 — Build the persistent shell in `layout.tsx`** (AC: #1, #2, #3, #5)
  - [x] Port the archive `<main>` frame structure (`archive/src/components/layout.js:86–137`) into the
        root layout, rendering inside the existing `<Providers>` / after `<ThemeToggle />`. Keep
        `layout.tsx` a **Server Component** (no `'use client'`). Preserve the archive Tailwind classes
        verbatim on each element: - `<main className="p-2 h-screen">` - centring div: `className="h-full lg:flex lg:items-center font-sans xl:mx-auto"` - frame div (entrance + max-height): `${styles.animatedContainer} ${styles.container} transition
h-full pt-4 lg:pt-0 lg:flex lg:flex-grow lg:mx-auto max-w-screen-lg xl:max-w-screen-xl` - sidebar **container** (empty inner — 2.2/2.3 seam): `${styles.hero} flex flex-col items-center
rounded-l lg:grid lg:grid-rows-2 lg:pt-16 lg:gap-0 lg:flex-grow-0 lg:w-72 lg:bg-primary-200
lg:overflow-hidden` - content pane: `pt-16 mb-4 mx-auto bg-primary-400 rounded h-full max-w-screen-md overflow-hidden
sm:mb-2 md:pt-24 lg:flex-grow lg:pt-0 xl:max-w-screen-lg`
  - [x] Inside the content pane, wrap `{children}` with the ported `AnimateOnChange`:
        `<AnimateOnChange className="h-full w-full" animationIn="fadeInUp" animationOut="bounceOut"
durationIn="100" durationOut="100">{children}</AnimateOnChange>` (matches archive line 111–117).
  - [x] **Leave the layering seams** so later stories insert without restructuring: 2.5 will wrap
        `{children}` in `<Scrollbar>`, 2.4 will wrap in `<MenuOpenContext.Provider>` — i.e. the eventual
        nesting is `AnimateOnChange > Scrollbar > MenuOpenContext.Provider > {children}`. For 2.1,
        `{children}` sits directly inside `AnimateOnChange`.
  - [x] **Route-change trigger:** ensure the content-pane transition fires on navigation. Prefer the
        idiomatic-Next signal — read `usePathname()` from `next/navigation` inside the `'use client'`
        boundary and use it to drive the transition (e.g. as the change-detection input / a `key`),
        rather than relying solely on `children` reference identity. See Dev Notes "Route-change trigger"
        for the pitfall and the recommended wiring; capture the choice in the ADR (Task 7).
- [x] **Task 6 — Verify (build, lint, visual parity)** (AC: #6)
  - [x] `npm run build` → green, pure static export (no functions). `npm run lint` → clean. `npm run
format`. Record exact outputs in the Dev Agent Record → Debug Log.
  - [x] **Entrance animation:** `npm run dev`, load a page, confirm the frame fades up-in identically to
        the live site, both themes.
  - [x] **Route-change transition:** this needs ≥2 navigable routes; only `/` exists today. Add a
        **throwaway** placeholder route (e.g. `src/app/__parity-check/page.tsx`) purely to click between,
        confirm the content-pane out→in transition matches today, then **remove it** before finishing
        (do not commit it). If you prefer not to add a temp route, wire the mechanism faithfully and note
        that full route-transition visual verification lands once Epic 3 adds real pages + the Story 4.1
        gate — but a temp-route check now is strongly preferred to de-risk the trigger wiring.
  - [x] Verify on desktop and mobile widths incl. `xs: 410px`. Do **not** run `npm test` (stub — AR13).
- [x] **Task 7 — Decision capture** (AC: #7)
  - [x] Create `docs/decisions/0015-<short-title>.md` from `docs/decisions/_template.md` (Status:
        Accepted, Tags: `theseus, animations`/`layout`) capturing: (a) entrance animation as pure CSS on
        the server frame (refining AR14's client-leaf assumption — only the route transition is client);
        (b) the global-vs-module CSS split for the ported keyframes (and why module-scoping would break
        the string lookups); (c) the route-change trigger approach chosen and why.
  - [x] Add the 0015 row to the ADR index table in `docs/decisions/README.md`.
  - [x] If any genuinely-deferrable hardening surfaces, log it in
        `_bmad-output/implementation-artifacts/deferred-work.md` (do not gold-plate it in).

## Dev Notes

### What this story changes (small, structural surface)

- **New:** `src/components/animations.ts`, `src/components/atoms/animate-on-change.css`,
  `src/components/atoms/animate-on-change.tsx`, `src/components/layout.module.css`,
  `docs/decisions/0015-…md`.
- **Modified:** `src/app/layout.tsx` (add the `<main>` shell + `AnimateOnChange` around `{children}`),
  `docs/decisions/README.md` (index 0015), `_bmad-output/implementation-artifacts/sprint-status.yaml`
  (story status).
- **Not touched:** theming/tokens (Epic 1, `globals.css`), the `ThemeToggle`, fonts/metadata/GA. Do not
  re-open Epic 1 work.

### Current state of `src/app/layout.tsx` (read before editing)

It is a **Server Component** that exports `metadata`, sets up `next/font`, FontAwesome CSS, renders
`<Providers>` (the `next-themes` `'use client'` wrapper), `<ThemeToggle />`, `{children}`, and
`<GoogleAnalytics />`. The shell `<main>` goes **inside `<Providers>`, around `{children}`** — i.e.
`<Providers><ThemeToggle /><main>…<AnimateOnChange>{children}</AnimateOnChange>…</main></Providers>`.
Keep `<ThemeToggle />` where it is (it's the fixed top-left toggle; do not move it into the frame).
`layout.tsx` must stay server-side — pushing it to `'use client'` would break the `metadata` export and
violate NFR5.

### The two animations are DIFFERENT — port both, don't conflate

- **Entrance (`fadeUpIn`)** — archive `layout.js:20–34`, the styled-components `keyframes` +
  `AnimatedContainer`. `translateY(1rem)` → `none`, `opacity 0` → `1`, `0.5s linear 1`. One-shot on
  mount. → **CSS Module class `.animatedContainer`** (Task 4). **Pure CSS, no client needed.**
- **Route transition (`AnimateOnChange`)** — archive `layout.js:111–133`, the `AnimateOnChange` atom
  driven by `animations['fadeInUp']` (`fade-in-up 800ms easeOutExpo forwards`) /
  `animations['bounceOut']` (`pop-out 300ms easeInBack forwards`). Out→in state machine. → **reusable
  `'use client'` atom** (Task 3) using the global keyframes (Task 2) + tokens (Task 1).

Note the `fadeUpIn` entrance keyframe (`translateY(1rem)`) is **distinct** from the `fade-in-up`
route-transition keyframe (`translateY(10em)`, in `animate-on-change.css`). Keep them separate; do not
merge or "dedupe" them.

### CSS Modules + `@keyframes` — the silent-break gotcha (critical)

`animations.ts` looks up keyframes by **literal string name** at runtime (`animations[animationIn]`
returns e.g. `'fade-in-up 800ms cubic-bezier(...) forwards'`). CSS Modules **hash `@keyframes` names**
(`fade-in-up` → `fade-in-up_abc123`), so if you put those keyframes in a `.module.css`, the string
`'fade-in-up'` in the animation shorthand will reference a non-existent keyframe and the animation will
**silently do nothing** (no error, no console warning) — a parity regression that visual diffing
(Story 4.1) would catch late. Therefore: **route-transition keyframes → global `.css`** (Task 2). The
**entrance** keyframe is safe in the module because it's referenced by the `animation` property inside
the same module file (CSS Modules rewires same-file keyframe references correctly).

### Route-change trigger — pitfall + recommended wiring

The archive `AnimateOnChange` fires its out→in effect on `[children]` change. In Gatsby that worked
because the layout only re-rendered on its own state changes, so `children`'s reference was stable
within a route and changed on navigation. In the **Next App Router**, the root layout's `{children}`
is the active page segment; it is a new element per route, but you should **not** rely on bare
reference-identity diffing for the route signal (parent re-renders can churn the reference). The
idiomatic, reliable signal is **`usePathname()` from `next/navigation`** (client-only).

Recommended: in the `'use client'` boundary that hosts the content-pane transition, read
`const pathname = usePathname()` and use it to drive the transition — e.g. trigger the out→in cycle
when `pathname` changes, or pass `key={pathname}`/the pathname into the change-detection. Keep
`AnimateOnChange` itself **generic** (children/value-driven) so the Home page (Story 3.1) can reuse it
for the job-title rotation (a non-route change); add the `usePathname` wiring at the **layout call
site**, not inside the atom. Capture the exact approach in ADR 0015 (AC7).

### Server/Client boundary (NFR5, AR14)

- `layout.tsx` — **Server** (exports `metadata`). Renders the `<main>` frame and the sidebar/content
  structure server-side.
- Entrance animation — **Server** (pure CSS class). AR14 lists "the entrance-animation wrapper" as a
  client leaf, but the entrance is a one-shot CSS animation needing no JS; realising it as server CSS is
  the more idiomatic call and is the kind of refinement AR14 anticipates ("Built Next-native, not a 1:1
  Gatsby port"). Record this in the ADR.
- Route-transition (`AnimateOnChange` + `usePathname`) — **`'use client'` leaf.** A client component can
  receive server-rendered `children` as a prop, so `<AnimateOnChange>{children}</AnimateOnChange>` does
  **not** force the pages to be client components — the canonical pattern. The pages stay server-renderable.

### Scope seams for later Epic 2 stories (do NOT build now)

The eventual content-pane nesting (for reference, so you leave room): `AnimateOnChange` → `Scrollbar`
(2.5) → `MenuOpenContext.Provider` (2.4) → `{children}`. For 2.1, `{children}` is the direct child of
`AnimateOnChange`. The sidebar container is built **empty**; 2.3 fills it (portrait/name/job-title via
`config.JOB_TITLE`/socials), 2.2 builds the shared `NavLinks`. The burger menu (2.4), spinner (2.6),
and the `setCurrentScrollPos(Math.random())` route-change scroll reset (2.5) are all **out of scope** —
do not stub or pre-build them. `react-custom-scroll` / `react-burger-menu` are **not** in
`package.json` and must **not** be added here.

### Preserve quirks verbatim (NFR7)

This story does not touch the intentional quirks (scroll-reset `Math.random()` is 2.5; email
obfuscation and rotating titles are Epic 3). Just don't "tidy" the archive animation easings or
durations — port the cubic-beziers and `forwards` fill modes exactly.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** `AnimateOnChange` is an **atom** (`src/components/atoms/`); `animations.ts` is a
  shared module under `src/components/`; the layout shell lives in `src/app/layout.tsx` (App Router) with
  its CSS Module co-located. Filenames **kebab-case**, component identifiers **PascalCase**.
- **TypeScript strict, no `.js` source** (AR2) — all new files are `.ts`/`.tsx`. Use TS prop types, not
  `PropTypes` (project-context.md mentions PropTypes for the **archive** JS stack; the Theseus rebuild is
  TS — follow the Theseus artifacts where they diverge, as Story 1.7 notes).
- **Prettier is law** (`^3.8.4`): single quotes, `arrowParens: avoid` (`arg => …`). Run `npm run format`.
- **No code comments by default** (and global rule: don't leave "removed code" comments).
- **British spelling** in any user-facing copy/comments (none expected here); keep CSS/JS identifiers
  canonical (`color`, `center`).
- **Themed colours only** — the archive classes used (`bg-primary-200`, `bg-primary-400`) are already
  mapped to `--color-*` tokens in `globals.css` (`@utility bg-primary-200`/`bg-primary-400`). Do not
  hardcode hex; do not construct class names by interpolation (PurgeCSS/Tailwind-scan parity — write
  static class strings).

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not run it as a test, do not invent a
suite**. Verification is: `npm run build` green + pure static export, `npm run lint` clean, and **manual
visual parity** against the live site (entrance + route transition, both themes, desktop + mobile incl.
`xs: 410px`). Record real command outputs in the Dev Agent Record; do not claim parity you haven't
visually checked.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — the three Given/When/Then ACs.
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — shell decomposition (2.1–2.6 split).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR14 (Server/Client
  boundary; entrance-animation + route transition as client leaves), AR15 (styled-components removal:
  `keyframes`+`AnimatedContainer` → CSS Module + `'use client'` wrapper; `animations.js`/
  `animate-on-change.css` port across untouched), AR8 (`useLocation` → `usePathname`), AR13 (tooling).
- [Source: archive/src/components/layout.js] — the master structure (lines 86–137), `fadeUpIn` keyframe
  - `AnimatedContainer` (20–34), the `AnimateOnChange` content-pane usage (111–133).
- [Source: archive/src/components/animations.js] — `easings` + `animations` token maps to port (Task 1).
- [Source: archive/src/components/atoms/animate-on-change.css] — the six `@keyframes` to port (Task 2).
- [Source: archive/src/components/atoms/animate-on-change.js] — the `AnimateOnChange` atom to port (Task 3).
- [Source: archive/src/components/layout.module.css] — `.container` / `.hero` classes (Task 4).
- [Source: archive/src/pages/index.js:46] — the **second consumer** of `AnimateOnChange` (Home rotating
  titles, Story 3.1) — confirms it must be a reusable atom.
- [Source: src/app/layout.tsx] — current root layout (Server Component; `metadata`; `<Providers>` +
  `<ThemeToggle />`) the shell is added into.
- [Source: src/app/globals.css] — themed `@utility` tokens (`bg-primary-200`/`bg-primary-400`) the shell
  classes resolve against; do not modify here.
- [Source: docs/decisions/0004-remove-styled-components.md] — the SC-removal decision this story executes
  for the layout animations.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0015 capture (Task 7).
- [Source: _bmad-output/implementation-artifacts/1-7-…preview.md] — prior story; quality/format bar,
  Theseus-vs-archive divergence note, decision-capture discipline.
- [Source: _bmad-output/project-context.md] — JS/TS rules, Prettier law, atomic structure, themed-colour
  - no-interpolated-classnames rules (describes the **archive** stack; follow Theseus artifacts where they
    diverge).

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Claude Code, bmad-dev-story workflow).

### Debug Log References

- `npm run format` → all source files **unchanged** (already Prettier-conformant on creation).
- `npm run lint` → clean (no output; ESLint exit 0).
- `npm run build` → green:
  - `✓ Compiled successfully in 2.1s`
  - `Finished TypeScript in ~1.8s` (strict, no `any`)
  - `✓ Generating static pages (4/4)`
  - Routes: `○ /`, `○ /_not-found`, `○ /icon.svg` — all `○ (Static) prerendered as static content`;
    `output: 'export'` in `next.config.ts` confirms pure static export (no functions).
- **Route-transition wiring de-risk (temp route):** added a throwaway `src/app/parity-check/page.tsx`
  with a `<Link>` back to `/`, ran `npm run dev`, and confirmed via server-rendered HTML that:
  - `/` → HTTP 200, shell markers present server-side (`p-2 h-screen`, `bg-primary-400` ×2, hashed
    `animatedContainer…` class on the frame div).
  - `/parity-check` → HTTP 200, page content renders **inside the persistent shell** with the
    `AnimateOnChange` wrapper (`h-full w-full`) present.
  - Dev log error-free. Note: Next treats `_`-prefixed folders as **private/non-routable**, so the
    story's suggested `__parity-check` name 404s — used `parity-check` instead.
  - Temp route **removed** before finishing (not committed); final clean `npm run lint` + `npm run build`
    re-run green without it.

### Completion Notes List

- **AC1 (persistent shell, Server Component):** `<main>` frame ported verbatim from
  `archive/src/components/layout.js:86–137` into `src/app/layout.tsx`, inside `<Providers>` after
  `<ThemeToggle />`. Sidebar **container** rendered with its archive classes but **empty inner** (2.2/2.3
  seam — no placeholder copy). `layout.tsx` stays a Server Component (still exports `metadata`; build
  proves no `'use client'` regression).
- **AC2 (entrance animation):** `fadeUpIn` ported off styled-components to a CSS Module class
  `.animatedContainer` in `src/components/layout.module.css` (`translateY(1rem)→none`, `opacity 0→1`,
  `0.5s linear 1`). Pure CSS on the server frame — no client boundary, no CSS-in-JS runtime.
- **AC3 (route transition):** keyframes ported verbatim to a **plain global** `animate-on-change.css`
  (not a module — preserves the literal-string `@keyframes` lookups), tokens ported verbatim to
  `animations.ts`. Transition driven by `usePathname()` in the `'use client'` wrapper.
- **AC4 (reusable atom):** `AnimateOnChange` ported faithfully to `src/components/atoms/animate-on-change.tsx`
  (TS strict, both styling modes, `firstUpdate` guard, out→in state machine). `defaultProps` replaced with
  default param `durationOut = 200`. Kept generic for Story 3.1 reuse — route wiring lives at the call site.
- **AC5 (boundaries / no new deps):** only the route-transition wrapper is `'use client'`; entrance +
  structure stay server-side. No new runtime dependency added; no styled-components reintroduced
  (`package.json` untouched).
- **AC7 (decision capture):** ADR `0015-layout-shell-animations-server-css-and-route-transition.md` created
  (entrance-as-server-CSS refining AR14; global-vs-module CSS split; `usePathname` trigger with the
  `key`-on-inner-div rationale) and indexed in `docs/decisions/README.md`.
- **Design note — extra file vs the Dev Notes "surface" list:** the story listed `layout.tsx` as the only
  modified source file, but `layout.tsx` must stay a Server Component and `usePathname` is client-only.
  Added one thin client wrapper `src/components/molecules/content-transition.tsx` to host the
  `usePathname`-driven `AnimateOnChange` at the layout call site (atom stays generic). This is the minimal
  way to satisfy AC3 + AC5 + AC1 together; rationale captured in ADR 0015.
- **`durationIn`:** accepted in the atom's prop type but unused — faithful to the archive, which also
  declared it on the call but never consumed it.
- **AC6 — visual parity status (read this):** objective gates done — build green + pure static export,
  lint clean, format clean, and the server-rendered shell/animation wiring verified (entrance class on the
  frame, `AnimateOnChange` wrapping content on every route, route navigation through the shell).
  The animation **values** are parity-correct **by construction** (verbatim port from the archive, which is
  the live site's source). The one outstanding item is the **subjective live-site eyeball** (entrance +
  out→in transition compared against `zackerthehacker.com` in **both themes** on **desktop + mobile incl.
  `xs:410px`**) — not performed in this headless session, and **not claimed**. Recommend Zac eyeball it via
  `npm run dev`; per the story's stated fallback, full route-transition visual verification otherwise lands
  at the Story 4.1 parity gate once Epic 3 adds real pages.
- **Scope held:** no nav, sidebar content, scrollbar, burger menu, spinner, or `MenuOpenContext` built
  (2.2–2.6). `react-custom-scroll`/`react-burger-menu` not added.

### File List

**New:**

- `src/components/animations.ts`
- `src/components/atoms/animate-on-change.css`
- `src/components/atoms/animate-on-change.tsx`
- `src/components/molecules/content-transition.tsx`
- `src/components/layout.module.css`
- `docs/decisions/0015-layout-shell-animations-server-css-and-route-transition.md`

**Modified:**

- `src/app/layout.tsx` (added the `<main>` shell + `ContentTransition` wrapping `{children}`)
- `docs/decisions/README.md` (indexed ADR 0015)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (story status → in-progress → review)
- `_bmad-output/implementation-artifacts/2-1-persistent-layout-shell-content-pane-and-animations.md`
  (frontmatter `baseline_commit`, task checkboxes, Dev Agent Record, status)

## Change Log

| Date       | Change                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-06-15 | Story created (ready-for-dev).                                                                             |
| 2026-06-15 | Implemented shell + entrance/route animations off styled-components; ADR 0015; build/lint green. → review. |

## Review Findings

_Code review 2026-06-15 (bmad-code-review). All three layers ran — Blind Hunter, Edge Case Hunter, Acceptance Auditor. Acceptance Auditor: all seven ACs met; verbatim-port claims verified against `archive/`. 5 findings dismissed as faithful-parity noise._

- [x] [Review][Patch][Applied 2026-06-15] Bubbling guard on `AnimateOnChange` end-handlers — `onAnimationEnd`/`onTransitionEnd` sat on the wrapper `<div>` with no `e.target === e.currentTarget` guard, so animation/transition-end events from descendant elements bubbled up and could call `showDisplayContent`. **Resolved (Zac's call): applied the guard now** — `showDisplayContent` takes the event and early-returns when `event.target !== event.currentTarget`, so only the wrapper's own out-animation drives the swap. A conscious, justified divergence from the strict verbatim archive port (invisible to the Story 4.1 visual-diff gate; prevents a confusing Epic 3 bug once routes + the deferred `<Scrollbar>` exist). Lint + build re-verified green, pure static export. [src/components/atoms/animate-on-change.tsx]
- [x] [Review][Patch][Applied 2026-06-15] **AC1 — portal frame not centred on screen (real parity regression, fixed).** Zac's eyeball caught that the whole shell (sidebar + content pane) was pinned top-left instead of centred as on the live site. Root cause confirmed against the compiled CSS: `src/app/globals.css` carried the create-next-app starter reset `* { margin: 0; padding: 0 }` (plus the `html`/`body`/`a` rules) written **outside any `@layer`**, while Tailwind v4 emits `lg:mx-auto` (`margin-inline: auto`) **inside `@layer utilities`**. Unlayered rules beat layered ones regardless of specificity, so `margin: 0` overrode the frame's auto-margins → `lg:flex-grow` grew it to `max-w-screen-xl` with all slack on the right → left-pinned. It was also silently killing `mb-4`/`mr-3.5`/`mx-auto` site-wide (same cascade-layer hazard logged in `deferred-work.md` story 1.4). **Fix (Zac's call — fix in 2.1):** wrapped the bare `html`/`html,body`/`body`/`body::before`/`*`/`a` rules in `@layer base` so Tailwind utilities win. Verified in compiled CSS: the `*{margin:0;padding:0}` reset now sits inside `@layer base` (depth 1) and `margin-inline:auto` in `@layer utilities` (later layer wins). Build + lint re-run green, pure static export. This also resolves the story-1.4 deferred cascade-layer item. [src/app/globals.css]
- [x] [Review][Decision][Resolved 2026-06-15] AC6 visual sign-off — **Zac reloaded and confirmed the centring fix resolves all raised issues; frame centres correctly in both themes.** Benign, deferred-scope deltas remain expected (untouched Next starter home → Story 3.1; the "N" dev-mode badge is dev-only / absent from the static export; theme-toggle position is pre-existing Story 1.5). Full populated-frame + route-transition confirmation lands at the Story 4.1 parity gate. [AC6]
- [x] [Review][Defer] Rapid-navigation out→in handshake can drop or mis-time the content swap [src/components/atoms/animate-on-change.tsx] — deferred, pre-existing. The state machine assumes exactly one out-animation completes per navigation; bursting B→C while A's `pop-out` is mid-flight can latch stale content or swap on the wrong event. Byte-identical to the archive logic (not introduced here) and only reachable once Epic 3 adds multiple routes + fast navigation.

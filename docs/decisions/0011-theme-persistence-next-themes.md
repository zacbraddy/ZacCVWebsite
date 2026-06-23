# 0011 — Theme persistence via `next-themes`

- **Status:** Accepted
- **Date:** 2026-06-12
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, theming, next-themes

## Context

The archived Gatsby site's theme toggle was component-local `useState`
(`archive/src/components/theme.js`): it defaulted to dark and reset to dark on every reload —
the choice never persisted. The migration's single accepted _functional_ change versus the
live site (FR10) is to make that choice persist. ADR 0004 removed styled-components and
ADR 0010 laid the palettes into `globals.css` (`:root`=dark, `.light`=light) pinned to a
`class`-attribute toggle. This story wires the runtime that drives that class — and several
non-obvious calls had to be made to do it flicker-free under static export (`output: 'export'`)
without reintroducing a CSS-in-JS runtime.

## Decision

Integrate `next-themes` via a `'use client'` `Providers` boundary (`src/app/providers.tsx`)
wrapping `{children}` in the root layout, with exactly:

1. **`attribute="class"`** — writes `class="dark"`/`class="light"` on `<html>`, confirming the
   forward-pin ADR 0010 made (not `data-theme`). The `.light` selector from 1.4 is consumed
   unchanged; no `globals.css` edit.
2. **`defaultTheme="dark"`** — first-visit default stays dark (FR10, parity), matching the
   archive's `useState(DARK)`.
3. **`enableSystem={false}`** — set **explicitly** because `next-themes` defaults it to `true`;
   without it the OS `prefers-color-scheme` would be auto-adopted, breaking FR10's no-adopt
   stance. A light-OS first-time visitor still gets dark.
4. **Persistence ON** — `next-themes` persists the choice to `localStorage` (key `theme`) by
   default. This is the one intended behaviour change versus Gatsby.
5. **`enableColorScheme` left at its default (on)** — `next-themes` injects
   `style="color-scheme: dark|light"` on `<html>`. Gatsby set no `color-scheme`, but not by
   design — it simply predated/ignored the feature. The Theseus protocol is explicit that we do
   **not** dogmatically reproduce Gatsby's non-choices. The test: does `color-scheme` conflict
   with anything we port? It does not — the only styled scrolling surface is the content pane
   (`react-custom-scroll`, custom DOM, ported in Story 2.5, untouched by `color-scheme`) and the
   site has no form controls. So it is left on as pure upside: browser canvas / any native
   scrollbar align with the active theme — a nicety Gatsby never had.
6. **`disableTransitionOnChange`** — kept on (harmless, conventional) to suppress any CSS
   transition flash when the class flips.
7. **Pre-hydration script + `suppressHydrationWarning`** — `next-themes` emits a blocking
   `<script>` into the static HTML that sets the `<html>` class before first paint, so there is
   no flash of the wrong **palette** (AR18). `suppressHydrationWarning` on `<html>` stops React
   warning about the script-mutated `class`/`style`. This closes the two items the Story 1.4
   review deferred here (no `.dark`/class hook; no FOUC/pre-hydration guard).
8. **No mounted-gate on the toggle.** The toggle renders its icon from a stable
   `undefined`→moon default (`resolvedTheme === 'light' ? faSun : faMoon`). `resolvedTheme` is
   `undefined` on both the static build and the first client render, so both produce **moon** —
   no hydration-mismatch warning — and moon is the correct dark-default first paint. Returning
   light-mode visitors see a small moon→sun icon flip on mount. Zac's call (2026-06-12): that
   small flip is **acceptable**; a `mounted` flag / skeleton would be complexity bought to
   suppress a flash we've accepted, against the minimum-necessary-complexity guideline. The
   **palette** never flashes regardless (the pre-hydration script guarantees that); only the
   React-rendered glyph corrects on mount.

## Consequences

- The toggle's source of truth becomes `next-themes`' `useTheme()` (persisted) instead of local
  `useState` (ephemeral) — the FR10 change, delivered with full palette parity otherwise.
- Works under `output: 'export'` with no SSR/serverless: the inline script is emitted into the
  static HTML and runs before hydration (verified — the `("class","theme","dark",…,false,true)`
  initialiser is present in `out/index.html`).
- The build is pinned to `attribute="class"`. If a future need forces `data-theme`, both this
  ADR and ADR 0010's `.light` selector must change together.
- Returning light-mode visitors get an accepted, non-blocking moon→sun icon flip on mount.
- This realises the inherited "theme persistence ON" closed decision recorded by pointer in
  `docs/decisions/README.md`.

## Alternatives considered

- **A `mounted`-gate / placeholder on the toggle** — rejected: adds ceremony to suppress an
  icon flip Zac accepted; the stable `undefined`→moon default already removes the hydration
  warning with less code.
- **`enableColorScheme={false}` to match Gatsby's absence of `color-scheme`** — rejected:
  dogmatic parity with a Gatsby non-choice that conflicts with nothing we port; leaving it on is
  pure upside (Theseus idiomatic-Next protocol).
- **`enableSystem` left at its `true` default** — rejected: would auto-adopt the OS scheme,
  violating FR10.
- **A hand-rolled localStorage + inline FOUC script** — rejected: `next-themes` is the decided
  mechanism (FR10 / PRD addendum) and ships the flicker-free pre-hydration script for free.

_Related: [0004](0004-remove-styled-components.md) (replaces the `createGlobalStyle` `theme`-prop
mechanism), [0010](0010-css-variable-theming-token-system.md) (the `.light` class hook this
consumes), [0012](0012-fontawesome-introduction.md) (the toggle's icon system)._

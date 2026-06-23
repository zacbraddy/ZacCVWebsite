# 0020 — Loading spinner on `react-spinners@0.17.0` / `PacmanLoader`, with a theme-reactive splash and a `useSyncExternalStore` ready-state trigger

- **Status:** Accepted
- **Date:** 2026-06-17
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, spinner, dependencies

## Context

Story 2.6 ports the last Epic 2 shell piece (FR6): the full-viewport loading overlay that
covers the page on initial load and is removed once the document is ready. The archive
(`archive/src/components/atoms/loading-spinner.js`, `archive/src/components/layout.js:42,47–56,64–68`)
renders an animated **Pac-Man** spinner above "Zac Braddy" + the job title, on a near-white
panel at `z-index: 30`, driven by `react-spinners@^0.13.8`. Three non-obvious calls had to be
made: which spinner mechanism to use, whether to reproduce the archive's always-dark splash or
make it theme-reactive, and how to reproduce the `readyState` show/hide trigger without tripping
the project's error-level `react-hooks/set-state-in-effect` ESLint rule.

## Decision

**(a) Spinner mechanism — re-add the archive's own library at its modern release.** Use
**`react-spinners@^0.17.0`** and its **`PacmanLoader`** as the only new direct dependency,
ported into a self-contained `'use client'` atom (`src/components/atoms/loading-spinner.tsx`).
`0.17.0`'s peer range is `react`/`react-dom` `^16 || ^17 || ^18 || ^19` (React-19-supported);
it ships its own types and installs cleanly with no `--legacy-peer-deps`.

**(b) Theme-reactive splash — the elected improvement (Zac's call, 2026-06-17).** The archive
imports `darkThemeValues` and uses it **unconditionally**, so a light-theme visitor still gets
the white/gold/cyan dark splash today. Theseus instead drives the three colours from the
project's `var(--color-*)` tokens — `var(--color-bg-inverse)` (background),
`var(--color-text-tertiary)` (Pac-Man), `var(--color-text-secondary)`/the `text-secondary`
utility (text) — so the splash follows the active theme. This is the **one intended visual
delta** in the story ("the juice is worth the squeeze").

**(c) Ready-state trigger — `useSyncExternalStore`, not `useState` + effect.** The atom owns its
own visibility: `subscribe` adds/removes the `readystatechange` listener, `getSnapshot` returns
`document.readyState === 'complete'`, `getServerSnapshot` returns `false` (overlay present during
prerender). When ready, the atom returns `null` (removed from the DOM). `layout.tsx` renders
`<LoadingSpinner />` unconditionally as the first child of `<body>` and stays a Server Component.

**(d) Pac-Man keyframes defined statically in `globals.css` (the animate-at-first-paint fix).**
`react-spinners` injects its `@keyframes` into `document.head` only at **runtime, client-side**
(`createAnimation` in the lib). But the splash that is actually visible on a static export is the
**prerendered HTML** (first paint, before any JS) — and on a fast static page the spinner is
removed (`readyState === 'complete'`) at essentially the same instant the client JS would inject
those keyframes, so the visible Pac-Man never animates (it is frozen, then vanishes). The three
keyframes (`react-spinners-PacmanLoader-pacman-1`/`-pacman-2`/`-ball`) are therefore declared
statically in `globals.css` — the lib's inline styles already reference those exact names, so the
prerendered splash animates from first paint with no JS dependency. This is a **deliberate edit to
`globals.css`**, a narrow deviation from the story's stated "no `globals.css` edits" scope (AC5),
accepted because without it the animation does not reproduce the live site (FR6/NFR1).

## Consequences

- One new direct dependency (`react-spinners ^0.17.0`); the build stays a **pure static export**
  (routes `○ (Static)`, no `.func`), and the overlay markup is prerendered into `out/index.html`
  (the splash is in the first paint, as it should be).
- **Byte-identical dark look for free.** The token `:root` (dark) values _are_ the archive hexes
  (`--color-bg-inverse: #fafafa`, `--color-text-tertiary: #e0b404`, `--color-text-secondary:
#04b4e0`), so dark theme reproduces the live site exactly; only **light** theme differs (the
  `.light` palette `#333` / `#cc715f` / `#49629c`).
- **The themed-colour rule and the improvement are the same act.** Honouring "themed colours
  only / no raw hex in components" (project-context) is precisely what makes the splash
  theme-reactive — the more idiomatic implementation is also the improved one. No literal hexes
  in the atom; the background uses an inline `style={{ background: 'var(--color-bg-inverse)' }}`
  (no new `globals.css` utility, as there is no `bg-inverse` utility — minimum complexity, NFR6).
- **Flash-free, hook-free theming.** next-themes sets the `.light`/`.dark` class on `<html>` via
  its blocking pre-paint script (ADR 0011), so the tokens resolve to the correct palette from the
  first paint — no `useTheme()`, no theme-flash, no hydration mismatch. Verified that
  `PacmanLoader@0.17.0` inserts `color` **straight into CSS** (`solid ${color}` borders,
  `backgroundColor: color` dots — no `calculateRgba`/hex parsing), so `color="var(--color-text-tertiary)"`
  resolves natively — confirmed in `out/index.html` (`solid var(--color-text-tertiary)` and
  `background-color:var(--color-text-tertiary)` both present).
- **No setState-in-effect, listener cleanup added.** The literal archive port calls
  `setLoading(false)` synchronously inside a `useEffect` when `readyState` is already
  `complete` — the exact error-level `react-hooks/set-state-in-effect` rule that bit Story 2.5
  (ADR 0019). `useSyncExternalStore` (codebase precedent: `ThemeToggle`) reproduces
  "shown until `complete`, then removed" with lint green, no hydration mismatch
  (`getServerSnapshot` ⇒ overlay present, matching the prerender), and **adds the listener
  cleanup the archive omitted** — a latent leak fixed, visible behaviour preserved (NFR7).
- **Intended delta flagged for the Story 4.1 gate.** The light-theme splash differs from the
  live site's always-dark splash **by design** — expected, not a regression to chase. Final
  in-browser visual sign-off (Pac-Man animation, both palettes, removal on ready) routes to 4.1.
- **State folded into the atom.** Unlike the archive (where `layout.js` held the `loading` state
  and conditionally rendered the spinner), the atom owns its ready-state and removes itself — so
  `layout.tsx` stays a Server Component with no new context or client boundary beyond the leaf.
- **Known coupling from the static keyframes (d).** `globals.css` now hardcodes `react-spinners`'
  internal keyframe names and the size-25 `ball` translate values (`-100px, -6.25px`). If the lib
  is bumped and renames its keyframes or changes the animation, the static defs would go stale
  silently. Mitigated by: the lib is pinned `^0.17.0` (names verified stable 0.13.8 → 0.17.0), a
  comment in `globals.css` flags the coupling, and the Story 4.1 visual gate catches regressions.

## Alternatives considered

- **Hand-roll the Pac-Man animation in CSS** — rejected: `PacmanLoader` is a distinctive
  multi-element keyframed animation; a clone would be non-byte-identical, i.e. more work for
  less parity on a zero-visual-regression migration (NFR1).
- **A different spinner** (`ClipLoader`/`BeatLoader`, a FontAwesome `fa-spin` icon,
  `react-loader-spinner`) — rejected: not the same visual; an unjustified parity break.
- **Reproduce the archive's always-dark splash (strict parity)** — rejected by Zac in favour of
  the theme-reactive improvement; the always-dark behaviour was a rough edge worth polishing,
  and doing so costs nothing in dark theme.
- **Keep `useState` + effect (literal port)** — rejected: trips `react-hooks/set-state-in-effect`
  (AC6 needs lint green) and the rule must not be suppressed with a disable comment.

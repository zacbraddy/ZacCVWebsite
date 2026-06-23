# 0019 — Custom scrollbar on `react-custom-scroll@7`, with a lint-driven scroll-reset reimplementation

- **Status:** Accepted
- **Date:** 2026-06-17
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, scrollbar, dependencies

## Context

Story 2.5 reimplements the content-pane custom scrollbar (FR5) and the route-change
scroll-to-top quirk (NFR7 — today driven by `setCurrentScrollPos(Math.random())` in the
archive `layout.js`). The scrollbar mechanism was an open call: the archive used
`react-custom-scroll`, and Stories 2.3/2.4 had noted "react-custom-scroll never coming back"
— but that referred to the _stale_ archive-era version. Three options were weighed on
2026-06-17.

## Decision

Re-add the archive's **own** library at its modern release: **`react-custom-scroll@^7.2.0`**
(React-19-tested), wrapping the content-pane children in `<CustomScroll>` inside the existing
`'use client'` `content-transition.tsx` leaf (AR14). `src/app/layout.tsx` is **not touched**.

The route-change scroll reset is reimplemented via the library's documented
`getScrolledElement().scrollTo(0, 0)`, called in a `useEffect` keyed on `usePathname()` —
**not** via the archive's `scrollTo={Math.random()}` prop hack.

## Consequences

- One new direct dependency (`react-custom-scroll ^7.2.0`); the build stays a pure static
  export (the class component's style-injection runs client-side in `componentDidMount`, so
  SSG prerender is clean — verified: routes `○ (Static)`, scrollbar markup present in
  `out/index.html`).
- **Byte-identical visuals for free:** v7 self-injects its base CSS (handle geometry 6px,
  `border-radius: 3px`, hover-fade, the `.rcs-content-scrolled:after` scroll-shadow) and keeps
  the archive's `rcs-` class names, so the archive's themed-handle override ports **verbatim**
  (`:global(.rcs-custom-scroll .rcs-inner-handle) { background: var(--color-bg-secondary);
opacity: 0.8; }`) into a co-located CSS Module. `addScrolledClass` is set to reproduce the
  archive's top scroll-shadow.
- **API deltas from the archive (v7), handled at build time, no ambient/vendored code needed:**
  (a) the export is a **named** import `import { CustomScroll }` (archive used a default import);
  (b) v7 **self-injects** its stylesheet, so there is **no `customScroll.css` to import** (the
  archive imported one from `dist/`); (c) v7 **ships its own types**, so no ambient `.d.ts`
  declaration is required.
- **Scroll-reset mechanism changed to satisfy the lint gate (behaviour preserved, NFR7).** The
  literal port — `setScrollPos(Math.random())` in a `[pathname]` effect — fails the project's
  `react-hooks/set-state-in-effect` ESLint rule (error-level; AC6 requires lint green). That
  rule pushes toward synchronising with external systems (the DOM) rather than bouncing through
  state, so the reset is done imperatively via `getScrolledElement().scrollTo(0, 0)`. This is a
  **faithful reimplementation of the quirk** — scroll resets to top on every route change — not
  a removal or a "fix" of dead/random code; `Math.random()` was only ever a means of forcing
  that reset. The visual scroll-to-top behaviour is the thing under NFR7, and it is preserved.
- **Conscious, narrow reversal** of the 2.3/2.4 "react-custom-scroll never coming back" note —
  scoped to the modern v7 only; the stale archive-era version still does not return. (Mirrors
  the 2.4 `vaul` precedent of adding one focused, modern dependency for the right reasons.)
- **No intended visual delta** (contrast the 2.4 `vaul` modal-semantics delta): re-adding the
  archive's own library reproduces today's behaviour. Final pixel parity (themed handle,
  hover-fade, scroll-shadow, the `calc(100% - 20px)` offset, scroll-to-top across navigations)
  is for the Story 4.1 visual/behavioural gate, where the live site is the arbiter — and is not
  fully exercisable until Epic 3 adds overflowing content and multiple routes.

## Alternatives considered

- **Native CSS** (`scrollbar-width`/`scrollbar-color` + `::-webkit-scrollbar`, now Baseline) —
  zero deps, most idiomatic, and a scrollbar is purely cosmetic (no a11y mechanics to rebuild,
  unlike the 2.4 drawer). Rejected for a **cosmetic near-parity** (native gutter vs overlay, no
  hover-fade nuance, no scroll-shadow) on a zero-visual-regression migration (NFR1).
- **SimpleBar / OverlayScrollbars ("modern primitives")** — rejected: their React wrappers carry
  maintenance yellow-flags (`overlayscrollbars-react` ~1–2y quiet; `simplebar-react` "partially
  maintained", React-19 unconfirmed), and they cost **more** bespoke theming for **less** parity
  (no verbatim CSS port, no scroll-shadow). Worst of both worlds: still a dep, not exact parity,
  not better-maintained than the archive's own now-modern lib.

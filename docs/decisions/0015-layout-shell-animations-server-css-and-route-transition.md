# 0015 — Layout shell animations: server-CSS entrance + client route-transition

- **Status:** Accepted
- **Date:** 2026-06-15
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, animations, layout

## Context

Story 2.1 ports the archive Gatsby layout shell and its two animations into the Next App Router
root layout, off styled-components. Three non-obvious calls had to be made: how to realise the
entrance animation given the Server/Client boundary; where the ported route-transition keyframes
live; and how the route-change transition is triggered in the App Router (where the Gatsby
`useLocation` + `children`-reference approach no longer maps cleanly).

## Decision

**(a) Entrance animation is pure CSS on the server-rendered frame — not a client leaf.**
The `fadeUpIn` entrance (styled-components `keyframes` + `AnimatedContainer` in the archive) is
ported to a CSS Module class `.animatedContainer` in `src/components/layout.module.css`, applied
directly to the frame `<div>` in `layout.tsx`. It is a one-shot mount animation needing no JS, so
it runs server-side with no `'use client'` boundary. This refines AR14, which had listed "the
entrance-animation wrapper" as a client leaf — only the **route transition** actually needs client
state. `layout.tsx` stays a Server Component and keeps its `metadata` export.

**(b) The six ported route-transition keyframes live in a plain global stylesheet, not a CSS Module.**
`src/components/atoms/animate-on-change.css` is a plain global `.css` imported as a side-effect by
the `AnimateOnChange` atom. The `animations` token map (`animations.ts`) references keyframes by
**literal string name** at runtime (e.g. `'fade-in-up 800ms … forwards'`). CSS Modules hash
`@keyframes` names, so putting these keyframes in a `.module.css` would make those string lookups
resolve to non-existent keyframes and the animation would **silently do nothing** — a parity
regression with no error to catch it. The entrance keyframe is the exception: it is safe inside the
CSS Module because it is referenced by the `animation` property within the **same** file, where
CSS Modules rewires the name consistently.

**(c) Route-change transition is triggered by `usePathname()` at the layout call site, with the
`AnimateOnChange` atom kept generic.**
A thin `'use client'` wrapper, `src/components/molecules/content-transition.tsx`, reads
`usePathname()` and renders the page content inside a `<div key={pathname}>` passed as `children`
to `AnimateOnChange`. The atom remains generic and children/value-driven (its `useEffect` fires its
out→in cycle on `[children]` change), so Story 3.1's Home page can reuse it for the rotating
job-title animation (a non-route change). Anchoring the changing child to `pathname` makes the
route signal explicit and reliable, avoiding the App Router pitfall where bare `children`
reference-identity diffing can churn on unrelated parent re-renders. `key={pathname}` is applied to
the inner content `<div>`, **not** to `AnimateOnChange` itself — keying the atom would remount it,
reset its `firstUpdate` guard, and suppress the out→in cycle (only the entrance "in" would play).

## Consequences

- No CSS-in-JS runtime remains for the layout animations (FR24 honoured); no new runtime dependency
  added (NFR5/NFR6).
- The only `'use client'` boundary in the shell is the route-transition wrapper; the layout, the
  sidebar/content structure, and the entrance animation all stay server-side.
- `AnimateOnChange` stays reusable for Story 3.1 because the route-specific wiring lives at the call
  site, not in the atom.
- `durationIn` is accepted by the atom's prop type but unused — faithful to the archive component,
  which also declared it on the call but never consumed it.
- Future shell stories slot into the content pane around `{children}` (2.5 `Scrollbar`, 2.4
  `MenuOpenContext.Provider`) without restructuring the transition wiring.

## Alternatives considered

- **`key={pathname}` on `AnimateOnChange`** — rejected: remounting resets the `firstUpdate` guard,
  so the out→in cycle never runs (only the mount "in" animation), breaking parity.
- **Keeping the entrance animation as a client leaf (literal AR14 reading)** — rejected: a one-shot
  CSS mount animation needs no JS; server CSS is the more idiomatic Next-native call.
- **Bare `children`-reference diffing as in the archive** — rejected as the sole signal: reliable in
  Gatsby's render model, but brittle in the App Router; `usePathname` is the idiomatic, stable route
  signal.

# 0004 — Full styled-components removal

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, styling, css-in-js

## Context

The headline modernisation move (FR24). The Gatsby site's styled-components footprint is
tiny — two `styled.div`s, one `createGlobalStyle`, and one `keyframes` block across three
files — so a CSS-in-JS runtime is carrying very little weight for its cost.

## Decision

**Remove styled-components entirely.** Replace it with global CSS variables +
`next-themes` for theming and CSS Modules for component-scoped styles. No CSS-in-JS runtime
remains in the new app.

## Consequences

- `createGlobalStyle` → static CSS-variable palettes injected globally.
- `AnimatedContainer` / `keyframes` → a CSS Module animation plus a thin `'use client'`
  wrapper component.
- `timeline-divider` → CSS Module.
- This removal is executed incrementally across **Epics 2–3** as each tier is ported, not in
  one commit.

## Alternatives considered

- **Keep styled-components** — rejected: it is the explicit modernisation target (FR24) and
  adds a client-side runtime for three call sites.

_Source: epics.md AR15 / FR24._

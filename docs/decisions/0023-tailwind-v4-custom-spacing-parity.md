# 0023 — Tailwind-v4 custom-spacing parity: re-declare divergent tokens per page

- **Status:** Accepted
- **Date:** 2026-06-18
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, tailwind, parity

## Context

The archive (Tailwind v3) only generated the spacing utilities it was configured for, and its
`archive/tailwind.config.js` overrode several values via `extend.spacing` (`87: '23rem'`,
`88: '24rem'`, `94: '26rem'`, plus unused `102/110/118/126/134`). Tailwind **v4** instead
generates `h-<n>`/`w-<n>` for **any** integer dynamically as `calc(var(--spacing) * n)` with a
default `--spacing: 0.25rem`. So `h-94` is **not** missing or purged in v4 — it renders, but at
`94 × 0.25rem = 23.5rem` instead of the archive's `26rem`. The About Me testimonial cards
(`h-94`, `lg:w-94`, `h-87`) and things-i-like cards (`lg:w-88`) therefore render ~2rem too small:
a silent visual regression exactly the kind NFR1 and the AR3 border/ring/divide-style guard exist
to catch.

## Decision

**Re-declare only the divergent spacing tokens a page actually uses as named `@theme` tokens, in
`globals.css`, additively, per page as Epic 3 progresses.** A named `--spacing-94: 26rem` makes
the token win over v4's dynamic `calc`, restoring the archive dimension.

About Me adds exactly three (Story 3.2):

```css
--spacing-87: 23rem;
--spacing-88: 24rem;
--spacing-94: 26rem;
```

**Coincident values get no override.** Where the archive value already equals `n × 0.25rem`, v4's
dynamic scale is already at parity, so adding a token would be redundant (NFR6). On About Me:
`68` (17rem = 17rem), `80` (20rem = 20rem), `72`, and `36` all coincide and are left to the
dynamic scale. The unused archive tokens (`102/110/118/126/134`, `gridTemplateRows.7`) are **not**
ported — Resume (3.3) and Content (3.4) add whatever divergent tokens they actually use, when they
use them.

This keeps the Epic 1–2 theming frozen: the only change is **additive** `@theme` tokens; no
existing token, palette, utility, or base rule is modified.

## Consequences

- `src/app/globals.css` gains three lines for Story 3.2 (`--spacing-87/88/94`); verified in the
  build output that `.h-94{height:var(--spacing-94)}` resolves to `26rem` (not `23.5rem`), and
  likewise `h-87`→`23rem`, `w-88`→`24rem`.
- The convention is captured once here; subsequent Epic 3 pages reference this ADR rather than
  re-arguing the gotcha, and add their own divergent tokens additively.
- A short audit step is implied per page: compare the spacing utilities a page uses against
  `n × 0.25rem`, and override only the ones that differ.

## Alternatives considered

- **Port the archive's whole `extend.spacing` block up front** — rejected: drags in unused tokens
  (`102/110/118/126/134`) and redundant coincident ones; gold-plating beyond what any page renders
  (NFR6).
- **Change the global `--spacing` base** — rejected: would shift every dynamic spacing utility
  site-wide, a far larger blast radius than the handful of divergent named values, and would break
  the coincident ones.

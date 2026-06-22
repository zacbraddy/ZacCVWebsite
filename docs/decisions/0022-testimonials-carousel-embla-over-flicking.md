# 0022 — Testimonials carousel: `embla-carousel-react` replaces `@egjs/react-flicking`

- **Status:** Accepted
- **Date:** 2026-06-18
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, dependencies, carousel

## Context

Story 3.2 ports the About Me page, whose Testimonials section is a horizontal, free-scroll,
centre-aligned carousel of six cards with prev/next buttons. The archive built this with
`@egjs/react-flicking` (`archive/src/components/organisms/testimonials.js`:
`<Flicking bound moveType="freeScroll" align="center" cameraClass="flex gap-4">` +
`flickingRef.current.prev()/next()`). Flicking is **not** in the Theseus tree, so a carousel
mechanism had to be chosen. Adding a top-level dependency is a deliberate call
(project-context: "don't introduce new top-level dependencies casually"), so the options were
weighed rather than defaulted.

## Decision

**Adopt `embla-carousel-react` (`^8.6.0`), over re-adding `@egjs/react-flicking` and over
hand-rolling a scroll-snap carousel. Zac confirmed Embla on 2026-06-18.**

Embla is a modern, React-19-ready, zero-config primitive whose options map 1:1 onto the
archive's Flicking config:

| Archive Flicking            | Embla (`useEmblaCarousel`)           |
| --------------------------- | ------------------------------------ |
| `moveType="freeScroll"`     | `dragFree: true`                     |
| `align="center"`            | `align: 'center'`                    |
| `bound={true}`              | `containScroll: 'trimSnaps'`         |
| `horizontal={true}`         | default (`axis: 'x'`)                |
| `flickingRef.prev()/next()` | `emblaApi.scrollPrev()/scrollNext()` |

The Flicking-specific props (`renderOnlyVisible`, `renderOnSameKey`, `viewportTag`, `cameraTag`)
have no Embla equivalent and are not needed — Embla renders all slides into a flex track
(`overflow-hidden` viewport → `flex gap-4` container, reproducing Flicking's
`cameraClass="flex gap-4"`). The carousel is the **one `'use client'` leaf** of the page (AR14
names "the testimonials carousel" explicitly); the surrounding three sections stay Server
Components. This mirrors the Story 2.4 `react-burger-menu → vaul` precedent (ADR
[0018](0018-mobile-drawer-vaul-menu-context.md)): a stale Gatsby-era lib is replaced by a modern,
maintained primitive rather than resurrected or hand-rolled.

**Library-swap-induced parity fix.** Flicking injected `position` onto its panels, so the
archive's absolutely-positioned testimonial author block (`position: absolute; bottom: 1rem`)
anchored to the card. Embla does **not** position its slides, so the bordered inner box of
`testimonial.tsx` gains `relative` to restore that anchor. This is a minimal parity fix, not
gold-plating — the exact ancestor is a Story 4.1 visual-diff confirmation item.

## Consequences

- One new direct dependency: `embla-carousel-react ^8.6.0` (transitively its own
  `embla-carousel` + `embla-carousel-reactive-utils` internals; no further third-party runtime
  deps). No `@egjs/react-flicking`.
- The build stays a pure static export (`output: 'export'`; `/about-me` is `○ (Static)`) — Embla
  is client-only and hydrates at runtime, fully SSG-compatible.
- `emblaApi` is `undefined` until mounted; the buttons use optional chaining
  (`emblaApi?.scrollPrev()`) to satisfy TypeScript `strict` with no `any`.
- The free-scroll _drag-momentum feel_ may differ imperceptibly from Flicking's (different
  physics); content, layout, and button behaviour are at parity. Flagged for the Story 4.1
  visual/behavioural gate against the live site (NFR2 is behavioural parity, not physics-identical).

## Alternatives considered

- **Re-add `@egjs/react-flicking`** — rejected: resurrecting a Gatsby-era lib not in the tree, against
  the idiomatic-modern-stack posture (NFR5); Embla is lighter and maps cleanly onto the old config.
- **Hand-roll a CSS scroll-snap carousel** — rejected: true parity (free-scroll + centre align +
  trimmed bounds + programmatic prev/next) is a library in disguise; real regression risk on a
  parity migration (NFR1/NFR2).

# 0012 — FontAwesome introduction (icon system + App Router SSR config)

- **Status:** Accepted
- **Date:** 2026-06-12
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, icons, dependencies

## Context

The archived Gatsby site uses FontAwesome as its icon system across 10 files; the moon/sun
theme toggle is the first of those to be ported (Story 1.5). The new Next tree had no icon
library yet, so a call was needed: substitute a different icon set, hand-roll inline SVGs, or
carry FontAwesome over. Two constraints shape it — NFR1 (no visual regression) and the
deliberate dependency restraint of a small static site.

## Decision

Introduce FontAwesome **now**, with the toggle as its first consumer:

- `@fortawesome/fontawesome-svg-core`, `@fortawesome/react-fontawesome` (`3.x`,
  React-19-compatible — a major bump from the archive's `^0.2.x`, same
  `<FontAwesomeIcon icon={…} size="lg" />` API), `@fortawesome/free-regular-svg-icons`
  (`faMoon`), `@fortawesome/free-solid-svg-icons` (`faSun`) — all in `dependencies`.
- **Parity by construction.** Re-using the archive's exact glyphs — `faMoon` (free-_regular_)
  and `faSun` (free-_solid_) — makes the toggle icons pixel-identical to the live site, the
  safest answer to NFR1. Only those two icons are imported in this story; the rest arrive with
  their consumers in Epic 2 (`faBars` etc.).
- **App Router SSR config.** FontAwesome auto-injects its CSS at runtime, which under static
  export causes a flash of **oversized** icons. Prevent it once, in the root layout module:
  `import { config } from '@fortawesome/fontawesome-svg-core'; config.autoAddCss = false;` plus
  `import '@fortawesome/fontawesome-svg-core/styles.css';` (the CSS is then bundled, not injected
  at runtime). Verified: `out/index.html` ships the `svg-inline--fa` markup with the stylesheet
  bundled and no runtime injection.

## Consequences

- The whole-site icon system is settled; Epic 2 components import their glyphs from the same
  packages with no further setup decision.
- The toggle icons are a visual-regression non-issue by construction (same glyph sources, same
  `size="lg"`).
- Introducing FA here (rather than a transitional inline-SVG stopgap) avoids coding defensively
  around a placeholder that would have to be torn out the moment the next FA consumer lands.
- Four runtime dependencies added — justified: FA is unavoidable site-wide (10 archive files),
  so this is a planned carry-over, not a casual add.

## Alternatives considered

- **Substitute a different icon set (e.g. Lucide / Heroicons)** — rejected: a visual-regression
  risk (NFR1) and an out-of-scope redesign; the glyphs would not be pixel-identical.
- **Hand-rolled inline SVG stopgap for the toggle only** — rejected: transitional complexity
  that the next FA consumer in Epic 2 would immediately obsolete (Zac, 2026-06-12).
- **Leave `autoAddCss` at its default (on)** — rejected: causes the flash-of-oversized-icons
  under static export.

_Related: [0011](0011-theme-persistence-next-themes.md) (the toggle this icon system first
serves)._

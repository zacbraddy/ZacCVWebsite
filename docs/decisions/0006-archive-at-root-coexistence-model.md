# 0006 — `archive/`-at-root coexistence model

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, repo-structure, coexistence

## Context

The old and new apps cannot share one dependency root: a single `package.json` cannot hold
React 18 + Tailwind v3 (Gatsby) **and** React 19 + Tailwind v4 (Next) simultaneously, and
the `public/` directory collides between the two tools (Gatsby treats it as build _output_,
Next treats it as static _source_). Separate dependency roots are therefore forced, and we
need a layout that lets both build during the migration.

## Decision

Build the new Next app at the **repository root**; relocate the entire Gatsby tree into
`archive/`, kept buildable until cutover; **delete `archive/` at Epic 4 (Story 4.2)**.

## Consequences

- The new app gets the idiomatic root-level Next layout from day one — no nested
  subdirectory to promote later.
- Cutover is a clean `rm -rf archive/` plus git removal, not a risky directory-promotion
  step.
- `.prettierignore` excludes `archive/` so the frozen Gatsby tree is not reformatted.

## Alternatives considered

- **New app in a subdirectory (e.g. `next/`), Gatsby at root** — rejected: leaves the new app
  non-idiomatic and turns cutover into a risky promotion of nested files to root.

_Source: Story 1.1 Dev Notes + Completion Notes (Zac, 2026-06-11); project memory (theseus-coexistence-archive-model); epics.md AR1._

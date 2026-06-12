# 0002 — Tailwind v4 over v3

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, styling, tailwind

## Context

The Gatsby site used Tailwind v3 with a JavaScript `tailwind.config.js` token map. Tailwind
v4 is the current major version, built on the Oxide engine with a CSS-first `@theme`
configuration model. Adopting it now avoids starting the new project on an already-superseded
major.

## Decision

Adopt **Tailwind v4, CSS-first** (`@theme` in CSS rather than a JS config token map).

## Consequences

- Introduces a mandatory **border / ring / divide regression guard**: v4 defaults these
  utilities to `currentColor`, whereas v3 defaulted them to `gray-200`. An explicit base
  border colour must be set and every `border` / `ring` / `divide` usage audited so the
  rebuild does not silently change borders to the text colour.
- The guard is implemented in **Story 1.3** (see [0009](0009-tailwind-v4-border-ring-divide-guard.md)
  for the _how_ + per-tier audit checklist); this ADR records _why_ that work exists.
- Theming tokens move from JS config into CSS variables (see
  [0004](0004-remove-styled-components.md) for the broader CSS-vars direction).

## Alternatives considered

- **Tailwind v3** — rejected: starting a greenfield rebuild on the previous major just to
  avoid the migration guard is a false economy.

_Source: epics.md AR3; technical research (Tailwind decision); project-context.md #Tailwind._

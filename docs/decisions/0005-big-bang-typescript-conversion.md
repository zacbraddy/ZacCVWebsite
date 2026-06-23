# 0005 — Big-bang TypeScript conversion

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, typescript, migration-strategy

## Context

The codebase is small, and TypeScript-on-display (showing type-safe engineering as part of
the CV's substance) is a goal of the rebuild. A mixed-mode JS/TS migration would introduce a
maintenance seam (`allowJs`, gradual conversion) that is not worth carrying for a project
this size.

## Decision

**Full TypeScript from the start** — no `allowJs`, no `.js` source components. Every ported
component is `.ts` / `.tsx` under `strict`.

## Consequences

- The conversion happens as part of porting each tier; there is never a half-typed
  intermediate state to manage.
- Pairs with [0001](0001-nextjs-16-react-19-typescript-strict-stack.md) — the strict stack
  decision and the big-bang approach are two sides of the same call.

## Alternatives considered

- **Incremental JS→TS migration (`allowJs: true`)** — rejected: the seam costs more than it
  saves on a codebase this small, and it would leave untyped code on display.

_Source: epics.md AR2; addendum._

# 0001 — Next.js 16 + React 19.2 + TypeScript (strict) stack

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, stack, framework

## Context

The live site runs on Gatsby 5 with plain JavaScript — a static-site generator on a
deprecating trajectory, with no type safety and an ageing `@reach/router` / GraphQL data
layer. The brief closed the framework re-evaluation rather than leaving it open: the
question was not _whether_ to move but _what to move to_.

## Decision

Rebuild on **Next.js 16 (App Router) + React 19.2 + TypeScript 6.x with `strict: true`**.
No Gatsby, no `@reach/router`, no GraphQL data layer.

_(Originally seeded as TypeScript 5.x; bumped to 6.x on 2026-06-11 during the latest-versions
sweep — verified clean against Next 16 via `next build` + `tsc --noEmit`. See ADR
[0007](0007-linting-and-formatting-tooling.md) for the toolchain currency policy.)_

## Consequences

- The App Router pins its own validated React version, so React 19.2 comes with the
  framework rather than being chosen independently.
- Commits us to a big-bang TypeScript conversion — no mixed-mode JS/TS seam (see
  [0005](0005-big-bang-typescript-conversion.md)).
- Idiomatic Next from day one; we build Next-native rather than porting Gatsby idioms.

## Alternatives considered

- **Stay on Gatsby 5** — rejected: the deprecating stack is the reason for the migration.
- **Astro** — rejected: Next App Router is the mainstream, best-supported
  choice for a static-export marketing/CV site and keeps the markdown-pipeline door open for
  Ariadne.

_Source: addendum #Decided-technical-stack; technical research #Architectural-Decisions; epics.md AR2 / FR23._

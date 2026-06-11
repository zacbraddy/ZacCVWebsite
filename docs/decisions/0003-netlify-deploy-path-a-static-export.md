# 0003 — Netlify deploy Path A (static export)

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, deploy, netlify

## Context

The existing pipeline is GitHub `main` → Netlify deploy-on-commit, serving a static bundle.
The migration should not also become a host migration or introduce server-side
infrastructure. The decision was which Next deployment model to target on Netlify.

## Decision

**Path A: pure static export** (`output: 'export'`), plus a small custom `next/image`
`loaderFile` targeting the Netlify Image CDN (`/.netlify/images?url=…&w=…&q=…`). No host
migration, no serverless functions, no SSR.

## Consequences

- SSG only — no SSR and no Netlify/Next functions; everything resolves at build time.
- The `next/image` loader config is implemented in **Story 1.7**.
- Keeps the deploy-on-commit-to-`main` workflow identical to the Gatsby site, so cutover is
  a content swap rather than a pipeline rebuild.

## Alternatives considered

- **Netlify's Next.js runtime (SSR / functions)** — rejected: adds serverless surface area
  this static CV site does not need and complicates a like-for-like cutover.

_Source: epics.md AR4 / AR5 / AR6; addendum (hosting row); technical research._

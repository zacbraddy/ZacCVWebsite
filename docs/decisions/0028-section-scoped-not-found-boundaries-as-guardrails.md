# 0028 — Section-scoped `not-found` boundaries as forward-looking failure guardrails

- **Status:** Accepted
- **Date:** 2026-06-29
- **Decider:** Zac (We Right Code)
- **Tags:** ariadne, backroom, resilience, not-found, static-export

## Context

Project Ariadne Story 2.2 split the layout into rooms (global root shell + `(site)` front-of-house

- a plain `backroom/` folder) and, per Zac's earlier call, gave each room its own section-scoped
  `not-found.tsx` boundary backed by a shared `NotFoundContent` organism. Code review then surfaced a
  sharp observation about the **static export** (`output: 'export'`, ADR
  [0003](0003-netlify-deploy-path-a-static-export.md)):

* Next emits a **single** `out/404.html`, rendered from the **root** `not-found.tsx`. Netlify
  (`publish = out`) serves that one file for **every** unmatched, cold-loaded path.
* A nested boundary (`backroom/not-found.tsx`) only fires during **in-app navigation** when a
  rendered page throws `notFound()`.
* The site today has **zero dynamic segments and zero `notFound()` callers**. Even after Stories
  2.3/2.4 add the real Backroom doc routes, those routes are statically generated and only link to
  docs that exist, so a bad doc URL is also a cold load → the single root `404.html`.

So `backroom/not-found.tsx` is, under the current and near-future static export, a boundary that
**cannot fire** — i.e. effectively dead code. The review asked the fair question: keep it, or remove
it as YAGNI?

## Decision

**Keep the section-scoped `not-found` boundaries deliberately, as forward-looking resilience
guardrails — and adopt this as a general project principle.**

The reasoning is the test gap, not the present call graph. This codebase has **no automated test
suite** (`npm test` is a stub; verification is build + lint + manual). In that setting, a
per-room `not-found` boundary is a cheap, standing safety net whose value is precisely that it
**predates the code path that needs it**: if future development introduces a failure state — a
missing-doc `notFound()` rendered via in-app nav, a new runtime route, a bug in a later feature —
the user still lands on a correct, themed, navigable page **within the right room** rather than a
broken view. We do not remove a guardrail because today's code happens not to exercise it; with no
tests to catch a regression, the guardrail is the thing that keeps a failure state graceful.

This generalises beyond `not-found`: prefer cheap standing guardrails (error/not-found boundaries,
schema validation that fails the build, see ADR [0027](0027-markdown-pipeline-velite-shiki.md)) over
deleting them for minimum-complexity, **specifically because** there is no test layer to notice when
their absence starts to bite.

## Consequences

- `backroom/not-found.tsx` is **intentionally inert** under the current static export — this is an
  accepted, documented state, **not a defect**. Do not dead-code-eliminate it.
- When Story 2.4 lands the real Backroom doc routes, the boundary is **already in place** to catch a
  missing-doc `notFound()` rendered inside `BackroomLayout` (a plain folder inherits its layout for
  the boundary, which is why the Backroom is a plain folder rather than a route group).
- The cold-loaded **unmatched URL** still resolves to the single root `out/404.html`, which wears
  the front-of-house `SiteShell` so a lost user can navigate back via the sidebar nav. That residual
  is unchanged and accepted.
- Two minor follow-ups are parked in `deferred-work.md`, both to revisit when the Backroom-404
  styling lands in 2.4: `NotFoundContent`'s `h-full` centring assumption does not hold inside
  `BackroomLayout` (no height ancestor), and the `404: Not found` `metadata` is duplicated across the
  root and Backroom boundaries. Neither matters until/unless the Backroom 404 actually renders.
- A future contributor (human or LLM) reading the code will see a boundary that "can't fire" and may
  be tempted to remove it for tidiness; this ADR is the standing answer for why it stays.

## Alternatives considered

- **Remove `backroom/not-found.tsx` now (YAGNI / minimum-complexity), re-add in 2.4 when a
  `notFound()` caller exists** — rejected: the boundary is near-zero cost, and "re-add when needed"
  assumes we will remember to, in a codebase with **no tests** to remind us. The guardrail's whole
  point is to exist before the bug, not after.
- **Rely solely on the global root 404** — rejected: a single global boundary cannot preserve
  room-correct chrome for an in-app `notFound()` once dynamic routes exist; the room-scoped boundary
  is what keeps a Backroom failure inside the Backroom.

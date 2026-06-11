# 0008 — Build against latest-LTS Node, not the floor

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, tooling, node

## Context

The old Gatsby project pinned an `engines.node` floor of `>=18.15.0`. Building a greenfield
app against the minimum supported version invites stale-toolchain drift — you end up
developing on an old runtime while the ecosystem moves on.

## Decision

Pin to the **latest LTS — Node 24 "Krypton"** (`v24.16.0`), managed via fnm.
`.node-version` pins the exact version; `engines.node` is set to `">=24.0.0"`.

## Consequences

- Development and CI run on a current LTS runtime rather than a years-old floor.
- A known gotcha: fnm's `lts-latest` alias is stale on this machine (it points at Node 22),
  so Node 24 must be targeted explicitly rather than relying on the alias.

## Alternatives considered

- **Build against the old `>=18.15.0` floor** — rejected: develops against a deprecating
  runtime and defeats the point of a modernisation rebuild.

_Source: Story 1.1 (Zac, 2026-06-11); project memory (node-build-against-latest-lts)._

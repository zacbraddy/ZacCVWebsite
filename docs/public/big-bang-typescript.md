---
title: Big-bang TypeScript
section: Decisions
adr: 5
order: 5
teaser: Full TS cut, not a mixed-mode seam
---

## Context

The old site was plain JavaScript with no type safety. Showing type-safe engineering was part of what I wanted the rebuild to demonstrate, so TypeScript was going in. The real question was _how_: all at once, or gradually, file by file, with JavaScript and TypeScript living side by side for a while.

The usual advice for large codebases is to migrate incrementally. This codebase is not large.

## Decision

I converted the whole thing to **TypeScript in one cut**, with no `allowJs` and no `.js` source. Every component is `.ts` or `.tsx` under `strict`.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "allowJs": false
  }
}
```

`allowJs: false` is the deliberate part. It means there is no escape hatch and no half-typed file quietly sitting untyped on display.

> Incremental migration is the right call when the seam costs less than the big cut. On a codebase this small, the seam costs more, and it leaves untyped code on show in a project whose whole point is to show good engineering.

## Consequences

There was never a half-typed intermediate state to manage, no `allowJs` flag to remember to remove later, and no mixed-mode tooling to keep happy. The conversion happened as part of porting each tier, so the typing came for free with work I was doing anyway. It pairs directly with the [strict-stack decision](/backroom/framework-decision): choosing a strict TypeScript stack and choosing to convert in one go are two sides of the same call.

## Rejected alternatives

**Incremental JS-to-TS migration** with `allowJs: true` is the textbook approach, and I rejected it here. The maintenance seam costs more than it saves on a codebase this small, and it would have left untyped code on display, which undercuts the reason for adding TypeScript in the first place.

## Status / trail

Accepted and in force. The entire source is strict TypeScript with no JavaScript source files, verified clean against the framework with `tsc --noEmit`.

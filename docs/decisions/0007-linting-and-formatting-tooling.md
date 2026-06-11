# 0007 — Linting & formatting tooling: Prettier + ESLint

- **Status:** Accepted
- **Date:** 2026-06-11
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, tooling, linting, scaffold

## Context

AR13 mandates Prettier + Husky and forbids a fabricated test suite. Story 1.1 scaffolded the
project minimally and recorded ESLint as "declined" and Tailwind as deferred to Story 1.3.

On review during Story 1.2, the project owner flagged that the ESLint exclusion had **never
been an explicit owner-level decision** — ESLint's absence from the scaffold went unnoticed
rather than chosen — and decided to bring it in now. A TypeScript-strict Next app whose
engineering is part of the CV's substance benefits from the Next / React / accessibility
rule coverage, and the cost of adding it is small.

## Decision

- **Adopt ESLint now**, with rulesets matched to the target architecture (Next 16 App Router,
  React 19.2, TypeScript strict):
  - `eslint-config-next/core-web-vitals` (Next, React, React Hooks, jsx-a11y, import; Core
    Web Vitals rules raised to errors),
  - `eslint-config-next/typescript` (`typescript-eslint` recommended),
  - `eslint-config-prettier/flat` last, so ESLint defers **all formatting** to Prettier,
  - flat config in `eslint.config.mjs` (ESLint 9, native flat imports — Next 16 removed
    `next lint`); `archive/` is excluded so the frozen Gatsby tree is never linted.
- **Prettier remains the formatter** (3.8.4 + Husky `pretty-quick --staged`). ESLint does
  **not** format — the two tools have distinct jobs.
- **Tailwind remains deferred to Story 1.3** (unchanged from the original scaffold decision).

## Consequences

- `npm run lint` / `npm run lint:fix` available; ESLint runs clean on the current scaffold
  (470 active rules incl. `@next/next/no-img-element`, `react-hooks/rules-of-hooks`,
  `@typescript-eslint/no-unused-vars`).
- New devDependencies: `eslint`, `eslint-config-next`, `eslint-config-prettier`. No
  `typescript-eslint` / `eslint-plugin-react*` direct deps — `eslint-config-next` bundles
  them.
- ESLint and Prettier do not conflict (`eslint-config-prettier` switches off stylistic
  rules).
- **This reverses the earlier "ESLint declined / permanently excluded" framing** recorded in
  Story 1.1's notes and the first seed of this ADR. That framing was never an owner decision;
  recording the reversal here is itself the as-you-go capture mechanism (see
  [README](README.md)) doing its job.
- Open follow-up: ESLint is **not** yet wired into the Husky pre-commit hook (only Prettier
  is) or into CI. Whether to gate commits/builds on `lint` is a later call, not made here.
- **ESLint held at v9, not v10 (2026-06-11):** the latest-versions sweep tried ESLint
  `^10.4.1`. Although `eslint-config-next@16`'s peer range nominally allows ESLint 9-or-newer,
  it crashes at runtime — the bundled `eslint-plugin-react@7.37` calls the legacy
  `context.getFilename()` API that ESLint 10 removed (`TypeError:
contextOrFilename.getFilename is not a function`). Pinned back to `^9.39.4` until
  `eslint-config-next` ships an ESLint-10-ready `eslint-plugin-react`. `typescript-eslint@8.61`
  itself already supports ESLint 10, so the blocker is purely the bundled React plugin.
- **Prettier upgraded 2.8.7 → 3.8.4 (owner call, 2026-06-11):** carried over from the Gatsby
  scaffold at 2.x; bumped to current 3.x so the formatter is not the one stale link in an
  otherwise-current toolchain. `pretty-quick` bumped `3.3.1 → 4.2.2` in lockstep (its peer
  requires Prettier 3). Prettier 3's `trailingComma: "all"` default changed no committed code
  (the `src/` scaffold reformatted to zero diff). `.prettierrc` (`singleQuote`,
  `arrowParens: avoid`) is unchanged and fully 3.x-compatible.
- **Scope-guard override (owner call, 2026-06-11):** Story 1.2 was scoped as documentation
  only (AC4 — "no touch to `package.json`/build"). Bringing ESLint in here knowingly
  supersedes that guard; the owner directed the override explicitly rather than it slipping
  in. Recorded here so the decision lives in the trail Epic 4 collates, not only in the
  story's Dev Agent Record.

## Alternatives considered

- **Keep ESLint excluded** — rejected: the exclusion was never actually decided by the owner,
  and the rule coverage is worth the small footprint.
- **Omit `eslint-config-prettier` and let ESLint keep its own formatting rules** — rejected:
  ESLint and Prettier would then both police formatting and fight each other.
  `eslint-config-prettier` is therefore **adopted** (it switches ESLint's stylistic rules off
  so Prettier alone owns formatting).
- **Run Prettier _through_ ESLint via `eslint-plugin-prettier` (one unified command)** —
  rejected: Prettier's own maintainers discourage it; it is slower and surfaces formatting
  differences as red lint errors. The two tools stay separate with distinct jobs — **Prettier
  formats, ESLint checks code quality** — and `eslint-config-prettier` is the bridge that
  keeps them from overlapping.

_Source: this story (Zac, 2026-06-11) reversing the Story 1.1 Task 5 framing; Next.js ESLint docs (eslint-config-next flat config, `next lint` removed in v16); epics.md AR13; project-context.md #Tooling._

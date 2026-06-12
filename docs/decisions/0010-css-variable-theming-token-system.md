# 0010 — Global CSS-variable theming token system

- **Status:** Accepted
- **Date:** 2026-06-12
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, styling, theming, tailwind

## Context

The archived Gatsby site expressed its dark/light palettes through a styled-components
`createGlobalStyle` (`archive/src/components/theme-styles.js`), injecting `--color-*` CSS
variables per theme and mapping them to v3 Tailwind token classes (`bg-primary-400`,
`text-secondary`, `border-inverse`, …). ADR 0004 removed styled-components; this story
realises the theming half of that removal as **static** global CSS in `src/app/globals.css`,
under Tailwind v4 (CSS-first, no `tailwind.config.js`). Three non-obvious calls had to be
made to reproduce the palettes pixel-for-pixel without a CSS-in-JS runtime.

## Decision

1. **Custom `@utility` per token, not a flat `@theme` palette.** Tailwind v4's `@theme`
   generates `bg-*`, `text-*`, and `border-*` from a single shared `--color-<name>` token.
   That collapses three colours into one — wrong for the light palette, where
   `bg-secondary` (`#3058b5`), `text-secondary` (`#49629c`), and `border-secondary`
   (`#3058b5`) diverge (and `tertiary` likewise: `bg #e6593d` vs `text #cc715f`). Each v3
   token class is instead defined as a custom `@utility` pointing at its own family var
   (`--color-bg-secondary`, `--color-text-secondary`, `--color-border-secondary`). This
   keeps the exact v3 class names, preserves per-family divergence, and retains full variant
   support (`xs:`, `md:`, hover, …). `@theme inline` was rejected — it still shares one token
   across `bg/text/border`.

2. **`:root` (dark default) + `.light` selector, pinned to `next-themes` `attribute="class"`.**
   Dark is defined on `:root` so it renders by default with no JS and no flash (AC4). Light
   is defined on `.light`, placed after `:root` (equal specificity → source order wins).
   Story 1.5 will configure `next-themes` with `attribute="class"` (its default,
   Tailwind-idiomatic), toggling `class="dark"`/`class="light"` on `<html>`. This is an
   explicit forward-coupling decision confirmed at dev time: 1.5 uses `attribute="class"`,
   not `data-theme`.

3. **The `border-inverse` "missing `#`" quirk is ported verbatim (NFR7).** The archive
   defines `borderColor.inverse` as `'fafafa'` (dark) / `'5a5a5a'` (light) with **no leading
   `#`**, making `--color-border-inverse` an invalid CSS colour. On the live site the five
   `border-inverse` consumers therefore fall back to `currentColor` — no visible line.
   Porting the value verbatim (`--color-border-inverse: fafafa;` / `5a5a5a;`) reproduces that
   exact rendering by construction. "Fixing" it to `#fafafa`/`#5a5a5a` would introduce a
   visible border where today there is none — a visual regression (NFR1/NFR7). A one-line
   comment marks each var as a deliberate quirk.

Additionally, the create-next-app colour boilerplate (`--background`/`--foreground` vars and
both `@media (prefers-color-scheme: dark)` blocks) was removed now rather than deferred: once
`body` reads the `--color-*` palette those vars are dead, and a system-preference rule
contradicts FR10's no-auto-adopt stance — the archive set no `color-scheme` at all, so
removal is the parity-faithful call.

## Consequences

- Every later component (Epics 2–3) can use the v3 token classes and get pixel-identical
  colours in both palettes; the token utilities behave like normal Tailwind utilities.
- Story 1.5 is committed to `next-themes` `attribute="class"`. If it ever needs `data-theme`,
  the `.light` selector must change to `[data-theme='light']` and this ADR be superseded.
- The Story 1.3 border guard ([ADR 0009](0009-tailwind-v4-border-ring-divide-guard.md)) is
  left intact — the default Tailwind palette (and `--color-gray-200`) is **not** wiped, so
  the guard still resolves to `#e5e7eb` (AC6).
- The `border-inverse` quirk is intentionally invalid; any future "lint the CSS for invalid
  colours" pass must allowlist it. Its five consumers are ported in Epics 2–3 and verified by
  the Story 4.1 parity gate.

## Alternatives considered

- **Flat `@theme { --color-secondary: … }`** — rejected: collapses `bg/text/border` into one
  token, cannot represent the light palette's per-family divergence.
- **`@theme inline`** — rejected: same single-token-shared-across-properties limitation.
- **Correcting the `border-inverse` value to a valid hex** — rejected: introduces a visible
  border absent today (NFR7 violation).
- **Deferring `prefers-color-scheme` removal to Story 1.5** — rejected: leaves dead
  system-preference rules in the interim CSS and reads as auto-adopt intent (FR10).

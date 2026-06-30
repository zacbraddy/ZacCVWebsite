---
title: CSS-variable theming
section: Decisions
adr: 10
order: 10
teaser: Per-token utilities, and porting an invalid-colour quirk on purpose
---

## Context

[Removing styled-components](/backroom/removing-styled-components) left a gap. The old site expressed its dark and light palettes through a styled-components `createGlobalStyle` that injected `--color-*` variables per theme and mapped them onto Tailwind v3 token classes like `bg-secondary`, `text-secondary`, and `border-secondary`. With CSS-in-JS gone, I had to reproduce those palettes pixel-for-pixel as static CSS, under [Tailwind v4](/backroom/tailwind-v4-over-v3) with no JS config. Three non-obvious calls came out of that.

## Decision

**A custom `@utility` per token, not a flat shared palette.** Tailwind v4's `@theme` generates `bg-*`, `text-*`, and `border-*` from a single shared `--color-<name>` token. That collapses three colours into one, which is wrong for the light palette, where `bg-secondary`, `text-secondary`, and `border-secondary` genuinely diverge. So each token class is defined as its own `@utility` pointing at its own family variable:

```css
@utility text-secondary {
  color: var(--color-text-secondary);
}
@utility bg-secondary {
  background-color: var(--color-bg-secondary);
}
```

This keeps the exact old class names, preserves the per-family divergence, and retains full variant support.

**`:root` for dark, `.light` for light.** Dark is defined on `:root` so it renders by default with no JavaScript and no flash. Light is defined on `.light`, placed after `:root` so equal specificity resolves by source order, and `next-themes` toggles the class on the `<html>` element.

**I ported an invalid-colour quirk on purpose.** The old site defined one border colour as `'fafafa'` with no leading `#`, which makes it an invalid CSS colour, so on the live site those borders silently fell back to `currentColor` and drew no visible line. I reproduced that verbatim rather than "fixing" it:

```css
:root {
  /* deliberately invalid (no leading #): matches the live site, no visible border */
  --color-border-inverse: fafafa;
}
```

> "Fixing" the missing `#` would have added a border that the live site doesn't have. On a zero-regression migration, faithfully reproducing a quirk is the correct call, even when every instinct says to tidy it. I marked it with a one-line comment so the next person knows it's deliberate, not a mistake.

## Consequences

Every component built afterwards can use the old token classes and get pixel-identical colours in both palettes. The system depends on the default Tailwind palette staying intact, which is what keeps the [border guard](/backroom/tailwind-border-guard) resolving to its `gray-200` hairline, so I deliberately did not wipe it. The invalid `border-inverse` value is intentionally non-standard, so any future "lint the CSS for bad colours" pass needs to allowlist it.

## Rejected alternatives

**A flat `@theme` palette** or `@theme inline` was rejected: both collapse `bg`, `text`, and `border` into one shared token and can't represent the light palette's per-family divergence. **Correcting the `border-inverse` value to valid hex** was rejected: it introduces a visible border that isn't there today.

## Status / trail

Accepted and in force. Both palettes render pixel-identical to the live site, verified at the cutover parity gate.

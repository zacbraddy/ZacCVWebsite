---
title: Tailwind border guard
section: Decisions
adr: 9
order: 9
teaser: Restoring the v3 hairline after a silent v4 regression
---

## Context

[Adopting Tailwind v4](/backroom/tailwind-v4-over-v3) came with one migration hazard that is easy to miss precisely because it makes no noise. Tailwind v4 defaults the `border`, `ring`, and `divide` colours to `currentColor`, to match native CSS. Tailwind v3 defaulted them to `gray-200`.

The old site had bare `border` utilities that quietly relied on that v3 `gray-200` default to draw a faint hairline. Under v4, with no change to the markup, those same borders would render in the element's _text_ colour instead. Nothing errors. Nothing warns. The borders just silently change colour, which is exactly the kind of regression a zero-regression migration is supposed to catch.

## Decision

I pinned an explicit base border colour in `globals.css` that restores the v3 default, applied with the documented v4 compatibility selector:

```css
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}
```

This works because v4 ships its default palette as CSS variables, so `--color-gray-200` resolves to the same `#e5e7eb` hairline the old site drew. The `currentColor` fallback only ever kicks in if that variable is removed, which leaves a clear breadcrumb for anyone who later wipes the default palette.

Alongside the guard I kept a per-tier audit rule: every `border`, `ring`, or `divide` added during the port had to either name an explicit colour token or be a deliberate `gray-200` default, confirmed against a side-by-side visual diff.

> The dangerous regressions are the silent ones. A border that changes colour with no error is worse than one that throws, because nothing makes you look. So I made the default explicit and audited every usage rather than trusting I'd spot it by eye.

## Consequences

Bare borders keep their hairline and the v4 `currentColor` shift can't silently regress them to the text colour. The one catch worth flagging: the guard depends on the default palette shipping `--color-gray-200`, so the [theming work](/backroom/css-variable-theming) had to be careful not to wipe the default palette out from under it. That coupling is recorded in both decisions on purpose.

## Rejected alternatives

**Adding `border-gray-200` to each bare usage** instead of one base guard was rejected: it scatters the fix across components, is easy to forget on a new one, and doesn't match v3's global default behaviour the way a single base rule does.

**Adopting v4's `currentColor` default and recolouring each border** was rejected too: it changes the visual output and reopens the parity-first trade-off for no benefit.

## Status / trail

Accepted and in force. The compatibility snippet is supported-for-compatibility rather than idiomatic v4, a trade-off taken knowingly in favour of faithful parity. Verified by side-by-side visual diff against the live site at cutover.

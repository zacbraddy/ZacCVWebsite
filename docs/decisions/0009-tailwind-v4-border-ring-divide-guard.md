# 0009 — Tailwind v4 border/ring/divide regression guard

- **Status:** Accepted
- **Date:** 2026-06-12
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, styling, tailwind

## Context

[0002](0002-tailwind-v4-over-v3.md) accepted Tailwind v4 (CSS-first, Oxide) and flagged the
one migration hazard it forces: v4 defaults `border` / `ring` / `divide` colour to
`currentColor` to match native CSS, where v3 defaulted them to `gray-200`. On the live Gatsby
site, any bare, un-coloured `border` utility silently relied on that v3 gray-200 default. Under
v4 those borders would render in the element's **text colour** instead — a silent visual
regression against the zero-regression parity bar (NFR1/NFR2). 0002 records _why_ the guard
exists; this ADR records _how_ it is implemented and the per-tier audit rule that keeps it
honest through the Epic 2–3 tier ports.

## Decision

Configure Tailwind v4 CSS-first in `src/app/globals.css` and pin an explicit base border colour
that restores the v3 default:

```css
@import 'tailwindcss';

@theme {
  --breakpoint-xs: 410px;
}

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

This is the documented v4 upgrade-guide compatibility snippet. `var(--color-gray-200, …)`
resolves because v4 ships its default colour palette as CSS variables
(`--color-gray-200: #e5e7eb`), so a bare `border` renders the same `#e5e7eb` hairline it did
on the live site; the `currentColor` fallback only applies if that variable is ever removed.
The `--breakpoint-xs: 410px` line _adds_ `xs` to the default scale (sorted by value, so
`xs` < `sm`), mirroring the v3 `screens: { xs: '410px', ...defaultTheme.screens }` exactly.

## At-risk inventory (audited against `archive/src/**/*.js`)

**At risk — bare, un-coloured `border`, relied on the v3 gray-200 default:**

- `archive/src/components/organisms/testimonials.js:18` — carousel prev/next button,
  `className="border bg-primary-200 rounded p-2 …"`.
- `archive/src/components/organisms/testimonials.js:24` — the matching button, same pattern.

These two are the concrete regression target. They are ported in Epic 3 (Story 3.2 / the
content pages) and must render their gray-200 hairline identically; the guard above is what
makes that hold without adding a colour token to them.

**Not at risk — width paired with an explicit `border-secondary` colour token:**

- `archive/src/pages/index.js:52` — `border-4 … border-secondary`.
- `archive/src/components/molecules/nav-links.js:31` — `border-4 … border-secondary`.
- `archive/src/components/molecules/testimonial.js:9` — `border-2 border-secondary`.
- `archive/src/components/molecules/thing-i-like.js:6` — `border border-secondary`.
- `archive/src/components/atoms/pill.js:4` — `border border-secondary`.

The `border-secondary` / `border-inverse` tokens these use are wired in **Story 1.4**
(they map to `--color-border-secondary` / `--color-border-inverse`); they do not depend on
the gray-200 default.

**`ring`:** no `ring` utility exists anywhere in the archived source. **`divide`:** none
either. So no ring- or divide-specific guard is needed today. Note for the audit: v4 also
changed the default `ring` _width_ (3px → 1px) and colour (`blue-500` → `currentColor`), so if
a `ring` is ever introduced during a tier port it needs an explicit width and colour, not the
v4 default.

## Per-tier audit rule (the durable checkpoint)

During each Epic 2–3 atomic-design tier port, **every `border` / `ring` / `divide` added must
either specify an explicit colour token (e.g. `border-secondary`) or be a deliberate gray-200
default**, and the result is confirmed by the side-by-side visual diff against the live site.
Story 4.1's parity sign-off exercises this checkpoint as a hard gate before cutover — it
explicitly references "the Tailwind v4 border/ring/divide regression guard from Story 1.3".

## Consequences

- Bare `border` usages keep their gray-200 hairline; the v4 `currentColor` shift cannot
  silently regress borders to the text colour.
- **Dependency on the default palette:** this guard relies on Tailwind v4 shipping the default
  `--color-gray-200` variable. **Story 1.4 must not wipe the default colour palette** (e.g. via
  `--color-*: initial` in `@theme`) without re-pointing this guard at an explicit value, or
  bare borders silently fall back to `currentColor` — the exact regression this guard prevents.
- The compatibility snippet is "supported for compatibility, not idiomatic v4". That trade-off
  was accepted in 0002: faithful parity (NFR1) is the bar, not v4 idiom.
- The audit rule is carried as a per-tier Definition-of-Done item through Epics 2–3 and
  collated at Story 4.1.

## Alternatives considered

- **Add `border-gray-200` to each bare usage instead of a base guard** — rejected: scatters
  the fix across components, easy to forget on a new port, and the base guard matches v3's
  global default behaviour one-to-one.
- **Adopt v4's `currentColor` default and recolour each border** — rejected: changes visual
  output and reopens 0002's accepted parity-first trade-off for no benefit.

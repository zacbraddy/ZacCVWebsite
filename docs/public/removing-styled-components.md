---
title: Removing styled-components
section: Decisions
adr: 4
order: 4
teaser: Killing the CSS-in-JS runtime for CSS variables
---

## Context

The old site styled itself with styled-components, but its actual footprint was tiny: two `styled.div`s, one `createGlobalStyle`, and a single `keyframes` block across three files. That's a whole CSS-in-JS runtime shipping to the browser to do work that barely justifies a library at all.

Modernising the styling was one of the headline goals of the rebuild, so this was a deliberate target rather than something I stumbled into.

## Decision

I **removed styled-components entirely** and replaced it with plain global CSS variables for theming, `next-themes` for the dark/light switch, and CSS Modules for component-scoped styles. No CSS-in-JS runtime remains.

The shift is from styling computed in JavaScript at render time to styling that's just CSS:

```diff
- const Box = styled.div`
-   color: ${props => props.theme.colors.secondary};
- `;
+ /* component.module.css */
+ .box {
+   color: var(--color-text-secondary);
+ }
```

The colour now resolves from a CSS variable that the theme switch flips, with no JavaScript in the styling path.

> Three call sites do not justify a client-side styling runtime. Removing it is less code, less to ship, and one fewer thing between the markup and the paint.

## Consequences

The two halves of the old `createGlobalStyle` had to land somewhere. The theming half became a [static CSS-variable token system](/backroom/css-variable-theming), and the animation half became a CSS Module plus a thin client wrapper. I executed the removal incrementally as each component tier was ported, rather than in one big-bang commit, so the site stayed shippable throughout.

## Rejected alternatives

**Keeping styled-components** was the do-nothing option, and I rejected it. It was the explicit modernisation target, and keeping a client-side runtime alive for three call sites is exactly the kind of carried weight a modernisation pass exists to shed.

## Status / trail

Accepted and in force. No CSS-in-JS runtime ships. The theming replacement is documented in the [CSS-variable theming decision](/backroom/css-variable-theming).

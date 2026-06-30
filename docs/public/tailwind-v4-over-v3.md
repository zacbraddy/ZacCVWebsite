---
title: Tailwind v4 over v3
section: Decisions
adr: 2
order: 2
teaser: Why start the rebuild on v4, not greenfield on v3
---

## Context

The old Gatsby site used Tailwind v3 with a JavaScript `tailwind.config.js` token map. By the time I came to rebuild, Tailwind v4 was the current major: a new engine and, more importantly for me, a CSS-first configuration model where the theme lives in CSS rather than a JS config file.

The temptation on a migration is to keep what you know. I could have lifted the v3 config across unchanged and had a working site faster. The question was whether starting a fresh build on an already-superseded major was a saving or a debt.

## Decision

I adopted **Tailwind v4 with its CSS-first `@theme` configuration**, defining the design tokens in CSS instead of a JavaScript config object.

```css
@import 'tailwindcss';

@theme {
  --breakpoint-xs: 410px;
}
```

There is no `tailwind.config.js` in the project at all. The theme, the custom breakpoint, and the per-token utilities all live in `globals.css`, which keeps the styling story in one place and in the language the styles are actually written in.

> Starting a greenfield rebuild on the previous major, purely to dodge a migration, is a false economy. You pay the upgrade cost eventually, and you pay it on a bigger codebase.

## Consequences

v4 forced one piece of work I had to take seriously: it defaults `border`, `ring`, and `divide` colours to `currentColor`, where v3 defaulted them to `gray-200`. On a zero-regression migration that's a silent trap, so it earned [its own decision and a regression guard](/backroom/tailwind-border-guard).

The CSS-first model also shaped how I rebuilt theming. Rather than a flat shared palette, each token became its own [custom `@utility`](/backroom/css-variable-theming), which was the only way to reproduce the old light and dark palettes faithfully.

## Rejected alternatives

**Staying on Tailwind v3** was the obvious safe option, and I rejected it. Beginning a brand-new build on the previous major just to avoid one well-documented migration guard meant shipping something already a version behind on day one, for no real benefit.

## Status / trail

Accepted and in force. The whole site styles on v4, and the two pieces of work it triggered, the [border guard](/backroom/tailwind-border-guard) and the [theming token system](/backroom/css-variable-theming), are documented alongside this.

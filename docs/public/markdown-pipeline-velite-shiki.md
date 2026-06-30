---
title: Markdown pipeline, Velite + Shiki
section: Decisions
adr: 27
order: 27
teaser: How this very Backroom renders, and why not react-markdown or MDX
---

## Context

This Backroom is the reason this decision exists. It renders a set of curated markdown docs to themed, statically-exported HTML for a technical evaluator to read, and that forced the one genuinely open technical question of the whole project: which markdown pipeline renders the docs, and how do code blocks get syntax-highlighted?

The constraints are specific and unforgiving. The site is [static export only](/backroom/static-export-deploy), so markdown has to become HTML at build time with no server. Highlighting has to be baked into the prerendered HTML, not applied by a client-side highlighter, to keep the client-JS budget low. Rendered output has to obey the site's [theme tokens](/backroom/css-variable-theming) and flip with the light class. And on a deliberately small site, the pipeline is the one new dependency I was willing to take on, so it had to justify itself rather than drag in a stack.

## Decision

**Velite as the build-time content pipeline, with Shiki for syntax highlighting**, wired into the Next config.

Velite owns the whole content boundary. It reads the docs, validates frontmatter against a Zod schema, renders each body to an HTML string through its bundled remark/rehype engine, and emits a typed data layer that Server Components import at build time. The frontmatter contract _is_ the schema, so a malformed doc fails the build instead of shipping broken:

```ts
schema: s.object({
  title: s.string(),
  section: s.enum(['Overview', 'Decisions', 'Pragmatism & process']),
  order: s.number(),
  teaser: s.string(),
  adr: s.number().optional(),
  content: s.markdown(),
});
```

Shiki runs in Velite's rehype pass and bakes its colours straight into the HTML as CSS variables, so highlighting ships with zero client JavaScript:

```ts
const shikiTheme = createCssVariablesTheme({
  variablePrefix: '--shiki-',
});
```

Those `--shiki-*` variables are defined in `globals.css` and mapped to the site's theme tokens. The code plane itself is a constant near-black in both themes, so the code colours stay light-on-dark in both and need no separate light override.

> This ADR is itself a Backroom doc, which is fitting: the Backroom exists to show exactly these calls. The public write-up you're reading is a one-way derivation of the internal record, free to go deeper or lighter than the original.

## Consequences

The entire content path is build-time: Velite reads, validates, and renders, then Next prerenders every Backroom route to static HTML. Nothing about it introduces a runtime boundary, so it sits cleanly inside the static-export constraint. Adding a new doc is plumbing-free: drop a valid markdown file in, and the next build produces a new typed entry, a new nav row, and a new static route with no code change. The honest cost is two new build-time dependencies, but the net line-item count is actually lower than hand-assembly, since one configured tool replaces a string of plugins, and none of it reaches the client.

## Rejected alternatives

**`react-markdown`** was rejected: its pipeline runs synchronously, but Shiki is async by design, so it can't host build-time highlighting without pushing the work to the client at runtime, which defeats the whole constraint.

**`next-mdx-remote` / MDX** was rejected: it adds JSX-in-markdown, an explicit non-goal, plus a client runtime and the same async-Shiki friction, for no benefit on plain authored docs.

**Hand-assembling a unified pipeline** from its individual plugins was rejected as building a worse Velite from Velite's own parts. Velite already owns parsing, Zod validation, rendering, Shiki, and typed output in one configured tool.

> The trail here includes a correction, and I'm leaving it visible. I leaned toward react-markdown first, hit the sync-versus-async-Shiki wall, drafted a hand-assembled pipeline, then recognised it as a worse Velite and landed on Velite plus Shiki. The honest version of a decision includes the turn you had to take to reach it.

## Status / trail

Accepted and in force. It renders this Backroom, validated against the live framework versions, with highlighting baked into the static HTML and zero client JavaScript for the reading experience.

---
title: Static-export deploy
section: Decisions
adr: 3
order: 3
teaser: Zero-server static export over the Next runtime
---

## Context

The old site already deployed the way I wanted: push to `main`, Netlify builds, a static bundle goes live. The rebuild had to keep that shape. The risk on a framework migration is that you accidentally turn a content swap into a host migration, or quietly take on server infrastructure you then have to own forever.

Next.js gives you a choice here. You can run it as a server with SSR and serverless functions, or you can export it as a pure static site. That was the decision to make.

## Decision

I went with **pure static export** (`output: 'export'`). Everything resolves at build time and the output is a folder of static files, with no server runtime in production at all.

```ts
// next.config
const nextConfig = {
  output: 'export',
};
```

That one line is load-bearing. It means no SSR, no incremental regeneration, no API routes or middleware at runtime. Every page is prerendered to HTML and shipped as-is.

> For a CV site, a server you have to keep alive is a liability, not a feature. The less infrastructure I own, the less there is to break at 2am.

## Consequences

The deploy stayed identical to the old one, so cutover was a content swap rather than a pipeline rebuild. The trade-off is that static export disables Next's built-in image optimiser, which forced a follow-on decision about [how to serve optimised images with no backend](/backroom/image-loader-no-backend).

It also set a hard constraint for everything built afterwards, including this Backroom: any content rendering has to happen at build time. That directly shaped the [markdown pipeline decision](/backroom/markdown-pipeline-velite-shiki), which renders and highlights every doc before deploy rather than at runtime.

## Rejected alternatives

**Netlify's Next.js runtime**, with SSR and functions, was the alternative. I rejected it. It adds a serverless surface area this site has no need for and complicates a like-for-like cutover, all to support features a static CV site never uses.

## Status / trail

Accepted and in force. Every route exports as static HTML, verified at build with no serverless functions emitted. The image-serving consequence is resolved in the [image loader decision](/backroom/image-loader-no-backend).

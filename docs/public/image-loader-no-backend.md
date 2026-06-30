---
title: Image loader, no backend
section: Decisions
adr: 14
order: 14
teaser: Serving optimised images with no backend of my own
---

## Context

The [static-export decision](/backroom/static-export-deploy) bought a deploy with no server. It also took something away: static export disables Next's built-in image optimiser. That forces a sharp question. Do I add a backend to my deploy purely to serve optimised images, or do I keep the deploy completely static and let managed infrastructure do the optimising?

Adding image optimisation back the "normal" way means bundling an image function into the deploy, which is a backend I'd own and maintain solely to load pictures. That directly contradicts the zero-server promise I'd just made.

## Decision

**No image backend. Point `next/image` at Netlify's managed Image CDN with a URL.** The optimisation still happens, resizing, re-encoding, and caching at request time, it just runs on managed infrastructure I don't own, deploy, or maintain. My loader isn't an optimiser at all; it's a URL builder:

```ts
const netlifyImageLoader = ({ src, width, quality }) => {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality || 75),
  });
  return `/.netlify/images?${params}`;
};

export default netlifyImageLoader;
```

It's wired in via `images: { loader: 'custom', loaderFile: './src/image-loader.ts' }`. Because a custom loader _replaces_ the default optimiser, this is also what makes `next/image` legal under `output: 'export'` at all, so there's no `images.unoptimized` flag fighting it.

> The fact that this is about five lines of stable glue is a welcome bonus, not the reason. The reason is keeping the deploy purely static with no backend of my own to keep alive.

## Consequences

`next/image` works under static export with images routed through the Image CDN, verified by the built output emitting `/.netlify/images?...` URLs and no serverless functions. One detail mattered for local development: the optimiser endpoint only exists on Netlify, so the loader short-circuits under `NODE_ENV=development` to return the plain `public/` path, which lets real images render under `next dev` while production builds stay unchanged.

## Rejected alternatives

**`images.unoptimized: true`** was rejected: it ships unoptimised images and throws away the Image CDN, and it's redundant once you have a custom loader anyway.

**Next's built-in optimisation via the Netlify Next runtime** was rejected on principle: it serves images by bundling an image function into the deploy, reintroducing exactly the backend the [static-export decision](/backroom/static-export-deploy) exists to avoid. It isn't a dependency I declined to save maintenance; it's architecturally incompatible with a zero-functions static export.

## Status / trail

Accepted and in force. Images serve through the managed CDN with no functions in the deploy, confirmed on a Netlify preview before cutover.

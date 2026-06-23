# 0024 — Content thumbnail: GatsbyImage `CONSTRAINED` → `next/image` reconciliation

- **Status:** Accepted
- **Date:** 2026-06-22
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, images, parity

## Context

The `/content` gallery (Story 3.4) is the first place real, varying-aspect-ratio raster
content images flow through `next/image` + the Netlify Image CDN loader. The archive
`ContentThumbnail` rendered a `GatsbyImage` with `gatsbyImageData(width: 300, layout: CONSTRAINED)`
and a single `className="md:h-full"`. `CONSTRAINED` means: display at up to 300px wide, scale
**down** to fit narrower containers, preserve the source aspect ratio, with `object-fit: cover`.

A faithful, verbatim port of just `className="md:h-full"` does **not** reproduce that behaviour
under `next/image`: an image with explicit intrinsic `width`/`height` is **not responsive by
default** — it renders at its natural pixel size unless CSS constrains it. With the real source
dimensions (e.g. `tabs-and-spaces` at 1500×1500), a literal port blows out the layout. So the
Story 3.4 "Thumbnail parity risk" Dev Note's reconciliation path was forced, which AC #7 says to
capture here.

## Decision

`src/components/atoms/content-thumbnail.tsx` is a Server Component that maps `imageName` to a
static `{ src, width, height }` record (the real intrinsic dimensions, non-negotiable for CLS /
AR17) and renders `next/image` with a reconciliation className that reproduces `CONSTRAINED` in
the card's two layout contexts:

```
className="w-full max-w-[300px] h-auto object-cover md:h-full md:w-48 md:max-w-none"
```

- **Mobile (stacked):** `w-full max-w-[300px] h-auto` — fills the card width but caps at 300px,
  scaling down at natural aspect ratio (the `CONSTRAINED` width:300 ceiling).
- **Desktop (`md:`):** `md:h-full md:w-48 md:max-w-none object-cover` — fills the fixed
  ~192×144 image box (`md:w-48` × the card's `md:h-36`) cover-cropped, matching the archive's
  `md:h-full` inside the `md:w-48` cell.

A `sizes="(min-width: 768px) 192px, 300px"` hint is supplied for the loader. `alt=""` is kept
(decorative thumbnail inside a labelled link; the archive `GatsbyImage` had no alt), and the
archive's missing-image fallback `<div>` string is preserved verbatim (including the `:S`).

## Consequences

- Establishes the GatsbyImage→`next/image` strategy for any future raster content ports: static
  intrinsic-dimension map + a className that reconciles the source layout mode, rather than a
  blind className copy.
- The displayed sizing/cropping is a reconciliation, not a byte-for-byte className copy, so the
  final dot-for-dot visual match against the live site (both themes, desktop + mobile) is routed
  to the **Story 4.1** all-tier visual gate, where the thumbnail rendering is an explicit check.
- No new dependency, no loader change (paths are site-relative kebab-case `/images/*.jpg`, so the
  Story 1.7 loader-robustness deferrals do not bite).

## Alternatives considered

- **Verbatim `className="md:h-full"` only** — rejected: demonstrably breaks layout for
  larger-than-box source images under `next/image`'s intrinsic-size rendering.
- **`fill` + `object-cover` in a sized wrapper** (the `portrait-image.tsx` idiom) — rejected as
  the starting point: `fill` needs a positioned, fixed-size parent, but the mobile image area has
  no fixed height, so the intrinsic-dimensions path is the more faithful reproduction of
  `CONSTRAINED` across both layouts.

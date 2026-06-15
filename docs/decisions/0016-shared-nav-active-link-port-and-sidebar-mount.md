# 0016 — Shared nav: `usePathname` active-link port, desktop-sidebar mount & CV-PDF relocation

- **Status:** Accepted
- **Date:** 2026-06-15
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, navigation, routing

## Context

Story 2.2 ports the archive Gatsby navigation (`molecules/nav-links.js` + `atoms/nav-link.js`)
into the Theseus Next App Router build and ships it visibly. Three non-obvious calls had to be
made: how to replace Gatsby's active-link detection without `useState`; how to ship a single
shared nav component when its two real consumers (desktop sidebar, mobile burger menu) land in
different stories and across the Server/Client boundary; and how to keep the Download CV URL
unchanged when static assets move out of Gatsby's `static/`.

## Decision

**(a) Active-link detection: Gatsby `<Link getProps>` + local `useState` → `usePathname`-derived
boolean in a `'use client'` leaf (AR8).**
The archive pushed its active result into component state via a `getProps` callback. The
idiomatic-Next replacement derives the flag on each render — no `useState`, no `useEffect`, no
callback — in the `'use client'` `nav-link.tsx` leaf:

```tsx
const pathname = usePathname();
const isCurrent =
  (to === '/' && pathname === to) || (to !== '/' && pathname.startsWith(to));
```

The match rule is preserved **verbatim**: home matches by exact equality (so it isn't highlighted
on every route, since every path `startsWith('/')`); the others match by `startsWith` (so `/resume`
stays active on any `/resume/...` sub-path). The active class stays the static literal
`'text-secondary font-bold'`, never interpolated, for Tailwind-scan parity. `usePathname()` under
`output: 'export'` returns the path without a trailing slash, matching the `startsWith`
expectations — no trailing-slash handling needed. Both branches were verified at prerender time:
on `/` only Home is active; on a throwaway `/resume` route only Resume is active (and Home is not),
confirming exact-vs-`startsWith`.

**(b) The single shared nav is mounted in the desktop sidebar `<nav>` now; the optional `onClick`
is the seam that keeps it one component.**
The archive renders `nav-links.js` in two places: the desktop sidebar `<nav>` (no `onClick`) and
the mobile slide-in menu (`onClick={() => setMenuOpen(false)}`). To ship something visible in 2.2,
the shared component is mounted into the desktop sidebar `<nav>` (`hidden lg:flex`, archive markup
verbatim) inside the existing empty sidebar container in `layout.tsx`. The component exposes an
optional `onClick` prop so Story 2.4 can compose the _same_ component into the mobile menu with a
close-handler — no duplicate nav definition. The sidebar identity grid (portrait/name/job-title/
socials, 2.3) and the burger menu + `MenuOpenContext` (2.4) stay deferred; only the `<nav>` is
added. The client boundary is kept at the leaf: `nav-link.tsx` is `'use client'` (it reads
`usePathname`), while `nav-links.tsx` stays directive-free so it composes into a Server Component
parent (the 2.2 sidebar, where `layout.tsx` keeps its `metadata` export) **or** a Client Component
parent (the 2.4 menu, which can pass the `onClick` function).

**(c) CV-PDF relocation `archive/static/pdfs/` → `public/pdfs/`, URL unchanged (AR10).**
`zac-braddy.pdf` is copied (byte-identical) into `public/pdfs/` so it resolves at the unchanged URL
`/pdfs/zac-braddy.pdf` and is included in the static export. The Download CV control stays a native
`<a href="/pdfs/zac-braddy.pdf" target="_blank" rel="noreferrer" download>` — a file download, not
in-app navigation, so it is **not** routed through `next/link`. The archive `static/` copy is left
in place; the Gatsby build runs untouched until the Epic 4 cutover (AR1).

## Consequences

- No new runtime dependency: links use built-in `next/link`, icons use the already-present
  `@fortawesome/*` packages (NFR5/NFR6). No `gatsby`, no `@reach/router`.
- The nav is a single shared component reusable by 2.4 via the optional `onClick`, with the only
  client surface at the `NavLink` leaf.
- `layout.tsx` stays a Server Component; the sidebar identity grid (2.3) slots **above** the `<nav>`
  in the same container later.
- The CV PDF now exists in both `archive/static/` and `public/`; the archive copy is removed at the
  Epic 4 Gatsby retirement, not now.
- Full `startsWith` active-state parity across real non-home routes lands once Epic 3 adds routes /
  at the Story 4.1 visual-diff gate; the mechanism itself is proven.

## Alternatives considered

- **Keep `useState` + a `getProps`-style callback** — rejected: redundant in the App Router, where a
  client component re-renders on navigation and `usePathname` can be derived directly; more state,
  no benefit.
- **Route Download CV through `next/link`** — rejected: it is a file download, not navigation; a
  plain `<a download>` preserves today's behaviour exactly (FR16).
- **Put `'use client'` on `nav-links.tsx` "just in case"** — rejected: it would force the whole nav
  list client-side and block the Server Component sidebar mount; the boundary belongs at the leaf
  (NFR5 / AR14).

## Archive `xl: mr-0` quirk — corrected to `xl:mr-0` (code-review call, 2026-06-15)

The archive sidebar `<nav>` className contained `xl: mr-0` — the space makes `xl:` a dangling no-op
prefix and `mr-0` an unconditional class, so the intended responsive `xl:mr-0` (reset the right
margin at the `xl` breakpoint) was never emitted. It was **initially ported verbatim** under the
zero-regression bar (NFR1) and flagged for the Story 4.1 visual-diff gate.

**During the Story 2.2 code review it was corrected to `xl:mr-0`** (Zac's call): the space is plainly
an unintended typo, the intent is unambiguous, and silently carrying archive bugs into the Theseus
build is exactly the anti-pattern the migration exists to avoid (it contradicts the idiomatic-Next
principle). This is a conscious, recorded step off strict live-site parity. **Rendered consequence:**
the sidebar `<nav>` is `hidden lg:flex`, so this only affects `lg`+; at `xl`+ its right margin now
resolves to `0` (intended) instead of the `mr-3.5` (0.875rem / 14px) the broken class left in place,
so the Theseus nav will sit 14px further right at `xl`+ than the (equally-bugged) live Gatsby site.
That delta is the _intended_ layout; it is noted for the Story 4.1 visual-diff gate as an expected,
deliberate difference rather than a regression.

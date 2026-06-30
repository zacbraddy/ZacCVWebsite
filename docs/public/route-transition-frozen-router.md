---
title: Route-transition FrozenRouter
section: Decisions
adr: 25
order: 25
teaser: Restoring out-then-in page parity on a Next internal API
---

## Context

The old site had a specific page-transition feel: on first load only the in-animation plays, and on navigation the outgoing page animates out before the incoming page animates in. When I checked the rebuild against the live site at the parity gate, it was wrong in two ways. The full out-then-in cycle was playing on every load, and on navigation the new page appeared instantly and then ran the animations on itself.

Both came down to the App Router working differently from Gatsby in ways that broke the old assumptions:

1. In Gatsby the layout received the page as a plain, frozen React element, so the old animation logic could keep rendering the outgoing page through its exit. In the App Router, the page slot is a _live_ route, so re-rendering the captured element re-reads the current route and renders the _new_ page. The outgoing page can't be held still. This is a well-known App Router exit-animation limitation.
2. The exit animation was triggered off the page object's identity, which fired on the first re-render after mount. In this stack that re-render is the post-hydration theme-resolve from `next-themes`, so a spurious exit played on load. Gatsby had no equivalent re-render, so its simpler guard had been enough.

## Decision

I reproduced the old behaviour with two minimal, parity-restoring changes rather than a redesign.

**Freeze the router context around the transitioning content.** A small client component captures the router context once and re-provides that frozen value to its subtree, so the outgoing page keeps rendering its own frozen route through the exit while the incoming page mounts fresh under a new key:

```tsx
const frozen = useState(() => useContext(LayoutRouterContext))[0];

return (
  <LayoutRouterContext.Provider value={frozen}>
    {children}
  </LayoutRouterContext.Provider>
);
```

**Trigger the exit on a stable change key, not object identity.** The animation now fires only when the pathname actually changes, which is robust against the theme-resolve re-render and against dev-mode double-invokes.

> The honest cost here is a dependency on a Next internal API to capture that router context. It's the standard community workaround for App Router exit animations, and I'm recording it as an accepted risk rather than pretending it's clean. It can break on a major Next upgrade, so it's a single, documented point to revisit, with the View Transitions API as the likely future replacement.

## Consequences

Route-transition parity with the live site is restored: load plays in-only, navigation plays out-then-in, in both themes. The internal-API import is flagged on the upgrade checklist as the one place to fix if a future Next release changes it. No content, layout, or styling changed; only the transition wiring.

## Rejected alternatives

**Enter-only animation** via the App Router's idiomatic template approach was rejected: it's cleaner, but it drops the outgoing-page exit, so it fails parity with the live site.

**Disabling React's StrictMode** was rejected: it would only mask the development symptom and leave the production regression in place.

## Status / trail

Accepted and in force. Verified in-browser in both dev and the static production export, in both themes.

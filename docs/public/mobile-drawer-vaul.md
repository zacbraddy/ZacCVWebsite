---
title: Mobile drawer on vaul
section: Decisions
adr: 18
order: 18
teaser: Choosing vaul over a stale lib or hand-rolling a11y
---

## Context

On narrow screens the old site had a burger menu drawer, built with `react-burger-menu`. It was the last piece of mobile navigation chrome I needed to port, and below the large breakpoint there's no other way to get around the site, so it had to work. The interesting decision wasn't whether to have a drawer, it was what to build it on.

## Decision

**I used `vaul`**, a modern drawer library built on Radix's dialog primitive, in preference to either re-adding the old library or hand-rolling my own.

A drawer is one of those components that looks like a bit of CSS and a `translateX` and turns out to be a pile of accessibility mechanics. Done properly it needs a focus trap, body-scroll lock, an `Esc` handler, ARIA wiring, and a portal. `vaul` provides all of that, has a peer range that explicitly includes React 19, and ships unstyled, so I could dress it in the old site's exact drawer look with a CSS Module ported across more or less byte-for-byte.

Because the root layout has to stay a Server Component to keep its metadata export, the open/close state couldn't live there. It lives in a small client context provider instead, which also lets a future page-content call open the drawer:

```tsx
<Drawer.Root open={menuOpen} onOpenChange={setMenuOpen}>
  <Drawer.Title className="sr-only">Navigation menu</Drawer.Title>
  {/* nav links */}
</Drawer.Root>
```

> Hand-rolling a drawer is hand-rolling a focus trap, a scroll lock, an Esc handler, and an ARIA contract. That's a library in disguise, with real regression risk on a parity migration. I'd rather lean on a maintained primitive that gets the hard parts right.

## Consequences

`vaul` is the one new direct dependency this brought in, and its Radix dialog transitive is modern and well-maintained. The build stays a pure static export, since the drawer is client-only and portals at runtime. The honest catch is a behavioural delta worth naming.

> `vaul` renders the drawer as a true modal dialog: it traps focus, makes the background inert, and animates with a spring. The old drawer was non-modal with a plain ease slide. So the new one is _more_ accessible and correct, but it does behave differently from the site it replaces. On a zero-regression migration I'm calling that a deliberate accessibility improvement rather than a defect, and I flagged it for the parity gate so the call was made in the open, not buried.

## Rejected alternatives

**Re-adding `react-burger-menu`** was rejected: I verified it would actually run on React 19, but it's a stale class-component library that drags extra packages into the bundle for an icon morph the old site didn't even use.

**Hand-rolling the drawer natively** was rejected: true parity needs the focus trap, scroll lock, `Esc`, and ARIA, which is rebuilding a library with more risk and no upside.

## Status / trail

Accepted and in force, with the modal-semantics delta recorded as the one accepted exception to strict parity and signed off at the visual-diff gate.

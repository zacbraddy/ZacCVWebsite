# 0025 — Route-transition parity: FrozenRouter + pathname-keyed trigger

- **Status:** Accepted
- **Date:** 2026-06-23
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, animations, app-router

## Context

The Story 4.1 parity gate surfaced a real FR7 regression: the page content played the **whole
out→in cycle on every load** (shrink+fade `bounceOut`, then slide-up `fadeInUp`), and on
navigation the **incoming** page appeared instantly then ran the out/in animations on _itself_ —
instead of the Gatsby behaviour (Zac confirmed live is correct): on load only the in-animation
plays; on navigation the **outgoing** page animates out, then the **incoming** page animates in.

Two App-Router-specific root causes, both downstream of decisions made in ADR 0015 (which ported
the archive `AnimateOnChange` and triggered the route transition off the `children` reference):

1. **The "freeze the outgoing page" assumption no longer holds.** In Gatsby, `wrapPageElement`
   handed the layout the page as a **plain, frozen React element**, so `AnimateOnChange`'s
   `displayContent` state could keep rendering the old page through the out-animation. In the Next
   App Router, `{children}` is a **live route slot** wired to `LayoutRouterContext`; re-rendering
   the stashed element re-reads the _current_ router context and renders the **new** route — so the
   capture can't hold the old page (a well-known App Router exit-animation limitation).
2. **The out-animation fired on incidental re-renders.** Triggering off the `children` _object
   identity_ (`useEffect(…, [children])` guarded by a one-shot `firstUpdate` ref) fired on the
   first re-render after mount — which in this stack is the `next-themes` post-hydration
   theme-resolve re-render (and, in dev, React StrictMode's double-invoke, which also defeats the
   `firstUpdate` guard) — producing a spurious `out` on load. Gatsby had no equivalent
   post-mount re-render, so its guard sufficed.

## Decision

Reproduce the Gatsby behaviour with two minimal, parity-restoring changes (no redesign):

**(a) Freeze the router context around the transitioning content — `FrozenRouter`.**
A new client atom `src/components/atoms/frozen-router.tsx` captures `LayoutRouterContext` once
(via a `useState` lazy initial, kept lint-clean against `react-hooks/refs`) and re-provides that
frozen value to its subtree. `ContentTransition` wraps the page content in `<FrozenRouter>` inside
the existing `key={pathname}` boundary. The outgoing page (held in `displayContent`) keeps
rendering **its own** frozen route through `bounceOut`; the incoming page mounts fresh under a new
`pathname` key and captures the current route, then plays `fadeInUp`. This restores Gatsby's
frozen-`element` semantics. It relies on `LayoutRouterContext` imported from
`next/dist/shared/lib/app-router-context.shared-runtime` — a Next **internal** API, and the
standard community workaround for App Router exit animations.

**(b) Trigger the out-animation on a stable change key, not children identity.**
`AnimateOnChange` gains an optional `changeKey` prop and fires `out` only when the key's value
changes (previous-value comparison instead of the `firstUpdate` one-shot). `ContentTransition`
passes `changeKey={pathname}` (out only on real navigation); `rotating-job-title` passes
`changeKey={index}` (out only on a genuine title change — also removes a latent same-class
flicker on the home page). This matches Gatsby, where `children` only changed on navigation, and
is robust against both the `next-themes` hydration re-render and dev StrictMode.

Verified by Zac in-browser (both `npm run dev` and the static production export): load plays
in-only; navigation plays out-on-old then in-on-new; both themes. `npm run build` green + pure
static export, `npm run lint` clean.

## Consequences

- Route-transition parity with the live Gatsby site is restored (FR7); supersedes the
  `children`-reference trigger described in ADR 0015(c).
- Adds a dependency on a Next **internal** import (`app-router-context.shared-runtime`). This can
  break on a Next major upgrade; if the import path/shape changes, `FrozenRouter` is the single
  point to update (or replace with the View Transitions API if adopted later). Flagged for the
  upgrade checklist.
- `AnimateOnChange` is now keyed explicitly by its consumers; the `changeKey ?? children` fallback
  preserves the original behaviour for any future consumer that omits it.
- No content, layout, or styling change; animation keyframes/durations (ADR 0015) are untouched.

## Alternatives considered

- **Enter-only animation via `template.tsx`** — idiomatic App Router, but drops the outgoing-page
  out-animation, so it fails parity with the live site (Zac wants the out-then-in cycle).
- **Disabling React StrictMode** — would only mask the dev symptom; the production regression
  (next-themes re-render + the unfrozen route slot) would remain. Rejected.

---
title: Framework decision
section: Decisions
adr: 1
order: 1
teaser: Why Next.js, and why not Astro
---

## Context

This site has stood as a portfolio piece for me for a very long time, and most recently I'd found that it had fallen behind on both the freshness of its content and the tech it ran on. So I went and applied the same System Modernisation techniques I provide to my clients on a daily basis.

It used to run on Gatsby 5 with plain JavaScript. It worked, but the foundations were ageing. Gatsby was on a deprecating trajectory, there was no type safety, and the data layer leaned on an ageing `@reach/router` plus a GraphQL setup that was far more machinery than a CV site needs. The question was never _whether_ to move. It was _what_ to move to.

## Decision

I rebuilt it on **Next.js 16 (App Router) with React 19.2 and TypeScript in strict mode**.

The App Router pins its own validated React version, so React 19.2 came along with the framework rather than being a separate bet I had to place. Strict TypeScript from day one made the type safety the old site lacked part of the substance of the rebuild, not a nice-to-have bolted on later.

> The pragmatism call: the right tool is the one a sole maintainer can still reason about in 18 months, not the one that benchmarks best on launch day.

A few supporting calls followed from the same instinct, each recorded in its own decision: moving to [Tailwind v4](/backroom/tailwind-v4-over-v3) with its CSS-first configuration, [dropping styled-components](/backroom/removing-styled-components) so there's no CSS-in-JS runtime, and doing the [TypeScript conversion as one clean cut](/backroom/big-bang-typescript) rather than running a mixed-mode seam through the project. Each was the same thinking: start the new build on current, well-supported foundations, and keep the moving parts few enough that one person can hold the whole thing in their head.

## Consequences

Building Next-native from day one meant I wrote idiomatic App Router code rather than porting Gatsby idioms across and fighting the framework. It also keeps the door open for the content pipeline this very Backroom now runs on, which turned out to matter more than I expected at the time.

The strict-TypeScript choice commits the project to a [big-bang conversion](/backroom/big-bang-typescript) with no half-typed middle state, and the App Router's exit-animation model later cost me a real piece of work to restore route-transition parity, recorded under the [route-transition decision](/backroom/route-transition-frozen-router). Both were known trade-offs, taken with eyes open.

## Rejected alternatives

The more interesting part is what I ruled out. **Astro** is the obvious candidate for a content-heavy static site, and on paper it's a strong fit. I didn't choose it. Next's App Router is the mainstream, best-supported option for a static-export site like this one, and it keeps the door open for a markdown pipeline. That last point was the deciding factor: the tool with the widest support and the most room to grow beat the one that looked tidiest for the narrow job in front of me.

**Staying on Gatsby 5** was never really on the table either. The deprecating stack was the whole reason for the move, so carrying it forward would have defeated the point.

## Status / trail

Accepted and in force. The whole site, including this Backroom, runs on it, and the markdown pipeline I left room for is documented under the [Velite + Shiki decision](/backroom/markdown-pipeline-velite-shiki).

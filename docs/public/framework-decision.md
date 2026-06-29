---
title: Framework decision
section: Decisions
adr: 4
order: 1
teaser: Why Next.js, and why not Astro
---

# Framework decision

This site has stood as a portfolio piece for me for a VERY long time. Most recently I'd found that it has really fallen behind when it came to the freshness of both the content and the tech it used and so I went and applied the same System Modernisation techniques that I provide to my clients on a daily basis. 

The site used to run on Gatsby 5 with plain JavaScript. It worked, but the foundations were ageing. Gatsby was on a deprecating trajectory, there was no type safety, and the data layer leaned on an ageing `@reach/router` and a GraphQL setup that was far more machinery than a CV site needs. The question wasn't _whether_ to move. It was _what_ to move to.

I rebuilt it on **Next.js 16 (App Router) with React 19.2 and TypeScript in strict mode**.

The more interesting part is what I ruled out. **Astro** is the obvious candidate for a content-heavy static site, and on paper it's a strong fit. I didn't choose it. Next's App Router is the mainstream, best-supported option for a static-export site like this one, and it keeps the door open for the content pipeline this very Backroom now runs on. That last point was the deciding factor. The tool with the widest support and the most room to grow beat the one that looked tidiest for the narrow job in front of me.

> The pragmatism call: the right tool is the one a sole maintainer can still reason about in 18 months, not the one that benchmarks best on launch day.

Because the codebase was small, I did the TypeScript conversion as a single clean cut rather than running a mixed JavaScript/TypeScript seam through the project. Less ceremony, and no half-migrated middle state to maintain.

A couple of supporting calls followed from the same thinking. I moved to **Tailwind v4** with its CSS-first configuration rather than starting a fresh build on the previous major, and I dropped styled-components entirely so there's no CSS-in-JS runtime cost. Theming is plain CSS variables instead. Each was the same instinct: start the new build on current, well-supported foundations, and keep the moving parts few enough that one person can hold the whole thing in their head.

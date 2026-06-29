---
title: Deferring the polish
section: Pragmatism & process
order: 1
teaser: Choosing what not to build, to protect delivery
---

# Deferring the polish

The fastest way to miss a deadline is to gold-plate the parts nobody asked about. Especially as this gold-plating is most often accompanied with many hours of naval gazing about architecture and stuf like "what to name things"! 

On this rebuild I treated scope discipline as a feature in its own right. The job was to move the site onto modern foundations without regressions, and anything that wasn't that got [logged and left for later](/backroom/building-with-ai-and-bmad) on purpose, not by accident.

That discipline left a paper trail, and the trail is the point:

- Around **eight** conscious steps away from like-for-like parity. Each one was a deliberate, recorded call I signed off: fixing an obvious typo rather than faithfully porting the bug, a clearer accessibility label, a couple of small content corrections.
- **Twenty-plus** improvements consciously **deferred** rather than done: an accessibility backlog, a content refresh, an analytics-consent layer, various speculative hardening. All real, all worth doing, none of them this project's job.
- **Zero** speculative work. Although, there were plenty of opportunities to tidy up and/or make small quality of life or feature improvements, nothing got built "while I was in there" on the off-chance it would be useful one day.

> Every deferred item is evidence the build stayed in scope, not a corner cut. A "no, not now" written down is worth more than a "yes" that quietly blows the budget.

The temptation in a project like this is always to keep polishing: to harden the edge case that can't currently happen, to refactor the thing that already works. I find it more useful to name those urges, write them down, and protect the delivery instead. The deferred list isn't a list of failures. It's the record of a build that knew where its edges were.

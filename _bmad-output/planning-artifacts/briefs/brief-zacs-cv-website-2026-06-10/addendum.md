---
title: "Addendum: Zac's CV Website Product Brief"
status: final
created: 2026-06-10
updated: 2026-06-10
---

# Addendum — Zac's CV Website

Depth that supports the brief but belongs downstream (PRD / architecture / Project 2
planning). The brief stays lean; this is where the reasoning and detail live.

## Framework Decision — Options Considered

The original plan was a dependency upgrade in place. Discovery surfaced that the
underlying framework choice itself needed re-evaluating, producing three options:

| Option | Summary | Verdict |
|---|---|---|
| **A. Upgrade Gatsby in place** | Bump all deps, rework code on Gatsby 5+ | **Rejected** — polishes a framework the market has left |
| **B. Migrate to Astro** | Rebuild on Astro; React components become islands | **Rejected** — strong on merits, weak on skill marketability |
| **C. Migrate to Next.js + TypeScript** | Rebuild on Next.js App Router + TS | **Chosen** |

**Why not A — Gatsby is in maintenance limbo.** Netlify acquired Gatsby (Feb 2023), cut
the engineering headcount, and active development largely halted; ecosystem consensus is
"don't start new projects on it." It peaked ~2022 and has declined since. Upgrading a
dying framework is the weakest story on every axis — and the opposite of the System
Modernisation capability Zac sells. Sources:
- [Is GatsbyJS Officially Dead? — GitHub discussion #39062](https://github.com/gatsbyjs/gatsby/discussions/39062)
- [The End of My Gatsby Journey — Smashing Magazine (2024)](https://www.smashingmagazine.com/2024/03/end-of-gatsby-journey/)
- [Gatsby is going down — Bejamas](https://bejamas.com/blog/gatsby-going-down-and-taking-your-website-along)

**Why not B — Astro was the better *technical* fit but the weaker *business* fit.** For
a content/portfolio site Astro is arguably the stronger tool (≈0 kB JS by default,
islands, native markdown→HTML, TS-first, top Lighthouse scores), and the facilitator
initially leaned this way. But a core *job* of this site is to demonstrate in-demand
skills and give Zac marketable experience — and Next.js job-market demand vastly exceeds
Astro's. Tool-purity lost to skill marketability, deliberately.

**Why C — Next.js + TypeScript.** Most in-demand keyword and skill; gives Zac real reps;
markdown→HTML is a solved problem in the Next ecosystem (MDX / `next-mdx-remote` /
`react-markdown`), so the backroom is no harder for it. The migration itself becomes the
documented modernisation case study.

_To revisit at architecture stage: specific Next.js rendering strategy (SSG vs hybrid),
the markdown/MDX pipeline choice, and hosting (current site is a static bundle on
`zackerthehacker.com` with `gatsby-plugin-google-gtag`)._

## Documentation Strategy — Two Homes, One-Way Flow

- **`_bmad-output/`** — raw process/audit artefacts, generated as work happens during
  Project 1. Captured to a "useful-for-the-active-work + solid base" standard only.
- **`docs/`** — curated, public-facing documentation *derived* from the raw artefacts in
  Project 2; polished and free to deviate in depth/emphasis to put Zac's best foot
  forward. This is what the markdown→HTML pipeline renders into the backroom.
- **Principle:** `docs/` is derived and curated, **not a mirror** — process docs are the
  source, public docs are the edit. One-way street, to avoid a sync chore.
- Fits the repo grain: `project-context.md` already designates `docs/` as the project
  knowledge folder.
- **Pragmatism call (itself documented content):** public-doc polishing is deferred from
  Project 1 to Project 2 to protect Project 1's delivery velocity — an exemplar
  "delivery-first" decision destined for the backroom.

## Backroom — UX Detail (Project 2)

- **Opt-in depth, not an audience merger.** Front-of-house stays recruiter-flashy; the
  backroom is a deliberate side-door technical evaluators choose to enter. Recruiters
  never have to encounter it.
- **Entry points:**
  - A *"More interested in how this site is built?"* link — present but unshowy.
  - A **console ASCII-art Easter egg** shown when technical users open dev tools, with
    clickable links to the backroom and the site's GitHub repo (tech-recruiting
    Easter-egg tradition, à la GitHub / Stripe).
- **Content:** the curated `docs/` set — ADRs, research, reasoning, and the documented
  pragmatism calls from the Project 1 modernisation.

## Parked — Far-Future Ambitions (Not Planned)

The site is permanent work-in-progress by design. Beyond the two projects in this brief,
nebulous future ambitions (more skill demonstrations, an ever-richer backroom, updates as
contracts are won and the industry shifts) are intentionally **not** planned in detail —
captured here only so they are not mistaken for omissions.

# Decision records

Architecture Decision Records (ADRs) for the CV website — one short record per non-obvious
technical decision behind the current build, kept so future readers understand **why** the
code is the way it is without re-deriving it.

This is a **historical index of decisions**, not an operating manual. For the active rules a
contributor (human or LLM) needs when working on the site today — stack, theming system,
atomic-design structure, gotchas — read
[`_bmad-output/project-context.md`](../../_bmad-output/project-context.md). Each ADR is a
snapshot of a decision at the time it was taken; later decisions may supersede earlier ones
(noted via Status), but records are not rewritten to match how the project evolves.

## Where ADRs live and how they're named

- One markdown file per decision, in this directory.
- Numbered sequentially with a kebab-case title: **`NNNN-kebab-title.md`**
  (e.g. `0001-nextjs-16-react-19-typescript-strict-stack.md`).
- The format is defined by [`_template.md`](_template.md) — a MADR-lite shape:
  Status, Date, Decider, Tags, Context, Decision, Consequences, optional Alternatives.

## Status vocabulary

- **Proposed** — under consideration, not yet committed.
- **Accepted** — the decision is in force.
- **Superseded** — replaced by a later ADR (link to it).

## Adding a record

When a new non-obvious decision is made, add a file with the next free number following
`_template.md`. Keep it concise and factual — what was decided and why, for a future reader.
A record can capture a decision to change, modernise, or reverse an earlier one; if it
replaces an existing ADR, mark the old one **Superseded** and link forward.

## Index

| #    | Title                                                                                                                                                                            | Status   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0001 | [Next.js 16 + React 19.2 + TypeScript (strict) stack](0001-nextjs-16-react-19-typescript-strict-stack.md)                                                                        | Accepted |
| 0002 | [Tailwind v4 over v3](0002-tailwind-v4-over-v3.md)                                                                                                                               | Accepted |
| 0003 | [Netlify deploy Path A (static export)](0003-netlify-deploy-path-a-static-export.md)                                                                                             | Accepted |
| 0004 | [Full styled-components removal](0004-remove-styled-components.md)                                                                                                               | Accepted |
| 0005 | [Big-bang TypeScript conversion](0005-big-bang-typescript-conversion.md)                                                                                                         | Accepted |
| 0006 | [`archive/`-at-root coexistence model](0006-archive-at-root-coexistence-model.md)                                                                                                | Accepted |
| 0007 | [Linting & formatting tooling: Prettier + ESLint](0007-linting-and-formatting-tooling.md)                                                                                        | Accepted |
| 0008 | [Build against latest-LTS Node](0008-build-against-latest-lts-node.md)                                                                                                           | Accepted |
| 0009 | [Tailwind v4 border/ring/divide regression guard](0009-tailwind-v4-border-ring-divide-guard.md)                                                                                  | Accepted |
| 0010 | [Global CSS-variable theming token system](0010-css-variable-theming-token-system.md)                                                                                            | Accepted |
| 0011 | [Theme persistence via `next-themes`](0011-theme-persistence-next-themes.md)                                                                                                     | Accepted |
| 0012 | [FontAwesome introduction](0012-fontawesome-introduction.md)                                                                                                                     | Accepted |
| 0013 | [Root-layout fonts, metadata defaults & analytics](0013-root-layout-fonts-metadata-analytics.md)                                                                                 | Accepted |
| 0014 | [Netlify deploy config & custom image loader](0014-netlify-deploy-config-and-image-loader.md)                                                                                    | Accepted |
| 0015 | [Layout shell animations: server-CSS entrance + client route-transition](0015-layout-shell-animations-server-css-and-route-transition.md)                                        | Accepted |
| 0016 | [Shared nav: `usePathname` active-link port, sidebar mount & CV-PDF relocation](0016-shared-nav-active-link-port-and-sidebar-mount.md)                                           | Accepted |
| 0017 | [Desktop sidebar identity: portrait, socials, job-title config](0017-desktop-sidebar-identity-portrait-socials-config.md)                                                        | Accepted |
| 0018 | [Mobile burger drawer on `vaul`, `MenuOpenContext` provider & the modal-semantics parity delta](0018-mobile-drawer-vaul-menu-context.md)                                         | Accepted |
| 0019 | [Custom scrollbar on `react-custom-scroll@7` + lint-driven scroll-reset reimplementation](0019-custom-scrollbar-react-custom-scroll-v7.md)                                       | Accepted |
| 0020 | [Loading spinner on `react-spinners@0.17.0` / `PacmanLoader`, theme-reactive splash & `useSyncExternalStore` ready-state](0020-loading-spinner-react-spinners-theme-reactive.md) | Accepted |
| 0021 | [Epic 3 per-page metadata convention (single-suffix title)](0021-epic-3-page-metadata-single-suffix-title-convention.md)                                                         | Accepted |
| 0022 | [Testimonials carousel: `embla-carousel-react` replaces `@egjs/react-flicking`](0022-testimonials-carousel-embla-over-flicking.md)                                               | Accepted |
| 0023 | [Tailwind-v4 custom-spacing parity (re-declare divergent tokens per page)](0023-tailwind-v4-custom-spacing-parity.md)                                                            | Accepted |
| 0024 | [Content thumbnail: GatsbyImage `CONSTRAINED` → `next/image` reconciliation](0024-content-thumbnail-gatsbyimage-to-next-image.md)                                                | Accepted |
| 0025 | [Route-transition parity: FrozenRouter + pathname-keyed trigger](0025-route-transition-frozen-router-and-pathname-trigger.md)                                                    | Accepted |
| 0026 | [Production cutover to Next.js and Gatsby retirement](0026-production-cutover-and-gatsby-retirement.md)                                                                          | Accepted |
| 0027 | [Backroom markdown/content pipeline: Velite + Shiki](0027-markdown-pipeline-velite-shiki.md)                                                                                     | Accepted |
| 0028 | [Section-scoped `not-found` boundaries as forward-looking failure guardrails](0028-section-scoped-not-found-boundaries-as-guardrails.md)                                         | Accepted |

## Inherited closed decisions

A few calls were settled upstream in planning/research and were never given their own ADR.
They are recorded here by pointer, as historical context, so the decision set reads complete:

- **SSG, fully static** (`output: 'export'`) — no SSR/ISR. (Closely related to ADR
  [0003](0003-netlify-deploy-path-a-static-export.md).)
- **Theme persistence ON (FR10)** — the one accepted _functional_ change versus the old Gatsby
  site, where the theme toggle was component-local and did not persist. Implemented via
  `next-themes` (ADR [0011](0011-theme-persistence-next-themes.md)).
- **Clean parallel rebuild, ported tier-by-tier** — the migration was done as a fresh
  idiomatic-Next build verified against the old site one atomic-design tier at a time, rather
  than an in-place transform. (Historical: this was the _migration_ approach, now complete.)
- **Backroom markdown pipeline left open (AR20)** — the choice of MDX / `next-mdx-remote` /
  `react-markdown` for rendering curated content was deliberately **not** made during the
  migration; the plain-markdown ADRs foreclose none of those options. **Now resolved** in Project
  Ariadne by ADR [0027](0027-markdown-pipeline-velite-shiki.md) (Velite + Shiki).

## History

These records originated during **Project Theseus**, the Gatsby → Next.js rebuild of the site,
completed **2026-06-23** (production cutover, ADR
[0026](0026-production-cutover-and-gatsby-retirement.md), PR #12). The ADRs above remain the
live decision index for the site; some carry migration-era framing in their bodies (e.g.
"flagged for the Story 4.1 gate") — read those as historical, since that gate ran and signed
off green.

The raw as-you-go material that accompanied the migration — the per-story implementation
records, the `deferred-work.md` pragmatism/deferral log, the technical research, and the epics
— is archived at
[`_bmad-output/archive/project-theseus/`](../../_bmad-output/archive/project-theseus/). The
planning brief and PRD (with their decision logs) remain under
[`_bmad-output/planning-artifacts/`](../../_bmad-output/planning-artifacts/). Together these are
the base-usable source a future curated write-up would draw on; they are kept raw, not polished
here.

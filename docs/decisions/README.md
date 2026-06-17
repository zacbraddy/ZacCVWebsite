# Decision records

This directory is the project's lightweight decision trail — a set of Architecture Decision
Records (ADRs) capturing the non-obvious calls made while rebuilding this site (Project
Theseus, the Gatsby → Next.js migration).

It is deliberately **base-usable, not polished**. Turning this raw trail into a public-facing
narrative is **Ariadne's** job (the curated docs/backroom project) and is explicitly out of
scope here. Do not gold-plate it.

## Where ADRs live and how they're named

- One markdown file per material decision, in this directory.
- Numbered sequentially with a kebab-case title: **`NNNN-kebab-title.md`**
  (e.g. `0001-nextjs-16-react-19-typescript-strict-stack.md`).
- New decisions take the next free number.
- The format is defined by [`_template.md`](_template.md) — a MADR-lite shape:
  Status, Date, Decider, Tags, Context, Decision, Consequences, optional Alternatives.

## Status vocabulary

- **Proposed** — under consideration, not yet committed.
- **Accepted** — the decision is in force.
- **Superseded** — replaced by a later ADR (link to it).

## Capture convention (as-you-go)

Subsequent non-obvious decisions and pragmatism calls are recorded **as they are made**, at
the moment they are made — not reconstructed afterwards. This is a **cross-cutting
Definition-of-Done item across every epic and story**: if a story makes a material or
non-obvious call, that call gets an ADR (to the same base-usable standard) before the story
is considered done.

**Epic 4 / Story 4.3 collates** this existing trail and signs it off — it does **not**
reconstruct one. The whole point of capturing as-you-go is that the collation step finds a
complete record rather than archaeology.

## Seeded ADRs

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

## Inherited closed decisions

The following calls were already closed during planning and research. They are **not**
re-argued here and are intentionally **not** given their own ADR — they are recorded by
pointer so Epic 4's completeness sweep finds no gap. This mirrors how the PRD's own
`.decision-log.md` handled inherited decisions.

- **SSG, fully static** (`output: 'export'`) — no SSR/ISR. See the technical research
  decision table and PRD addendum. (Closely related to ADR
  [0003](0003-netlify-deploy-path-a-static-export.md).)
- **Theme persistence ON (FR10)** — the single accepted _functional_ change versus the
  Gatsby site, where the theme toggle was component-local and did not persist. Implemented
  via `next-themes` (Story 1.5). See PRD FR10.
- **Clean parallel rebuild, ported tier-by-tier with per-tier visual diffing** — the
  migration approach is a fresh idiomatic-Next build verified against the live site one
  atomic-design tier at a time, not an in-place transform. See the technical research
  decision table.
- **Backroom markdown pipeline deferred to Ariadne (AR20)** — the choice of MDX /
  `next-mdx-remote` / `react-markdown` for rendering curated content is deliberately **not**
  made now; plain-markdown ADRs foreclose none of those options. See AR20 and the research
  #Project-Codenames section.

_Sources: technical research decision table; PRD addendum; epics.md (FR10, AR20)._

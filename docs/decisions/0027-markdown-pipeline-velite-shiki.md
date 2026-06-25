# 0027 — Backroom markdown/content pipeline: Velite + Shiki

- **Status:** Accepted
- **Date:** 2026-06-25
- **Decider:** Zac (We Right Code)
- **Tags:** ariadne, backroom, pipeline, markdown

## Context

Project Ariadne adds the **Backroom** — an opt-in section that renders curated Public docs
(`docs/public/*.md`) to themed, statically-exported HTML for a technical evaluator to read. This
forces the one genuinely-open technical decision of the project, deliberately left open through
Theseus (README "Inherited closed decisions" → _Backroom markdown pipeline left open (AR20)_; PRD
Open Question #1): **which markdown pipeline renders the docs, and how code blocks get
syntax-highlighted.**

The constraints are hard and specific:

- **Static export only** (`output: 'export'`, ADR 0003) — markdown → HTML must happen **at build
  time**. No server runtime, no API routes, no runtime rendering.
- **Highlighting in the prerendered HTML** — code colour must be baked into the static output, not
  applied by a client-side highlighter at runtime (performance / modest client-JS budget, NFR-4).
- **Theme-token discipline** (ADR 0010) — rendered output and code highlighting must use the site's
  CSS-variable tokens and flip with the `.light` class, not hardcoded colours.
- **Dependency restraint** — this is a deliberately small static site; the pipeline is the one
  expected new dependency and must justify itself, not drag in a stack.
- **No JSX-in-markdown** — an explicit v1 NON-GOAL; docs are plain markdown, authored by a single
  maintainer.

## Decision

**Use [Velite](https://velite.js.org) as the build-time content pipeline, with
[Shiki](https://shiki.style) for syntax highlighting**, wired into `next.config.ts`.

- **Velite** owns the whole content boundary: it reads `docs/public/*.md`, validates frontmatter
  against a **Zod schema**, renders the markdown body to an HTML string via its bundled
  `unified`/remark/rehype engine, and emits a **typed data layer** to `.velite/` (gitignored, with a
  generated `.d.ts`) that Server Components import at build time. Velite _is_ the turnkey wrapper
  around the same `unified` ecosystem we would otherwise hand-assemble.
- **Frontmatter contract is the Zod schema** — `title`, `section`
  (`Overview | Decisions | Pragmatism & process`), `order`, `teaser`, optional `adr`. Invalid or
  missing frontmatter **fails the build with a clear error**, so the pipeline validates itself. Slug
  is the kebab-case filename; nav tiles are _derived_ (Overview → ★, Pragmatism & process → ◆,
  Decisions → the `adr` number), not a frontmatter field.
- **Shiki via `@shikijs/rehype` + `createCssVariablesTheme()`** — highlighting runs in Velite's
  rehype pass at build time and is **baked into the emitted HTML (zero client JS)**. The theme emits
  `--shiki-*` CSS variables, defined in `globals.css` (`@layer base`) mapped to the site's theme
  tokens (plus the new `code-surface`), with a `.light` override so code colour flips with the site
  theme.
- **Build integration is the `next.config.ts` hook**, not the legacy Velite webpack plugin:
  `next.config.ts` `await`s Velite's `build()` before Next compiles. This is the
  **Turbopack-safe** path (the webpack plugin is the part that breaks under Turbopack). Netlify's
  existing `next build` triggers it; **no `netlify.toml` change**. In dev, Velite runs in watch mode
  and rebuilds `.velite/` on `docs/public/` changes.
- **Rendering** — the doc body is one schema field (`s.markdown()`) producing an HTML string,
  injected via `dangerouslySetInnerHTML` in the `doc-content` organism (acceptable: first-party
  trusted content, the author's own docs). Because the body is injected HTML, Tailwind utilities
  cannot hang on its elements; it is styled by a single scoped prose block
  (`doc-content.module.css`) using theme tokens only, capped to the reading measure.

Pinned: `velite@0.4.0` (devDependency), `@shikijs/rehype@4.3.0` (+ `shiki`), against
Next `16.2.9` / React `19.2.7`.

## Consequences

- The entire content path is **build-time**: Velite reads + validates + renders → `.velite/` typed
  data → Next prerenders every Backroom route to `out/` (`generateStaticParams` +
  `dynamicParams = false`, every route `○ (Static)`). Fully inside `output: 'export'`; no runtime
  boundary is introduced.
- **Zero client JS for docs** — highlighting and rendering are static; nothing ships to the client
  for the reading experience.
- **The pipeline self-validates** — a malformed doc fails the build rather than shipping broken, a
  real win over a hand-rolled parse.
- **Adding a doc is plumbing-free** (UJ-3): drop a valid `docs/public/*.md` → new typed entry → new
  nav row + static route on the next build.
- **Two new build-time dependencies** (`velite`; `@shikijs/rehype`/`shiki`). Net line-item count is
  _lower_ than hand-assembly (one configured tool vs. a string of plugins), and nothing reaches the
  client. `.gitignore` gains `.velite/`.
- Resolves the long-open "Backroom markdown pipeline" item (AR20 / PRD Open Question #1); the
  README "Inherited closed decisions" pointer is updated to point here.
- This ADR is itself **Backroom content** — a real decision-trail/pragmatism artefact, fitting since
  the Backroom showcases exactly these calls. The curated `docs/public/` write-up is a one-way
  _derivation_ of this record, free to deviate in depth.

## Alternatives considered

- **`react-markdown`** — rejected: its unified pipeline runs **synchronously**, but Shiki is
  **async by design** (WASM, lazy grammar/theme load). It cannot host async Shiki at build time
  without pushing highlighting to the client at runtime — which defeats the build-time / zero-JS
  constraint.
- **`next-mdx-remote` / MDX** — rejected: adds JSX-in-markdown (an explicit v1 NON-GOAL) plus a
  client-side MDX runtime and the same async-Shiki friction, for no benefit on plain authored docs.
- **Hand-assembling `unified` + `remark-gfm` + `remark-rehype` + `@shikijs/rehype` +
  `rehype-stringify` + `gray-matter` + a custom fs loader** — rejected: that is building a worse
  Velite from Velite's own parts (Velite already owns parse, Zod frontmatter validation, rendering,
  Shiki, and typed output in one configured tool). More moving parts, no self-validation, more to
  maintain.
- **The legacy Velite webpack plugin** — rejected: it is the integration path that breaks under
  Turbopack. The `next.config.ts` `await build()` hook is the supported, Turbopack-safe approach.

### Decision trail

The pipeline choice was corrected mid-architecture: an initial lean toward **react-markdown** was
abandoned once the sync-vs-async-Shiki conflict surfaced; a **hand-assembled unified pipeline** was
then drafted and rejected as "a worse Velite"; the corrected, source-checked decision is
**Velite + Shiki** as recorded above. Captured here because the honest trail — including the
correction — is exactly the kind of judgement the Backroom exists to show.

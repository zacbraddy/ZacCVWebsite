# 0026 — Production cutover to Next.js and Gatsby retirement

- **Status:** Accepted
- **Date:** 2026-06-23
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, deploy, cutover

## Context

Epics 1–3 rebuilt the site as a parallel Next.js 16 app that never touched production; Story 4.1 was
the hard parity gate, signed off GREEN by Zac on 2026-06-23 (full per-tier visual + behavioural pass
vs the live Gatsby site). This ADR records the **execution and outcome** of the cutover itself — the
single irreversible act that switches `zackerthehacker.com` from Gatsby to Next.js. The underlying
_decisions_ were already made: Path A static export (ADR 0003), the `archive/`-at-root coexistence
model with deletion at cutover (ADR 0006), and the Netlify deploy config + image loader (ADR 0014).
What remained was to perform the switch, verify production, retire Gatsby, and capture it here.

## Decision

**The cutover is the fast-forward merge of `project-theseus` → `main`.** Production builds from `main`
via Netlify deploy-on-commit (ADR 0003). Pre-cutover, `main` held the Gatsby app with **no
`netlify.toml`**, so Netlify built Gatsby from its UI build settings (`gatsby build` → `public/`).
`project-theseus` is a clean fast-forward over `main` and carries `netlify.toml`
(`command = "next build"`, `publish = "out"`). Because `netlify.toml [build]` **overrides** the
Netlify UI build settings, the moment that file lands on `main` the next production build runs
`next build` and publishes the static `out/` export (`output: 'export'`, zero functions — ADR 0014).
So **merge + push to `main` _is_ the cutover** — no Netlify dashboard reconfiguration is required.

**Sequencing (Zac's call, 2026-06-23):** all repo cleanup and decision capture is committed on
`project-theseus` **before** the merge, so the retired Gatsby tree never lands as a live file on
`main`:

- **Gatsby retired:** `git rm -r archive/` plus a full `rm -rf archive/` of the directory (the
  tracked 71-file tree plus the gitignored `archive/.cache` / `archive/public` / `archive/node_modules`
  build artifacts), completing ADR 0006's "clean `rm -rf archive/` plus git removal". The dead
  `archive/**` carve-outs in `.gitignore`, `.prettierignore`, and `eslint.config.mjs` were dropped.
- **FR23 verified:** the deployed source (`package.json` dependencies + `src/`) contains no `gatsby`,
  `@reach/router`, `useStaticQuery`, or `graphql`. Gatsby still appears as _history_ in
  `docs/decisions/**` and `_bmad-output/**` (expected — the migration record) and as a stale copyright
  line in `LICENSE` (noted, out of cutover scope).
- **Docs corrected:** `README.md` and `_bmad-output/project-context.md` (the AI source-of-truth
  `CLAUDE.md` points at) rewritten from the Gatsby stack to the Next.js reality.

**Rollback path (known before the switch):** the live Gatsby production deploy keeps serving until a
new Next build goes green, so recovery needs nothing in the working tree — Netlify "Publish deploy" on
the previous Gatsby deploy, or `git revert` the merge and push. The Gatsby source remains recoverable
indefinitely from git history (`git revert` the merge, or `git checkout <pre-removal-sha> -- archive/`).

## Consequences

- Production `zackerthehacker.com` is served by the Next.js 16 + TypeScript static export from `main`;
  Gatsby is retired and no longer maintained.
- Deploy-on-commit (NFR4) and Google Analytics `G-F98QXJC4S0` (FR19) are preserved end-to-end.
- **Carried-forward residual risk:** the FrozenRouter route-transition fix (ADR 0025) imports a Next
  **internal** API (`next/dist/shared/lib/app-router-context.shared-runtime`). It is an accepted
  upgrade-checklist item, not a cutover blocker — re-verify it on any Next major upgrade.
- The Netlify-Image-CDN rendering of `next/image` (`/.netlify/images?...`), explicitly deferred from
  the 4.1 local-only gate, is verified for the first time in production as part of this cutover.
- Story 4.3 collates and signs off the full decision trail; this ADR is base-usable only and is not
  the completeness sweep.

### Verification outcome

> **PENDING Zac (Story 4.2 Tasks 6–7, human-in-the-loop).** To be completed after the live production
> verification — record date of cutover, that Next is serving (`/_next/` + `/.netlify/images` in
> view-source), all routes + custom 404 + CV PDF resolve, images render via the Netlify Image CDN, GA
> fires, and deploy-on-commit produced a green production deploy. The dev agent could not and did not
> verify production; only Zac's confirmation closes this.

## Alternatives considered

- **Reconfigure the Netlify UI build settings instead of relying on `netlify.toml`** — unnecessary;
  `netlify.toml [build]` already overrides the UI, so the merge alone flips the build with no dashboard
  step and keeps the deploy config in version control.
- **Merge first, then delete `archive/` on `main`** — rejected: lands the retired Gatsby tree as a live
  file on `main`, if only briefly. Removing it on `project-theseus` pre-merge keeps `main` clean from
  the first cutover commit; git history is the rollback.

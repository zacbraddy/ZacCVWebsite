---
title: "Product Brief: Zac's CV Website"
status: final
created: 2026-06-10
updated: 2026-06-10
---

# Product Brief: Zac's CV Website

## Executive Summary

Zac's CV Website is his long-running, hand-built personal portfolio and CV site — the
credibility gate that helps win traditional contracts (and, historically, permanent
roles). It already does its core job well: a slick front-of-house that makes a recruiter
say "this person's the real deal," plus a downloadable CV. But the foundation beneath
that polish has aged. It runs on Gatsby — a framework in maintenance limbo since
Netlify's 2023 acquisition — on years-stale dependencies, and its on-site content has
drifted behind Zac's actual CV.

This brief covers modernising the site as **two focused, sequential projects**:
(1) migrate Gatsby → **Next.js + TypeScript**, refreshing the whole stack and capturing
the migration as documented proof of Zac's **System Modernisation** service line; then
(2) refresh content to true parity and add a **"backroom"** that surfaces the
modernisation story to technical visitors. The work doubles as a live demonstration of
Zac's AI-augmented (BMAD) delivery workflow — **the artefact and the sales demo are the
same object.**

Critically, this is **time-boxed supporting infrastructure, not the product.** Success
is delivering both projects to a high standard, efficiently, and then getting back to
the work that actually makes money: hunting contracts.

## The Problem

The site still impresses on the surface, but three things have drifted — and honesty
about their relative weight matters:

- **The foundation has aged into a quiet credibility liability.** Hand-rolled on Gatsby
  (now effectively abandoned upstream) with badly out-of-date dependencies. A recruiter
  can't see this — but a *technical* evaluator, and increasingly automated tooling, can,
  and "real-deal engineer running their own site on a dead framework" is a contradiction.
  It also blocks clean future work.
- **The skills on display lag Zac's actual toolkit.** The site showcases neither
  TypeScript nor a current, in-demand framework — both real skills he now has and both
  keywords that get a CV shortlisted.
- **The content has drifted, and the site has quietly stopped being its own CV home.**
  Missing recent roles, an old photo, a not-fully-current CV — and Zac has been routing
  around the site via LinkedIn and direct sends. One of its three original jobs
  ("always-current CV delivery") has degraded to a fallback. The AI-era workflow he now
  sells isn't represented at all.

_None of this is a live revenue emergency — the CV gap is covered by other channels — so
the work proceeds from a position of safety, not crisis._

## The Solution

Two sequential, single-focus projects, with the front-of-house flash preserved
throughout (it stays the star).

**Project 1 — Modernisation.** Migrate the site to **Next.js + TypeScript** on current
dependencies, with **zero visual or functional regression** (still flashy, still flawless
on mobile). Capture the raw decision and process data — ADRs, research, reasoning,
pragmatism calls — *as a byproduct of doing the work properly*, to a standard that is
useful for the active build and forms a solid base. No public-facing doc polishing here
(deferred by design — see Scope).

**Project 2 — Content & showcase.** Refresh content to true CV parity and **restore the
site as the canonical, current CV home.** Translate Project 1's raw decision data into
**curated, public-facing documentation** (polished, free to deviate in depth to put
Zac's best foot forward). Build the **backroom**: an opt-in section that renders those
docs to HTML (via a Next markdown package), reached through an unshowy *"More interested
in how this site is built?"* link and a **console ASCII-art easter egg** that hands
technical visitors clickable links to the backroom and the GitHub repo.

## What Makes This Different

Honest differentiators — not a moat, but few competitors bother:

- **The site documents its own modernisation, built with the very AI/BMAD workflow Zac
  sells.** The proof and the product are one artefact.
- **It shows process and judgement, not just output.** Most developer portfolios show
  *what* was built; this shows *how the decisions were made* — the trade-offs, where
  pragmatism won and why, and how delivery was kept primary throughout. That is precisely the
  question a client buying System Modernisation is trying to answer before they hire.
- **Hand-built end-to-end by Zac** — tech, hosting, and design from scratch — now
  extended into a documented modernisation of that same hand-built thing.

## Who This Serves

- **Primary — agency recruiters.** Fast, often non-technical. The site is a ~2-second
  credibility gate plus a CV grab; they're won by **visual flash**. (They largely cannot
  perceive the tech modernisation — which is why Project 1's payoff lies elsewhere.)
- **Secondary — technical evaluators / hiring managers / leads.** Linger longer; also
  won mainly by the wow factor, but the **backroom** deepens their confidence and speaks
  to "how does this person actually think?"
- **Forward-looking — future contract clients** weighing Zac's modernisation
  credibility, for whom the documented case study is the asset.

_Out of frame: We Right Code B2B buyers — served by a separate, future site._

## Success Criteria

Deliberately light. This is infrastructure, not a growth product; there is no marketing
push to make hard metrics meaningful.

- **Headline metric: both projects delivered to a high standard in a reasonable time** —
  efficiently, without becoming a distraction from contract-hunting. Over-investment /
  gold-plating (including the backroom and easter-egg rabbit holes) is itself a failure.
- **Quality bar:** modern stack live (Next.js + TS, current deps); **zero visual or
  functional regression**; flash preserved; content at true CV parity and canonical
  again; backroom live with the easter egg; decision data captured well enough that
  Project 2 builds the public docs without archaeology.
- **Analytics:** keep the existing `gtag` working (low effort); occasional glance out of
  interest only — **explicitly not a KPI.**
- **Explicitly not tracked:** traffic, engagement, or conversion metrics — signals too
  weak to be worth the effort.

## Scope

**In scope**

- _Project 1:_ Gatsby → Next.js + TypeScript migration; full dependency modernisation;
  raw decision/process documentation captured during the work.
- _Project 2:_ content refresh to CV parity and restoration as canonical CV home;
  curated public-facing docs derived from Project 1's raw data; the backroom feature;
  the "how this is built" link; the console easter egg.

**Out of scope**

- A separate We Right Code B2B / product-marketing site (future, separate build).
- Public-facing documentation polishing *during* Project 1 (deferred to Project 2 by
  design, to protect Project 1's delivery velocity).
- Hard success/analytics instrumentation beyond keeping the existing `gtag` alive.
- Speculative far-future enhancements (the site is ongoing WIP — see Vision — not
  planned in detail here).

## Vision

The site is **permanent work-in-progress by design** — always a short hop behind the
latest tech and Zac's latest thinking, updated as contracts are won and as the industry
shifts (AI especially). Beyond this modernisation it accumulates further demonstrations
of his skills and an ever-richer backroom, remaining the hand-built, end-to-end proof
that Zac builds — and modernises — real things with delivery kept firmly first. Not a
destination: a living shop-window that earns its keep as one reliable stop on the way to
the next contract.

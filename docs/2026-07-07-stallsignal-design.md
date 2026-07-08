# StallSignal — Design

**Date:** 2026-07-07
**Author:** Claude (autonomous build, commissioned by Cale)
**Status:** Approved by delegation — Cale asked Claude to design and build its own product derived from controlaltrecover.com.

## What it is

StallSignal is a free, client-side diagnostic web app: answer 12 questions about a stalled or wobbling initiative and get an instant classification of *where* the break is — **Mechanical** (the work itself: definition, resourcing) or **Environmental** (the system around the work: decision rights, alignment) — plus the top warning signals detected and a recommended next step.

It is the interactive top-of-funnel the Control Alt Recover (CAR) offer ladder doesn't have. CAR's ladder starts at a downloadable Field Guide and ends at enterprise Program Recovery; StallSignal sits *before* the Field Guide: zero-commitment, 5 minutes, shareable result.

## Why this concept (alternatives considered)

1. **Content/brand site** — rejected: competes with CAR's own Field Guide and newsletter, adds no functionality.
2. **Interactive diagnostic (chosen)** — real functionality, complements the ladder, buildable and verifiable end-to-end with no backend.
3. **Initiative health tracker SaaS** — rejected for v1: needs accounts, storage, and ongoing users. A plausible v2 if StallSignal gets traction.

**Cannibalization guard:** StallSignal classifies patterns; it does not replace a facilitated read. Results explicitly route deeper cases to CAR's human diagnostics.

## Model

- 12 questions, 4 dimensions × 3 questions:
  - **Work Definition** (mechanical)
  - **Resourcing** (mechanical)
  - **Decision Rights** (environmental)
  - **Alignment & Incentives** (environmental)
- Each question has 4 options scored 0 (healthy) → 3 (broken).
- Dimension score: 0–9. Mechanical = WD + R (0–18). Environmental = DR + AI (0–18).
- Verdicts:
  - **Compound Stall** — mechanical ≥ 8 AND environmental ≥ 8
  - **Mechanical Break** — mechanical ≥ 8
  - **Environmental Block** — environmental ≥ 8
  - **Early Drift** — any dimension ≥ 4
  - **Healthy Signal** — everything else
- Top signals: the highest-scoring answers (score ≥ 2), rendered as concrete warning statements.
- Next steps per verdict; deeper verdicts route to controlaltrecover.com (Field Guide → Playbook → Executive Diagnostic).

## Architecture

- React + TypeScript + Vite single-page app. No backend, no analytics, no data leaves the browser.
- `src/questions.ts` — question/option/signal data (single source of truth for copy).
- `src/scoring.ts` — pure scoring engine (unit-tested with Vitest).
- `src/App.tsx` — three-state machine: intro → quiz (one question at a time) → results.
- Results encoded in the URL hash (`#r=<12 digits>`) so a result is shareable/bookmarkable with no storage.
- Deploy: GitHub Pages via Actions workflow; `base: './'` so the build is host-agnostic.

## Identity

Own brand, distinct from CAR's field-guide aesthetic: dark instrument-panel look, monospace accents, signal/telemetry metaphor. Footer attributes the methodology inspiration to Control Alt Recover and states the tool is an independent companion built by Claude.

## Testing

- Vitest unit tests on the scoring engine (verdict thresholds, boundary cases, hash encode/decode round-trip).
- Manual verification of the full quiz flow in the browser preview before shipping.

## Non-goals (v1)

Accounts, persistence, email capture, PDF export, backend of any kind.

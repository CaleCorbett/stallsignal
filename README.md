# StallSignal

**Locate the break in 5 minutes.** A free diagnostic for stalled initiatives: answer 12 questions and find out whether the break is **mechanical** (the work itself — definition, resourcing) or **environmental** (the system around the work — decision rights, alignment) — because the fixes are completely different.

Built and maintained by Claude. The core insight -- that stalled work and broken decision systems are different failures needing different fixes -- comes from the initiative-recovery discipline; StallSignal turns it into a self-serve instrument.

## How it works

- 12 questions across 4 dimensions: Work Definition, Resourcing, Decision Rights, Alignment & Incentives
- Instant classification: Healthy Signal → Early Drift → Mechanical Break / Environmental Block → Compound Stall
- Top warning signals detected, plus next steps matched to the failure mode
- Copy a plain-text team brief to paste into Slack or an email to your sponsor
- Results are encoded in the URL — shareable, nothing stored, nothing leaves the browser

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # scoring engine unit tests
npm run build    # production build to dist/
```

Stack: React + TypeScript + Vite. No backend, no analytics, no dependencies beyond React.

Deploys to GitHub Pages automatically on push to `main`.

## Design

See [docs/2026-07-07-stallsignal-design.md](docs/2026-07-07-stallsignal-design.md) for the concept, alternatives considered, and scoring model.

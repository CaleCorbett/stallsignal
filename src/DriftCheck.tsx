import { useState } from 'react'
import {
  DRIFT_INDICATORS,
  DRIFT_VERDICTS,
  encodeDrift,
  scoreDrift,
} from './drift'

export function DriftQuiz({
  index,
  onPick,
  onBack,
}: {
  index: number
  onPick: (pick: number) => void
  onBack: () => void
}) {
  const ind = DRIFT_INDICATORS[index]
  return (
    <main className="quiz">
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={DRIFT_INDICATORS.length}
        aria-valuenow={index}
      >
        <div
          className="progress-fill"
          style={{ width: `${(index / DRIFT_INDICATORS.length) * 100}%` }}
        />
      </div>
      <p className="eyebrow">
        Drift check · {String(index + 1).padStart(2, '0')} / {DRIFT_INDICATORS.length}
      </p>
      <h1 className="quiz-prompt">{ind.label}</h1>
      <p className="quiz-hint">Which statement is closer to true right now?</p>
      <div className="options">
        <button className="option option-healthy" onClick={() => onPick(0)}>
          {ind.healthy}
        </button>
        <button className="option option-drift" onClick={() => onPick(1)}>
          {ind.drift}
        </button>
      </div>
      {index > 0 && (
        <button className="btn-ghost" onClick={onBack}>
          ← Previous indicator
        </button>
      )}
    </main>
  )
}

export function DriftResults({
  picks,
  onRestart,
  onFullDiagnostic,
}: {
  picks: number[]
  onRestart: () => void
  onFullDiagnostic: () => void
}) {
  const result = scoreDrift(picks)
  const v = DRIFT_VERDICTS[result.verdict]
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}#d=${encodeDrift(picks)}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable; the URL bar still has the link
    }
  }

  return (
    <main className="results">
      <p className="eyebrow">Drift check result</p>
      <div className={`verdict verdict-${v.tone}`}>
        <h1>
          {v.title}
          <span className="verdict-count"> · {result.total}/10 flagged</span>
        </h1>
        <p>{v.meaning}</p>
      </div>

      <section className="panel">
        <h2>Where the drift is</h2>
        <div className="gauges">
          <div className="gauge">
            <div className="gauge-head">
              <span className="gauge-label">Mechanical indicators</span>
              <span className="gauge-score">{result.mechanical}/5</span>
            </div>
            <div className="gauge-track">
              <div
                className={`gauge-fill fill-${result.mechanical >= 3 ? 'bad' : result.mechanical >= 2 ? 'warn' : 'ok'}`}
                style={{ width: `${(result.mechanical / 5) * 100}%` }}
              />
            </div>
          </div>
          <div className="gauge">
            <div className="gauge-head">
              <span className="gauge-label">Environmental indicators</span>
              <span className="gauge-score">{result.environmental}/5</span>
            </div>
            <div className="gauge-track">
              <div
                className={`gauge-fill fill-${result.environmental >= 3 ? 'bad' : result.environmental >= 2 ? 'warn' : 'ok'}`}
                style={{ width: `${(result.environmental / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <p className="gauge-summary">
          Cadence: re-run weekly while recovering, bi-weekly when steady. The trend line matters
          more than any single reading.
        </p>
      </section>

      {result.signals.length > 0 && (
        <section className="panel">
          <h2>Flags raised ({result.signals.length})</h2>
          <ul className="signals">
            {result.signals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel">
        <h2>What to do next</h2>
        <ol className="next-steps">
          {v.nextSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {result.verdict !== 'steady' && (
          <button className="route" onClick={onFullDiagnostic}>
            <span className="route-label">Run the full diagnostic →</span>
            <span className="route-note">
              12 questions to locate exactly where the break is forming -- the work itself, or the
              system around it.
            </span>
          </button>
        )}
      </section>

      <div className="result-actions">
        <button className="btn-primary" onClick={copyLink}>
          {copied ? 'Link copied ✓' : 'Copy shareable link'}
        </button>
        <button className="btn-ghost" onClick={onRestart}>
          Run it again
        </button>
      </div>
    </main>
  )
}

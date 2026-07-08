import { useState } from 'react'
import { DIMENSIONS, DIMENSION_ORDER, score } from './scoring'
import { VERDICTS } from './verdicts'

export default function Results({
  answers,
  onRestart,
}: {
  answers: number[]
  onRestart: () => void
}) {
  const result = score(answers)
  const v = VERDICTS[result.verdict]
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable; the URL bar still has the link
    }
  }

  return (
    <main className="results">
      <p className="eyebrow">Diagnostic result</p>
      <div className={`verdict verdict-${v.tone}`}>
        <h1>{v.title}</h1>
        <p>{v.meaning}</p>
      </div>

      <section className="panel">
        <h2>Where the break is</h2>
        <div className="gauges">
          {DIMENSION_ORDER.map((key) => {
            const dim = DIMENSIONS[key]
            const s = result.dimensionScores[key]
            return (
              <div key={key} className="gauge">
                <div className="gauge-head">
                  <span className="gauge-label">{dim.label}</span>
                  <span className={`gauge-kind kind-${dim.kind}`}>{dim.kind}</span>
                  <span className="gauge-score">{s}/9</span>
                </div>
                <div className="gauge-track">
                  <div
                    className={`gauge-fill fill-${s >= 6 ? 'bad' : s >= 4 ? 'warn' : 'ok'}`}
                    style={{ width: `${(s / 9) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="gauge-summary">
          Mechanical {result.mechanical}/18 · Environmental {result.environmental}/18
        </p>
      </section>

      {result.signals.length > 0 && (
        <section className="panel">
          <h2>Signals detected ({result.signals.length})</h2>
          <ul className="signals">
            {result.signals.slice(0, 5).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          {result.signals.length > 5 && (
            <p className="signals-more">
              + {result.signals.length - 5} more signal{result.signals.length - 5 > 1 ? 's' : ''} at
              lower intensity.
            </p>
          )}
        </section>
      )}

      <section className="panel">
        <h2>What to do next</h2>
        <ol className="next-steps">
          {v.nextSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <a className="route" href={v.route.href} target="_blank" rel="noreferrer">
          <span className="route-label">{v.route.label} →</span>
          <span className="route-note">{v.route.note}</span>
        </a>
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

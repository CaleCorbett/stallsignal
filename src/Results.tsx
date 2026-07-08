import { useState } from 'react'
import { DIMENSIONS, DIMENSION_ORDER, score, type Result } from './scoring'
import { VERDICTS, type VerdictCopy } from './verdicts'

function buildBrief(result: Result, v: VerdictCopy): string {
  const dims = DIMENSION_ORDER.map(
    (key) => `${DIMENSIONS[key].label}: ${result.dimensionScores[key]}/9`,
  ).join(' | ')
  const lines = [
    `STALLSIGNAL DIAGNOSTIC -- ${v.title}`,
    `Mechanical ${result.mechanical}/18 · Environmental ${result.environmental}/18`,
    dims,
    '',
    `What this means: ${v.meaning}`,
  ]
  if (result.signals.length > 0) {
    lines.push('', 'Signals detected:')
    result.signals.forEach((s) => lines.push(`- ${s}`))
  }
  lines.push('', 'Recommended next steps:')
  v.nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`))
  lines.push('', `Full result: ${window.location.href}`)
  return lines.join('\n')
}

export default function Results({
  answers,
  onRestart,
}: {
  answers: number[]
  onRestart: () => void
}) {
  const result = score(answers)
  const v = VERDICTS[result.verdict]
  const [copied, setCopied] = useState<'link' | 'brief' | null>(null)

  const copy = async (kind: 'link' | 'brief', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
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
        <button
          className="route"
          onClick={() => copy('brief', buildBrief(result, v))}
        >
          <span className="route-label">
            {copied === 'brief' ? 'Brief copied ✓' : 'Copy team brief →'}
          </span>
          <span className="route-note">
            A plain-text summary of this result -- verdict, scores, signals, next steps -- ready to
            paste into Slack or an email to your sponsor.
          </span>
        </button>
      </section>

      <div className="result-actions">
        <button
          className="btn-primary"
          onClick={() => copy('link', window.location.href)}
        >
          {copied === 'link' ? 'Link copied ✓' : 'Copy shareable link'}
        </button>
        <button className="btn-ghost" onClick={onRestart}>
          Run it again
        </button>
      </div>
    </main>
  )
}

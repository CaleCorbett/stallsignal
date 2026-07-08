import { useEffect, useState } from 'react'
import { QUESTIONS, decodeAnswers, encodeAnswers } from './scoring'
import { DRIFT_INDICATORS, decodeDrift, encodeDrift } from './drift'
import Results from './Results'
import { DriftQuiz, DriftResults } from './DriftCheck'

type Screen =
  | { kind: 'intro' }
  | { kind: 'quiz'; index: number; answers: number[] }
  | { kind: 'results'; answers: number[] }
  | { kind: 'driftQuiz'; index: number; picks: number[] }
  | { kind: 'driftResults'; picks: number[] }

function screenFromHash(): Screen {
  const full = window.location.hash.match(/^#r=([0-3]+)$/)
  if (full) {
    const answers = decodeAnswers(full[1])
    if (answers) return { kind: 'results', answers }
  }
  const drift = window.location.hash.match(/^#d=([01]+)$/)
  if (drift) {
    const picks = decodeDrift(drift[1])
    if (picks) return { kind: 'driftResults', picks }
  }
  return { kind: 'intro' }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(screenFromHash)

  useEffect(() => {
    const onHash = () => setScreen(screenFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const startQuiz = () => setScreen({ kind: 'quiz', index: 0, answers: [] })
  const startDrift = () => setScreen({ kind: 'driftQuiz', index: 0, picks: [] })

  const answer = (choice: number) => {
    if (screen.kind !== 'quiz') return
    const answers = [...screen.answers, choice]
    if (answers.length === QUESTIONS.length) {
      window.location.hash = `r=${encodeAnswers(answers)}`
      setScreen({ kind: 'results', answers })
    } else {
      setScreen({ kind: 'quiz', index: screen.index + 1, answers })
    }
  }

  const pickDrift = (pick: number) => {
    if (screen.kind !== 'driftQuiz') return
    const picks = [...screen.picks, pick]
    if (picks.length === DRIFT_INDICATORS.length) {
      window.location.hash = `d=${encodeDrift(picks)}`
      setScreen({ kind: 'driftResults', picks })
    } else {
      setScreen({ kind: 'driftQuiz', index: screen.index + 1, picks })
    }
  }

  const back = () => {
    if (screen.kind === 'quiz' && screen.index > 0) {
      setScreen({ kind: 'quiz', index: screen.index - 1, answers: screen.answers.slice(0, -1) })
    } else if (screen.kind === 'driftQuiz' && screen.index > 0) {
      setScreen({ kind: 'driftQuiz', index: screen.index - 1, picks: screen.picks.slice(0, -1) })
    }
  }

  const restart = () => {
    history.replaceState(null, '', window.location.pathname)
    setScreen({ kind: 'intro' })
  }

  const fullDiagnosticFromDrift = () => {
    history.replaceState(null, '', window.location.pathname)
    startQuiz()
  }

  return (
    <div className="shell">
      <header className="masthead">
        <a href="#" onClick={(e) => { e.preventDefault(); restart() }} className="wordmark">
          <span className="wordmark-pulse" aria-hidden="true">▮▮▮</span> StallSignal
        </a>
        <span className="masthead-tag">initiative telemetry</span>
      </header>

      {screen.kind === 'intro' && <Intro onStartQuiz={startQuiz} onStartDrift={startDrift} />}
      {screen.kind === 'quiz' && (
        <Quiz index={screen.index} onAnswer={answer} onBack={back} />
      )}
      {screen.kind === 'results' && (
        <Results answers={screen.answers} onRestart={restart} />
      )}
      {screen.kind === 'driftQuiz' && (
        <DriftQuiz index={screen.index} onPick={pickDrift} onBack={back} />
      )}
      {screen.kind === 'driftResults' && (
        <DriftResults
          picks={screen.picks}
          onRestart={restart}
          onFullDiagnostic={fullDiagnosticFromDrift}
        />
      )}

      <footer className="footer">
        <p>
          StallSignal is built and maintained by Claude. It classifies patterns; it is not a
          substitute for talking to your team. Nothing you enter leaves your browser -- no
          accounts, no tracking, no storage.{' '}
          <a href="https://github.com/CaleCorbett/stallsignal" target="_blank" rel="noreferrer">
            Source on GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  )
}

function Intro({
  onStartQuiz,
  onStartDrift,
}: {
  onStartQuiz: () => void
  onStartDrift: () => void
}) {
  return (
    <main className="intro">
      <p className="eyebrow">Free · nothing stored · nothing leaves your browser</p>
      <h1>
        Your initiative isn't slow.
        <br />
        Something specific is broken.
      </h1>
      <p className="lede">
        Stalled initiatives fail in two distinct ways: the <strong>work itself</strong> breaks
        (undefined outcomes, phantom staffing) or the <strong>system around the work</strong>{' '}
        breaks (decision rights, incentives, sponsorship). The fixes are completely different --
        and most teams treat both with more project management.
      </p>
      <div className="modes">
        <button className="mode" onClick={onStartQuiz}>
          <span className="mode-eyebrow">Something is already stuck</span>
          <span className="mode-title">Full diagnostic</span>
          <span className="mode-desc">
            12 questions · 5 minutes. Locates the break: mechanical, environmental, or compound --
            with the signals you're emitting and next steps matched to the failure mode.
          </span>
        </button>
        <button className="mode" onClick={onStartDrift}>
          <span className="mode-eyebrow">Things look fine, so far</span>
          <span className="mode-title">Drift check</span>
          <span className="mode-desc">
            10 indicators · 2 minutes. A recurring pulse that catches drift while it still costs a
            conversation, not a recovery. Weekly while recovering, bi-weekly when steady.
          </span>
        </button>
      </div>
      <div className="dims">
        <div className="dim mech">
          <h2>Mechanical</h2>
          <p>Work Definition · Resourcing</p>
        </div>
        <div className="dim env">
          <h2>Environmental</h2>
          <p>Decision Rights · Alignment &amp; Incentives</p>
        </div>
      </div>
    </main>
  )
}

function Quiz({
  index,
  onAnswer,
  onBack,
}: {
  index: number
  onAnswer: (choice: number) => void
  onBack: () => void
}) {
  const q = QUESTIONS[index]
  return (
    <main className="quiz">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={index}>
        <div className="progress-fill" style={{ width: `${(index / QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="eyebrow">
        Full diagnostic · {String(index + 1).padStart(2, '0')} / {QUESTIONS.length}
      </p>
      <h1 className="quiz-prompt">{q.prompt}</h1>
      <div className="options">
        {q.options.map((opt, i) => (
          <button key={i} className="option" onClick={() => onAnswer(i)}>
            {opt}
          </button>
        ))}
      </div>
      {index > 0 && (
        <button className="btn-ghost" onClick={onBack}>
          ← Previous question
        </button>
      )}
    </main>
  )
}

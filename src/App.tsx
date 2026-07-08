import { useEffect, useState } from 'react'
import { QUESTIONS, decodeAnswers, encodeAnswers } from './scoring'
import Results from './Results'

type Screen =
  | { kind: 'intro' }
  | { kind: 'quiz'; index: number; answers: number[] }
  | { kind: 'results'; answers: number[] }

function screenFromHash(): Screen {
  const m = window.location.hash.match(/^#r=([0-3]+)$/)
  if (m) {
    const answers = decodeAnswers(m[1])
    if (answers) return { kind: 'results', answers }
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

  const start = () => setScreen({ kind: 'quiz', index: 0, answers: [] })

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

  const back = () => {
    if (screen.kind !== 'quiz' || screen.index === 0) return
    setScreen({
      kind: 'quiz',
      index: screen.index - 1,
      answers: screen.answers.slice(0, -1),
    })
  }

  const restart = () => {
    history.replaceState(null, '', window.location.pathname)
    setScreen({ kind: 'intro' })
  }

  return (
    <div className="shell">
      <header className="masthead">
        <a href="#" onClick={(e) => { e.preventDefault(); restart() }} className="wordmark">
          <span className="wordmark-pulse" aria-hidden="true">▮▮▮</span> StallSignal
        </a>
        <span className="masthead-tag">initiative telemetry</span>
      </header>

      {screen.kind === 'intro' && <Intro onStart={start} />}
      {screen.kind === 'quiz' && (
        <Quiz index={screen.index} onAnswer={answer} onBack={back} />
      )}
      {screen.kind === 'results' && (
        <Results answers={screen.answers} onRestart={restart} />
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

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="intro">
      <p className="eyebrow">Free · 12 questions · 5 minutes · nothing stored</p>
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
      <p className="lede">
        StallSignal locates the break. Answer 12 questions about one initiative and get a
        classification, the warning signals you're already emitting, and the next step that
        matches your actual failure mode.
      </p>
      <button className="btn-primary" onClick={onStart}>
        Run the diagnostic
      </button>
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
        {String(index + 1).padStart(2, '0')} / {QUESTIONS.length}
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

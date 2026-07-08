// StallSignal scoring engine -- pure functions, no DOM.

import { DIMENSIONS, QUESTIONS, type DimensionKey } from './questions'

export type Verdict =
  | 'healthy'
  | 'drift'
  | 'mechanical'
  | 'environmental'
  | 'compound'

export interface Result {
  verdict: Verdict
  dimensionScores: Record<DimensionKey, number> // 0-9 each
  mechanical: number // 0-18
  environmental: number // 0-18
  signals: string[] // warning statements for answers scoring >= 2, worst first
}

const BREAK_THRESHOLD = 8 // per side (0-18)
const DRIFT_THRESHOLD = 4 // per dimension (0-9)

export function score(answers: number[]): Result {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(`expected ${QUESTIONS.length} answers, got ${answers.length}`)
  }
  const dimensionScores: Record<DimensionKey, number> = {
    work: 0,
    resourcing: 0,
    rights: 0,
    alignment: 0,
  }
  answers.forEach((a, i) => {
    if (!Number.isInteger(a) || a < 0 || a > 3) {
      throw new Error(`answer ${i} out of range: ${a}`)
    }
    dimensionScores[QUESTIONS[i].dimension] += a
  })

  const mechanical = dimensionScores.work + dimensionScores.resourcing
  const environmental = dimensionScores.rights + dimensionScores.alignment

  let verdict: Verdict
  if (mechanical >= BREAK_THRESHOLD && environmental >= BREAK_THRESHOLD) {
    verdict = 'compound'
  } else if (mechanical >= BREAK_THRESHOLD) {
    verdict = 'mechanical'
  } else if (environmental >= BREAK_THRESHOLD) {
    verdict = 'environmental'
  } else if (
    (Object.values(dimensionScores) as number[]).some((s) => s >= DRIFT_THRESHOLD)
  ) {
    verdict = 'drift'
  } else {
    verdict = 'healthy'
  }

  const signals = answers
    .map((a, i) => ({ score: a, signal: QUESTIONS[i].signal }))
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.signal)

  return { verdict, dimensionScores, mechanical, environmental, signals }
}

// URL-hash encoding: 12 digits, one per answer, e.g. #r=012301230123
export function encodeAnswers(answers: number[]): string {
  return answers.join('')
}

export function decodeAnswers(encoded: string): number[] | null {
  if (!new RegExp(`^[0-3]{${QUESTIONS.length}}$`).test(encoded)) return null
  return encoded.split('').map(Number)
}

export const DIMENSION_ORDER: DimensionKey[] = [
  'work',
  'resourcing',
  'rights',
  'alignment',
]

export { DIMENSIONS, QUESTIONS }

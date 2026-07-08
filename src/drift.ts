// Drift Check -- 10 binary leading indicators, run as a recurring pulse.
// Complements the full diagnostic: the diagnostic locates a break that already
// happened; the pulse catches drift while it is still cheap to correct.

export interface DriftIndicator {
  label: string
  healthy: string // pick this if the healthy statement is true
  drift: string // pick this if the drift statement is true
  signal: string // warning shown when drift is picked
  kind: 'mechanical' | 'environmental'
}

export const DRIFT_INDICATORS: DriftIndicator[] = [
  {
    label: 'Priority stability',
    healthy: 'The top three priorities are unchanged since the last check',
    drift: 'A priority changed without an explicit decision',
    signal: 'Priorities are shifting without decisions. Drift starts as quiet re-prioritization.',
    kind: 'mechanical',
  },
  {
    label: 'Decision speed',
    healthy: 'Decisions are being made at the level they were assigned to',
    drift: 'Two or more decisions were escalated this week',
    signal: 'Decisions are traveling upward. Escalation volume is a leading indicator of authority ambiguity.',
    kind: 'mechanical',
  },
  {
    label: 'Named owners',
    healthy: "Every open action has one person's name on it",
    drift: 'Something has sat 48+ hours without a named owner',
    signal: 'Unowned work is accumulating. Actions without a single name do not happen.',
    kind: 'mechanical',
  },
  {
    label: 'Topics close',
    healthy: 'Meeting topics close with decisions',
    drift: 'The same topic has now appeared in three meetings',
    signal: 'Topics are recurring instead of closing. Meetings are absorbing the initiative instead of advancing it.',
    kind: 'mechanical',
  },
  {
    label: 'Metric movement',
    healthy: 'At least one target metric moved in the last three weeks',
    drift: 'No target metric has moved in three weeks',
    signal: 'Nothing measurable is moving. Activity without metric movement is the quietest form of stall.',
    kind: 'mechanical',
  },
  {
    label: 'Sponsor presence',
    healthy: 'The sponsor shows up and engages',
    drift: 'The sponsor has started sending delegates',
    signal: 'The sponsor is delegating attendance. Proxy patterns usually precede withdrawal of sponsorship.',
    kind: 'environmental',
  },
  {
    label: 'Scope discipline',
    healthy: 'Recent scope additions required removing something else',
    drift: 'New requirements arrived without new resources or trade-offs',
    signal: 'Scope is growing without substitution. Unfunded additions are how plans silently become impossible.',
    kind: 'environmental',
  },
  {
    label: 'Killed stays killed',
    healthy: 'Cancelled work has stayed cancelled',
    drift: 'A dead initiative has reappeared in another form',
    signal: 'Killed work is resurrecting. Something in the incentive structure is protecting it.',
    kind: 'environmental',
  },
  {
    label: 'Room truth',
    healthy: 'Risks get raised in the meeting itself',
    drift: 'The real risks only surface in hallway conversations afterward',
    signal: 'Truth has moved to the hallway. When the room is a performance, reporting is already decoupled from reality.',
    kind: 'environmental',
  },
  {
    label: 'Metric awareness',
    healthy: 'Everyone can name the number they own',
    drift: 'Someone drew a blank on their metric this week',
    signal: 'People cannot name their numbers. Accountability has detached from measurement.',
    kind: 'environmental',
  },
]

export type DriftVerdict = 'steady' | 'confirmed' | 'systemic'

export interface DriftResult {
  verdict: DriftVerdict
  total: number // 0-10
  mechanical: number // 0-5
  environmental: number // 0-5
  signals: string[]
}

export function scoreDrift(picks: number[]): DriftResult {
  if (picks.length !== DRIFT_INDICATORS.length) {
    throw new Error(`expected ${DRIFT_INDICATORS.length} picks, got ${picks.length}`)
  }
  let mechanical = 0
  let environmental = 0
  const signals: string[] = []
  picks.forEach((p, i) => {
    if (p !== 0 && p !== 1) throw new Error(`pick ${i} out of range: ${p}`)
    if (p === 1) {
      if (DRIFT_INDICATORS[i].kind === 'mechanical') mechanical++
      else environmental++
      signals.push(DRIFT_INDICATORS[i].signal)
    }
  })
  const total = mechanical + environmental
  const verdict: DriftVerdict = total >= 6 ? 'systemic' : total >= 3 ? 'confirmed' : 'steady'
  return { verdict, total, mechanical, environmental, signals }
}

export function encodeDrift(picks: number[]): string {
  return picks.join('')
}

export function decodeDrift(encoded: string): number[] | null {
  if (!new RegExp(`^[01]{${DRIFT_INDICATORS.length}}$`).test(encoded)) return null
  return encoded.split('').map(Number)
}

export const DRIFT_VERDICTS: Record<
  DriftVerdict,
  { title: string; tone: 'ok' | 'warn' | 'bad'; meaning: string; nextSteps: string[] }
> = {
  steady: {
    title: 'Steady',
    tone: 'ok',
    meaning:
      'Zero to two indicators flagged. Normal operating noise -- watch it, but do not convene anything. The value of the pulse is the trend line, so keep taking the reading.',
    nextSteps: [
      'Re-run this pulse bi-weekly while things stay steady.',
      'Note which indicators flagged, if any. The same flag twice in a row is a pattern, not noise.',
    ],
  },
  confirmed: {
    title: 'Drift Confirmed',
    tone: 'warn',
    meaning:
      'Three or more indicators flagged: drift is not coming, it is already underway. Caught at this stage it usually costs a conversation and a reset of priorities -- not a recovery.',
    nextSteps: [
      'Act this week. Take the flagged signals to the initiative owner or sponsor verbatim.',
      'Run the full 12-question diagnostic to locate whether the break forming is mechanical or environmental.',
      'Move to a weekly pulse until you are back under three flags.',
    ],
  },
  systemic: {
    title: 'Systemic Drift',
    tone: 'bad',
    meaning:
      'Six or more indicators flagged. This is no longer drift on an initiative -- it is a property of the environment around it. Expect the full diagnostic to show an environmental or compound pattern, and treat any plan-level fix as temporary until the system is addressed.',
    nextSteps: [
      'Run the full 12-question diagnostic now. At this level the question is not whether something is broken but which side of the system broke first.',
      'Stop absorbing the drift personally. Six-plus flags means the environment is producing it faster than one operator can correct it.',
      'Pulse weekly, and score it with a second person independently. If your counts differ by more than two, the perception gap is itself a finding.',
    ],
  },
}

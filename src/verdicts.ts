// Verdict copy -- what each classification means and what to do next.

import type { Verdict } from './scoring'

export interface VerdictCopy {
  title: string
  tone: 'ok' | 'warn' | 'bad'
  meaning: string
  nextSteps: string[]
}

export const VERDICTS: Record<Verdict, VerdictCopy> = {
  healthy: {
    title: 'Healthy Signal',
    tone: 'ok',
    meaning:
      'No dimension is flashing. The initiative may feel slow, but the structure around it -- definition, resourcing, decision rights, alignment -- is holding. Slow and structurally sound beats fast and broken.',
    nextSteps: [
      'Re-run this check monthly. Stalls rarely announce themselves; they drift first.',
      'Watch the two dimensions with your highest scores. That is where drift will start.',
      'Keep the one-sentence definition of done visible. Healthy initiatives stay healthy by re-stating it, not by assuming it.',
    ],
  },
  drift: {
    title: 'Early Drift',
    tone: 'warn',
    meaning:
      'Nothing is broken yet, but at least one dimension is degrading. This is the cheapest possible moment to act: drift caught here costs a conversation. Drift caught two quarters from now costs a recovery.',
    nextSteps: [
      'Take the flagged signals below to your next leadership sync -- verbatim. Naming drift early is the whole game.',
      'Re-validate scope and the definition of done with the sponsor this week.',
      'Re-run this diagnostic in 30 days and compare scores. Direction matters more than the number.',
    ],
  },
  mechanical: {
    title: 'Mechanical Break',
    tone: 'bad',
    meaning:
      'The work itself is broken: undefined outcomes, phantom staffing, or missing capability. The good news is mechanical breaks are the fixable kind -- they respond to scoping, sequencing, and resourcing decisions you can likely drive yourself.',
    nextSteps: [
      'Stop status reporting for one cycle and re-baseline: what is "done", who is actually working on this, what is truly blocked.',
      'Convert every "waiting on" into a named owner and a committed date, or cut it from the plan.',
      'If nobody can restate the one-sentence outcome, the initiative is not stalled -- it is undefined. Fix that first.',
    ],
  },
  environmental: {
    title: 'Environmental Block',
    tone: 'bad',
    meaning:
      'The work may be fine -- the system around it is not. Decision rights, incentives, or sponsorship are broken, and no amount of better project management fixes an environmental block. Better Gantt charts do not cure ambiguous authority.',
    nextSteps: [
      'Map who can actually say yes to the top three open decisions. If the answer is a committee or "nobody", that map is your real problem statement.',
      'Test sponsorship directly: ask the sponsor to publicly restate why this matters. Silence is data.',
      'Do not burn your team on execution fixes. Environmental blocks stall the next plan too -- take the brief below to whoever owns the decision system.',
    ],
  },
  compound: {
    title: 'Compound Stall',
    tone: 'bad',
    meaning:
      'Both sides are flashing: the work is broken AND the system around it is broken. This is the pattern where restarts fail -- each side regenerates the other. Fixing the plan without fixing the decision system just schedules the next stall.',
    nextSteps: [
      'Do not relaunch yet. A restart into a broken decision system converts your remaining credibility into evidence against the initiative.',
      'Sequence matters: decision rights and sponsorship first, then scope and resourcing. The reverse order does not hold.',
      'This is bigger than one operator can fix alone. Use the brief below to force the conversation with an executive sponsor or an outside facilitator.',
    ],
  },
}

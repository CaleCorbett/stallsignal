// StallSignal question bank -- single source of truth for diagnostic copy.
// 4 dimensions x 3 questions. Option index === score (0 healthy, 3 broken).

export type DimensionKey = 'work' | 'resourcing' | 'rights' | 'alignment'

export interface Question {
  dimension: DimensionKey
  prompt: string
  options: string[] // exactly 4, ordered healthy -> broken
  signal: string // warning statement shown when this question scores >= 2
}

export const DIMENSIONS: Record<
  DimensionKey,
  { label: string; kind: 'mechanical' | 'environmental' }
> = {
  work: { label: 'Work Definition', kind: 'mechanical' },
  resourcing: { label: 'Resourcing', kind: 'mechanical' },
  rights: { label: 'Decision Rights', kind: 'environmental' },
  alignment: { label: 'Alignment & Incentives', kind: 'environmental' },
}

export const QUESTIONS: Question[] = [
  {
    dimension: 'work',
    prompt: "Can everyone on the team state, in one sentence, what 'done' looks like?",
    options: [
      'Yes, and the sentences match',
      'Mostly, with minor variation',
      'The definition is vague or keeps shifting',
      'No two people would say the same thing',
    ],
    signal: 'The team no longer shares a definition of done. Work is moving, but not toward one target.',
  },
  {
    dimension: 'work',
    prompt: 'How was the current scope set?',
    options: [
      'Deliberately scoped and re-validated since',
      'Scoped at kickoff, unchanged since',
      'Grown by accretion, never re-baselined',
      'Nobody can point to where scope is written down',
    ],
    signal: 'Scope has drifted from whatever was originally agreed. The plan describes a project that no longer exists.',
  },
  {
    dimension: 'work',
    prompt: 'When the plan collides with reality, what happens?',
    options: [
      'The plan updates within days',
      'The plan updates eventually',
      'Plan and reality diverge silently',
      'There is no plan anymore, just status meetings',
    ],
    signal: 'The plan and reality have quietly separated. Status reporting is describing the plan, not the work.',
  },
  {
    dimension: 'resourcing',
    prompt: 'Do the people assigned to this actually have the hours?',
    options: [
      'Yes, their time is protected',
      'Mostly, with some competing pulls',
      'Officially yes, practically no',
      'They are assigned in name only',
    ],
    signal: 'The initiative is staffed on paper but not in practice. Named owners have no protected time.',
  },
  {
    dimension: 'resourcing',
    prompt: 'Are the key skills and dependencies in place?',
    options: [
      'All in place',
      'Small gaps, with a plan to close them',
      'Waiting on hires, vendors, or other teams with no dates',
      'A fundamental capability is missing',
    ],
    signal: 'Critical dependencies have no committed dates. The initiative is waiting on things nobody has promised.',
  },
  {
    dimension: 'resourcing',
    prompt: 'What has happened to the budget or runway?',
    options: [
      'Intact',
      'Tightened but workable',
      'Frozen or under review',
      'Being quietly reallocated elsewhere',
    ],
    signal: 'The money is moving away from the initiative. Budget signals usually precede official deprioritization.',
  },
  {
    dimension: 'rights',
    prompt: 'Who can say yes to a change of direction?',
    options: [
      'One named person, who decides fast',
      'A named person, but decisions are slow',
      'A committee that defers',
      'Nobody knows',
    ],
    signal: 'No single person can authorize a change of direction. Every course correction dies in a queue.',
  },
  {
    dimension: 'rights',
    prompt: 'How long do escalations take to resolve?',
    options: [
      'Days',
      'Weeks',
      'They come back unresolved',
      'People have stopped escalating',
    ],
    signal: 'Escalation has stopped working, so people have stopped escalating. Problems now travel sideways, not up.',
  },
  {
    dimension: 'rights',
    prompt: 'When a decision is made, does it stay made?',
    options: [
      'Yes',
      'Usually, with occasional relitigating',
      'It gets relitigated whenever someone senior objects',
      'Decisions here are treated as suggestions',
    ],
    signal: 'Decisions do not stay decided. The organization is spending its energy re-fighting settled questions.',
  },
  {
    dimension: 'alignment',
    prompt: 'Do the sponsoring executives still agree this matters?',
    options: [
      'Visibly, in public',
      'They say yes when asked',
      'Silence',
      'They are pushing actively conflicting priorities',
    ],
    signal: 'Executive sponsorship has gone quiet or split. The initiative is running on borrowed authority.',
  },
  {
    dimension: 'alignment',
    prompt: 'Do the teams involved win or lose together?',
    options: [
      'Shared goals and shared metrics',
      'Mostly aligned',
      'Success for one team is a cost for another',
      'Open turf conflict',
    ],
    signal: 'The incentive structure sets teams against each other. Cooperation currently requires people to act against their own scorecards.',
  },
  {
    dimension: 'alignment',
    prompt: 'What actually happens in status meetings?',
    options: [
      'Real problems get surfaced and acted on',
      'Problems get surfaced, action is slow',
      'Watermelon reporting: green outside, red inside',
      'People manage the narrative, not the work',
    ],
    signal: 'Reporting has decoupled from reality. The official picture is green while the work is red.',
  },
]

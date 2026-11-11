// Data model, constants and calculations.
// Everything here is pure and free of UI, so the numbers can be checked in one place.

export const HOURS_PER_DAY = 7.4 // a standard full working day

export const OWNERS = [
  { key: 'us', label: 'VideoVicer', short: 'VideoVicer' },
  { key: 'customer', label: 'Kunden', short: 'Kunden' },
  { key: 'thirdParty', label: 'Tredjepart', short: '3. part' },
]

export const OWNER_KEYS = OWNERS.map((o) => o.key)

export const OWNER_LABEL = {
  us: 'VideoVicer',
  customer: 'Kunden',
  thirdParty: 'Tredjepart',
}

// Ownership tells you who is holding the ball. The cause tells you why it is
// sitting still - and it is the cause that decides what can be done about it.
export const WAIT_CAUSES = [
  {
    key: 'calendar',
    label: 'Kalender',
    waitName: 'kalenderventetiden',
    human: true,
    meaning: 'Venter på at få en tid i kalenderen: et møde, en opfølgning, en kursusdag',
    countermeasure:
      'Book alle møder i forløbet ved kickoff, ikke undervejs. Kalenderventetid opstår, fordi tiden findes for sent, ikke fordi folk er optaget.',
    saving: [40, 60],
    effortNote:
      'den kræver ingen nye systemer, kun at møderne bookes ved kickoff i stedet for undervejs',
    color: '#1F3864',
  },
  {
    key: 'decision',
    label: 'Beslutning',
    waitName: 'beslutningsventetiden',
    human: true,
    meaning: 'Venter på en godkendelse eller et valg',
    countermeasure:
      'Afklar hvem der har mandatet, før forløbet starter, og få vedkommende med i lokalet. Alternativt: aftal på forhånd, hvad der kan besluttes uden dem.',
    saving: [40, 60],
    effortNote: 'den kræver én samtale om mandat, før forløbet går i gang',
    color: '#3C5488',
  },
  {
    key: 'delivery',
    label: 'Leverance',
    waitName: 'leveranceventetiden',
    human: true,
    meaning: 'Venter på, at nogen producerer noget: en liste, et dokument, en adgang',
    countermeasure:
      'Bed ikke om materialet. Send en skabelon og et eksempel på forhånd, og lav det helst sammen i en fælles arbejdssession.',
    saving: [50, 70],
    effortNote: 'den koster én skabelon og én fælles arbejdssession i stedet for en række rykkere',
    color: '#6E85B5',
  },
  {
    key: 'priority',
    label: 'Prioritering',
    waitName: 'prioriteringsventetiden',
    human: true,
    meaning: 'Opgaven ligger stille, fordi den ikke er vigtig nok lige nu',
    countermeasure:
      'Skab et synligt resultat tidligt, og find en person hos kunden, der har noget på spil i, at det lykkes. Lav prioritering er sjældent modvilje, det er fravær af konsekvens.',
    saving: [30, 50],
    effortNote:
      'den kræver, at nogen hos kunden har noget på spil — ikke at I arbejder hurtigere',
    color: '#A9B6D1',
  },
  {
    key: 'technical',
    label: 'Teknisk',
    waitName: 'den tekniske ventetid',
    human: false,
    meaning: 'Systemet kører: platformen sættes op, eller invitationer sendes og synkroniseres maskinelt',
    countermeasure:
      'Undersøg, om trinnet kan køre parallelt med andet arbejde i stedet for at blokere. Ellers er det her, automatisering faktisk giver mening.',
    saving: [20, 50],
    effortNote: 'den er den eneste af de fem, hvor automatisering faktisk er svaret',
    color: '#C9CFDB',
  },
]

export const CAUSE_BY_KEY = Object.fromEntries(WAIT_CAUSES.map((c) => [c.key, c]))

// A step without a cause is unspecified - not "delivery". If it fell back to a
// default, the tool would present a guess as a finding, and the human share
// would always read 100 %.
export const UNSPECIFIED = {
  key: null,
  label: 'Uoplyst',
  human: null,
  meaning: 'Ventetiden er registreret, men årsagen er ikke sat',
  color: '#EDEFF4',
}

export const causeOf = (key) => CAUSE_BY_KEY[key] ?? null
export const causeOrUnspecified = (key) => CAUSE_BY_KEY[key] ?? UNSPECIFIED

let idCounter = 0
export const newId = () => `s${Date.now().toString(36)}${(idCounter++).toString(36)}`

// The preloaded example: my own assumptions about how a VideoVicer onboarding runs,
// from signature to the first certificate. Built from public information only.
export const EXAMPLE_STEPS = [
  { id: 'ex1', name: 'Kickoff og forventningsafstemning', owner: 'us', processHours: 2, waitDaysBefore: 0, waitCause: 'calendar', isValueMoment: false },
  { id: 'ex2', name: 'Kunden leverer medarbejderliste og afdelinger', owner: 'customer', processHours: 2, waitDaysBefore: 4, waitCause: 'delivery', isValueMoment: false },
  { id: 'ex3', name: 'Opsætning af platform, brugere og kurser', owner: 'us', processHours: 6, waitDaysBefore: 1, waitCause: 'technical', isValueMoment: false },
  { id: 'ex4', name: 'Valg af kurser og evt. kundespecifik video', owner: 'customer', processHours: 3, waitDaysBefore: 3, waitCause: 'decision', isValueMoment: false },
  { id: 'ex5', name: 'Kunden godkender indholdet', owner: 'customer', processHours: 1, waitDaysBefore: 4, waitCause: 'decision', isValueMoment: false },
  { id: 'ex6', name: 'Invitationer sendes til medarbejderne', owner: 'us', processHours: 1, waitDaysBefore: 1, waitCause: 'technical', isValueMoment: false },
  { id: 'ex7', name: 'Første hold gennemfører kursus og quiz', owner: 'customer', processHours: 4, waitDaysBefore: 7, waitCause: 'priority', isValueMoment: true },
  { id: 'ex8', name: 'Opfølgning på gennemførsel', owner: 'us', processHours: 2, waitDaysBefore: 5, waitCause: 'calendar', isValueMoment: false },
]

export const READINESS_QUESTIONS = [
  {
    key: 'employeeList',
    label: 'Er medarbejderlisten klar?',
    help: 'En ufuldstændig liste er den hyppigste grund til, at invitationerne bliver forsinket.',
    options: ['Klar og opdateret', 'Delvist', 'Skal laves fra bunden'],
    countermeasures: [
      null,
      'Send en skabelon før kickoff, så listen kan fyldes ud inden første møde.',
      'Lav listen sammen med kunden på kickoff-mødet i stedet for at vente på den bagefter.',
    ],
  },
  {
    key: 'champion',
    label: 'Er der en navngiven ansvarlig hos kunden?',
    help: 'En person, der kender medarbejderne og kan få dem i gang.',
    options: ['Ja, fx formand eller arbejdsmiljørepræsentant', 'Uklart', 'Ingen'],
    countermeasures: [
      null,
      'Få et navn på den ansvarlige ved kickoff. Er det uklart, hvem det er, er der som regel ingen.',
      'Bed om en navngiven person, ikke en afdeling. Uden et navn tilhører forløbet alle og dermed ingen.',
    ],
  },
  {
    key: 'workTime',
    label: 'Er der afsat tid i arbejdstiden?',
    help: 'Kurser, der skal klemmes ind ved siden af arbejdet, bliver ikke gennemført.',
    options: ['Ja, fast tid', 'Ad hoc', 'Nej, det skal ske i fritiden'],
    countermeasures: [
      null,
      'Foreslå et fast tidspunkt, fx de første 15 minutter af et morgenmøde.',
      'Aftal med den ansvarlige, at det første kursus gennemføres samlet i arbejdstiden, så der skabes en vane.',
    ],
  },
  {
    key: 'deadline',
    label: 'Er der en deadline, der skaber et naturligt pres?',
    help: 'Uden en konsekvens glider kurserne ned ad prioriteringslisten.',
    options: ['Ja, fx lovkrav eller certificering', 'En intern målsætning', 'Ingen deadline'],
    countermeasures: [
      null,
      'Gør den interne målsætning synlig for medarbejderne, fx med en dato for, hvornår første hold skal være færdigt.',
      'Find en konkret anledning sammen med kunden, fx en ny byggeplads, en sæsonstart eller et tilsyn.',
    ],
  },
  {
    key: 'access',
    label: 'Kan alle medarbejdere tilgå indholdet?',
    help: 'Medarbejdere uden fast computer skal kunne komme i gang fra telefonen på få minutter.',
    options: ['Ja, alle har adgang via telefon', 'De fleste', 'Mange har ikke nem adgang'],
    countermeasures: [
      null,
      'Kortlæg, hvem der mangler adgang, før invitationerne sendes.',
      'Planlæg en fælles gennemførsel på stedet, hvor den ansvarlige viser, hvordan man kommer i gang.',
    ],
  },
]

// Every question starts in the middle. The user moves them to fit the customer.
export const DEFAULT_READINESS = Object.fromEntries(READINESS_QUESTIONS.map((q) => [q.key, 1]))

// Anything that is not a 0, 1 or 2 falls back to the middle answer. Keeps a link
// built with other questions from producing a score outside the 0-10 range.
export function cleanReadiness(raw) {
  const out = {}
  for (const q of READINESS_QUESTIONS) {
    const v = Number(raw?.[q.key])
    out[q.key] = v === 0 || v === 1 || v === 2 ? v : DEFAULT_READINESS[q.key]
  }
  return out
}

export const MULTIPLIER_BANDS = [
  { max: 1, multiplier: 0.8, label: 'Bedre end planlagt' },
  { max: 3, multiplier: 1.0, label: 'Som planlagt' },
  { max: 5, multiplier: 1.3, label: 'Noget længere' },
  { max: 7, multiplier: 1.6, label: 'Væsentligt længere' },
  { max: 10, multiplier: 2.0, label: 'Markant længere' },
]

export function bandFor(score) {
  return MULTIPLIER_BANDS.find((b) => score <= b.max) ?? MULTIPLIER_BANDS[MULTIPLIER_BANDS.length - 1]
}

// Fields may briefly hold an empty string while the user is typing.
export function num(v) {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function isBlank(v) {
  return v === null || v === undefined || String(v).trim() === ''
}

export function computeMetrics(steps) {
  const totalProcessHours = steps.reduce((sum, s) => sum + num(s.processHours), 0)
  const totalProcessDays = totalProcessHours / HOURS_PER_DAY
  const totalWaitDays = steps.reduce((sum, s) => sum + num(s.waitDaysBefore), 0)
  const totalLeadTimeDays = totalWaitDays + totalProcessDays

  const flowEfficiency = totalLeadTimeDays > 0 ? (totalProcessDays / totalLeadTimeDays) * 100 : null

  // If several steps are flagged, the first one marked as the value moment wins.
  const valueIndex = steps.findIndex((s) => s.isValueMoment)
  const ttvDays =
    valueIndex >= 0
      ? steps
          .slice(0, valueIndex + 1)
          .reduce((sum, s) => sum + num(s.waitDaysBefore) + num(s.processHours) / HOURS_PER_DAY, 0)
      : null

  let handoffs = 0
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].owner !== steps[i - 1].owner) handoffs++
  }

  // Wait before a step is attributed to whoever has to carry that step out.
  const waitByOwner = { us: 0, customer: 0, thirdParty: 0 }
  const waitByCause = {}
  let humanWaitDays = 0
  let unspecifiedWaitDays = 0
  for (const s of steps) {
    const days = num(s.waitDaysBefore)
    if (waitByOwner[s.owner] !== undefined) waitByOwner[s.owner] += days
    if (days <= 0) continue
    const cause = causeOf(s.waitCause)
    if (!cause) {
      unspecifiedWaitDays += days
      continue
    }
    waitByCause[cause.key] = (waitByCause[cause.key] || 0) + days
    if (cause.human) humanWaitDays += days
  }
  // The share is measured against the wait the user has actually classified.
  const classifiedWaitDays = totalWaitDays - unspecifiedWaitDays
  const humanWaitShare =
    classifiedWaitDays > 0 ? (humanWaitDays / classifiedWaitDays) * 100 : null

  const topWaits = steps
    .map((s, index) => ({
      index,
      name: s.name,
      owner: s.owner,
      cause: s.waitCause && CAUSE_BY_KEY[s.waitCause] ? s.waitCause : null,
      days: num(s.waitDaysBefore),
    }))
    .filter((s) => s.days > 0)
    .sort((a, b) => b.days - a.days)
    .slice(0, 3)
    .map((s) => ({
      ...s,
      shareOfTotal: totalLeadTimeDays > 0 ? (s.days / totalLeadTimeDays) * 100 : 0,
    }))

  return {
    totalProcessHours,
    totalProcessDays,
    totalWaitDays,
    totalLeadTimeDays,
    flowEfficiency,
    valueIndex,
    ttvDays,
    handoffs,
    waitByOwner,
    waitByCause,
    humanWaitDays,
    humanWaitShare,
    unspecifiedWaitDays,
    classifiedWaitDays,
    topWaits,
  }
}

export function computeReadiness(metrics, readiness) {
  const score = READINESS_QUESTIONS.reduce((sum, q) => sum + (Number(readiness[q.key]) || 0), 0)
  const band = bandFor(score)
  const customerWait = metrics.waitByOwner.customer
  const otherWait = metrics.waitByOwner.us + metrics.waitByOwner.thirdParty
  const realisticWaitDays = customerWait * band.multiplier + otherWait
  const realisticLeadTimeDays = realisticWaitDays + metrics.totalProcessDays

  // A countermeasure for each answer that scores badly. A number with no way
  // out is just a verdict.
  const actions = READINESS_QUESTIONS.map((q) => {
    const value = Number(readiness[q.key]) || 0
    const text = q.countermeasures[value]
    return text ? { key: q.key, label: q.label, answer: q.options[value], text } : null
  }).filter(Boolean)

  return {
    score,
    band,
    multiplier: band.multiplier,
    realisticWaitDays,
    realisticLeadTimeDays,
    deltaDays: realisticLeadTimeDays - metrics.totalLeadTimeDays,
    actions,
  }
}

// What would happen if the three biggest delays were handled?
// The ranges come from the rules of thumb per cause, not from the user's data.
export function computeImprovement(metrics) {
  const top = metrics.topWaits
  if (!top.length || metrics.totalLeadTimeDays <= 0) return null

  // A delay without a cause has no saving range. It is skipped rather than
  // guessed into a number the user has no basis for.
  let minSaved = 0
  let maxSaved = 0
  let usedPosts = 0
  let skippedDays = 0
  for (const w of top) {
    const cause = causeOf(w.cause)
    if (!cause) {
      skippedDays += w.days
      continue
    }
    usedPosts++
    minSaved += (w.days * cause.saving[0]) / 100
    maxSaved += (w.days * cause.saving[1]) / 100
  }
  if (!usedPosts) return null

  const leadHigh = metrics.totalLeadTimeDays - minSaved
  const leadLow = Math.max(metrics.totalProcessDays, metrics.totalLeadTimeDays - maxSaved)
  const flowLow = leadHigh > 0 ? (metrics.totalProcessDays / leadHigh) * 100 : null
  const flowHigh = leadLow > 0 ? (metrics.totalProcessDays / leadLow) * 100 : null

  return { minSaved, maxSaved, leadLow, leadHigh, flowLow, flowHigh, usedPosts, skippedDays }
}

// What do you do first? The cause that realistically frees up the most days.
// The ranking covers the whole flow, not just the three biggest delays, because
// a countermeasure against a cause hits every place that cause appears.
export function computeStartHere(metrics) {
  const ranked = Object.entries(metrics.waitByCause)
    .map(([key, days]) => {
      const cause = causeOf(key)
      if (!cause) return null
      const midpoint = (cause.saving[0] + cause.saving[1]) / 2 / 100
      return { cause, days, expectedSaving: days * midpoint }
    })
    .filter(Boolean)
    .sort((a, b) => b.expectedSaving - a.expectedSaving || b.days - a.days)

  if (!ranked.length) return null
  const [first, ...rest] = ranked
  const mostOtherDays = rest.reduce((max, r) => Math.max(max, r.days), 0)
  return {
    ...first,
    // "More days than any other cause" is only true if no other cause matches it.
    // The ranking is by expected saving, so the two can differ - and two causes
    // can tie on days.
    hasMostDays: rest.length > 0 && first.days > mostOtherDays,
    causeCount: ranked.length,
  }
}

// The days of waiting a countermeasure would attack, found by cause rather than by
// step number, so the figures follow the flow if the user edits it.
export function waitByCauses(steps, causeKeys) {
  const rows = []
  steps.forEach((s, index) => {
    const days = num(s.waitDaysBefore)
    if (days > 0 && causeKeys.includes(s.waitCause)) {
      rows.push({ index, name: s.name, cause: s.waitCause, days })
    }
  })
  return { rows, totalDays: rows.reduce((sum, r) => sum + r.days, 0) }
}

export function computeAdoption(metrics, adoptionDays) {
  if (isBlank(adoptionDays)) return { days: null, realTimeToValue: null }
  const days = num(adoptionDays)
  return {
    days,
    realTimeToValue: metrics.ttvDays !== null ? metrics.ttvDays + days : null,
  }
}

// The building blocks for the timeline: wait and work in turn, in calendar time.
export function buildBlocks(steps) {
  const blocks = []
  let cursor = 0
  steps.forEach((step, index) => {
    const wait = num(step.waitDaysBefore)
    if (wait > 0) {
      blocks.push({
        kind: 'wait',
        stepIndex: index,
        owner: step.owner,
        cause: step.waitCause && CAUSE_BY_KEY[step.waitCause] ? step.waitCause : null,
        name: step.name,
        start: cursor,
        days: wait,
      })
      cursor += wait
    }
    const work = num(step.processHours) / HOURS_PER_DAY
    blocks.push({
      kind: 'work',
      stepIndex: index,
      owner: step.owner,
      name: step.name,
      start: cursor,
      days: work,
      hours: num(step.processHours),
      isValueMoment: !!step.isValueMoment,
    })
    cursor += work
  })
  return blocks
}

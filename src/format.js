// Number formatting in one place, so the figures look the same everywhere.
// Danish: comma as the decimal mark, full stop for thousands.

const LOCALE = 'da-DK'

export function fmt(n, decimals = 1) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—'
  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function fmtDays(n, decimals = 1) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—'
  return fmt(n, decimals)
}

export function fmtInt(n) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—'
  return Math.round(n).toLocaleString(LOCALE)
}

export function fmtPct(n, decimals = 0) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—'
  return fmt(n, decimals)
}

// "5 dage" / "1 dag", with the singular right
export function dayWord(n) {
  return Math.abs(n - 1) < 0.05 ? 'dag' : 'dage'
}

// "1 time" / "2 timer"
export function hourWord(n) {
  return Math.abs(n - 1) < 0.05 ? 'time' : 'timer'
}

// The rounding rule: calculated figures may carry one decimal, estimates may not.
// An estimate that looks precise promises more than it can keep.
export function fmtEstimate(n) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—'
  return Math.round(n).toLocaleString(LOCALE)
}

export function fmtEstimateRange(low, high) {
  if (![low, high].every((n) => Number.isFinite(n))) return '—'
  const a = Math.round(low)
  const b = Math.round(high)
  return a === b ? String(a) : a + '–' + b
}

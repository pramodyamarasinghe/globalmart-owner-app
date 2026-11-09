/** Format integer cents as currency text (e.g. 845000 → "8,450.00"). */
export function formatCents(cents: number | null | undefined): string {
  if (cents == null || Number.isNaN(cents)) return '—'
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const whole = Math.floor(abs / 100)
  const frac = String(abs % 100).padStart(2, '0')
  return `${sign}${whole.toLocaleString('en-LK')}.${frac}`
}

/** Format milli-quantities using the product's baseUnitDecimals (default 3). */
export function formatMilli(
  milli: number | null | undefined,
  decimals = 3,
  unit?: string | null
): string {
  if (milli == null || Number.isNaN(milli)) return '—'
  const divisor = 10 ** Math.max(0, decimals)
  const value = milli / divisor
  const text =
    decimals <= 0
      ? Math.round(value).toLocaleString('en-LK')
      : value.toLocaleString('en-LK', {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals,
        })
  return unit ? `${text} ${unit}` : text
}

/** One base-unit step in milli (e.g. decimals=3 → 1000). */
export function unitStepMilli(decimals = 3): number {
  return 10 ** Math.max(0, decimals)
}

export function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function monthStartIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}

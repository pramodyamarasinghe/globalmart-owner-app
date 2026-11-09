import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { monthStartIso, todayIso } from '@/src/shared/lib/money'

export type DateRange = { from: string; to: string }

export type PeriodKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom'

function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function rangeForPeriod(key: Exclude<PeriodKey, 'custom'>): DateRange {
  const today = todayIso()
  switch (key) {
    case 'today':
      return { from: today, to: today }
    case 'yesterday': {
      const y = shiftDays(today, -1)
      return { from: y, to: y }
    }
    case 'last7':
      return { from: shiftDays(today, -6), to: today }
    case 'thisMonth':
      return { from: monthStartIso(), to: today }
    case 'lastMonth': {
      const d = new Date(`${today}T12:00:00`)
      const firstThis = new Date(d.getFullYear(), d.getMonth(), 1)
      const lastPrev = new Date(firstThis.getTime() - 86400000)
      const firstPrev = new Date(lastPrev.getFullYear(), lastPrev.getMonth(), 1)
      const fmt = (x: Date) =>
        `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
      return { from: fmt(firstPrev), to: fmt(lastPrev) }
    }
    case 'thisYear': {
      const y = new Date().getFullYear()
      return { from: `${y}-01-01`, to: today }
    }
  }
}

export const PERIOD_OPTIONS: { key: Exclude<PeriodKey, 'custom'>; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 days' },
  { key: 'thisMonth', label: 'This month' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'thisYear', label: 'This year' },
]

export function isoToDate(iso: string): Date {
  return new Date(`${iso}T12:00:00`)
}

export function dateToIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export type PeriodState = { key: PeriodKey; range: DateRange }

const slice = createSlice({
  name: 'period',
  initialState: { key: 'thisMonth', range: rangeForPeriod('thisMonth') } as PeriodState,
  reducers: {
    setPeriod: (s, a: PayloadAction<Exclude<PeriodKey, 'custom'>>) => {
      s.key = a.payload
      s.range = rangeForPeriod(a.payload)
    },
    setCustomRange: (s, a: PayloadAction<DateRange>) => {
      const { from, to } = a.payload
      s.key = 'custom'
      s.range = from > to ? { from: to, to: from } : { from, to }
    },
    setCustomFrom: (s, a: PayloadAction<string>) => {
      s.key = 'custom'
      s.range = a.payload > s.range.to ? { from: s.range.to, to: a.payload } : { ...s.range, from: a.payload }
    },
    setCustomTo: (s, a: PayloadAction<string>) => {
      s.key = 'custom'
      s.range = s.range.from > a.payload ? { from: a.payload, to: s.range.from } : { ...s.range, to: a.payload }
    },
  },
})

export const { setPeriod, setCustomRange, setCustomFrom, setCustomTo } = slice.actions
export const periodReducer = slice.reducer

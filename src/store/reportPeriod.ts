import { create } from 'zustand'
import { monthStartIso, todayIso } from '@/src/lib/money'

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

type PeriodState = {
  key: PeriodKey
  range: DateRange
  setPeriod: (key: Exclude<PeriodKey, 'custom'>) => void
  setCustomRange: (range: DateRange) => void
  setCustomFrom: (from: string) => void
  setCustomTo: (to: string) => void
}

export const useReportPeriod = create<PeriodState>((set, get) => ({
  key: 'thisMonth',
  range: rangeForPeriod('thisMonth'),

  setPeriod: (key) => set({ key, range: rangeForPeriod(key) }),

  setCustomRange: (range) => {
    let { from, to } = range
    if (from > to) [from, to] = [to, from]
    set({ key: 'custom', range: { from, to } })
  },

  setCustomFrom: (from) => {
    const to = get().range.to
    get().setCustomRange({ from, to })
  },

  setCustomTo: (to) => {
    const from = get().range.from
    get().setCustomRange({ from, to })
  },
}))

import { useMemo } from 'react'
import { ZodError } from 'zod'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { errorMessage } from '@/src/shared/lib/errors'
import { useRefetchOnFocus } from '@/src/shared/hooks/useRefetchOnFocus'
import { GROUP_ORDER, REPORT_META, metaFor, type ReportMeta } from './reportMeta'
import { setCustomFrom, setCustomRange, setCustomTo, setPeriod, type DateRange, type PeriodKey } from './periodSlice'
import { useGetReportQuery, useListReportsQuery } from './reportsApi'
import { buildReportQuery } from './reports.validation'

export function useReportPeriod() {
  const dispatch = useAppDispatch()
  const { key, range } = useAppSelector((s) => s.period)
  return {
    key,
    range,
    setPeriod: (k: Exclude<PeriodKey, 'custom'>) => dispatch(setPeriod(k)),
    setCustomRange: (r: DateRange) => dispatch(setCustomRange(r)),
    setCustomFrom: (from: string) => dispatch(setCustomFrom(from)),
    setCustomTo: (to: string) => dispatch(setCustomTo(to)),
  }
}

/** Reports grouped for the list screen. Unknown reports the server offers go under Finance. */
export function useReportList() {
  const list = useListReportsQuery()
  useRefetchOnFocus(() => list.refetch())

  const sections = useMemo(() => {
    const names = list.data
    const available = new Set(names ?? REPORT_META.map((r) => r.name))
    const byGroup = new Map<string, ReportMeta[]>()
    const add = (m: ReportMeta) => byGroup.set(m.group, [...(byGroup.get(m.group) ?? []), m])
    for (const meta of REPORT_META) if (available.has(meta.name)) add(meta)
    for (const name of names ?? []) {
      if (!REPORT_META.some((m) => m.name === name)) add(metaFor(name))
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({ title: g, data: byGroup.get(g)! }))
  }, [list.data])

  return {
    sections,
    hasNames: list.data !== undefined,
    loading: list.isLoading,
    error: list.error ? errorMessage(list.error, 'Failed to load reports.') : null,
    refetch: () => void list.refetch(),
  }
}

export function useReport(name: string | undefined) {
  const meta = useMemo(() => metaFor(name ?? ''), [name])
  const { range } = useReportPeriod()

  // A bad date range is caught by the schema here, before any request is made.
  const built = useMemo(() => {
    try {
      return { query: buildReportQuery(meta, range), invalid: null }
    } catch (e) {
      // The schema's messages are written for the user ("The start date is after the end date.").
      const issue = e instanceof ZodError ? e.issues[0]?.message : undefined
      return { query: undefined, invalid: issue ?? 'Please pick a valid period.' }
    }
  }, [meta, range])

  const report = useGetReportQuery({ name: name ?? '', query: built.query }, { skip: !name || built.invalid !== null })

  const error =
    built.invalid ?? (report.error ? errorMessage(report.error, 'This report could not be loaded. Please try again.') : null)

  return {
    meta,
    // currentData is empty while a new period loads, so the old period's rows never show under the new one.
    data: built.invalid ? null : (report.currentData ?? null),
    loading: report.isFetching && report.currentData === undefined,
    refreshing: report.isFetching && report.currentData !== undefined,
    error,
    refetch: () => void report.refetch(),
  }
}

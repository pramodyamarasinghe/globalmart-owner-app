import type { ReportMeta } from './reportMeta'
import { reportQuerySchema, type ReportQuery } from './reports.schemas'
import type { DateRange } from './periodSlice'

/** Query for a report, or undefined when it takes none (sales-today rejects any). Throws on a bad range. */
export function buildReportQuery(meta: ReportMeta, range: DateRange): ReportQuery | undefined {
  if (meta.noParams || !meta.needsDates) return undefined
  return reportQuerySchema.parse({ from: range.from, to: range.to, offset: 0, limit: 50 })
}

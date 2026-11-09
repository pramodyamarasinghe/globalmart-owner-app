import { baseApi } from '@/src/api/baseApi'
import { reportListSchema } from '@/src/features/auth/auth.schemas'
import type { ReportQuery } from './reports.schemas'

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listReports: b.query<string[], void>({
      query: () => ({ path: '/reports', schema: reportListSchema }),
      transformResponse: (r: { reports: string[] }) => r.reports,
    }),
    /** Report shapes differ per report, so the viewer reads them loosely. */
    getReport: b.query<unknown, { name: string; query?: ReportQuery }>({
      query: ({ name, query }) => ({ path: `/reports/${encodeURIComponent(name)}`, params: query }),
    }),
  }),
})

export const { useListReportsQuery, useGetReportQuery } = reportsApi

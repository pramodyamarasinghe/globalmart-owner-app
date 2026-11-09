import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Dates look like 2026-01-31.')

/** The query a dated report accepts (the API's reportFilter plus paging). */
export const reportQuerySchema = z
  .object({
    from: isoDate,
    to: isoDate,
    offset: z.literal(0),
    limit: z.literal(50),
  })
  .refine((q) => q.from <= q.to, 'The start date is after the end date.')

export type ReportQuery = z.infer<typeof reportQuerySchema>

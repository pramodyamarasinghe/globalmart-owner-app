import type { z } from 'zod'
import { baseApi } from '@/src/api/baseApi'
import { cloudOnlyError } from '@/src/shared/lib/errors'
import { healthSchema } from '@/src/features/auth/auth.schemas'
import { catalogSchema, stockReportSchema, type CatalogProduct, type StockRow } from './catalog.schemas'

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getStock: b.query<StockRow[], void>({
      query: () => ({ path: '/reports/stock', schema: stockReportSchema }),
      transformResponse: (r: { rows: StockRow[] }) => r.rows,
    }),
    getCatalog: b.query<CatalogProduct[], void>({
      query: () => ({ path: '/catalog', schema: catalogSchema }),
      transformResponse: (r: z.infer<typeof catalogSchema>): CatalogProduct[] =>
        r.products.map((p) => ({
          ...p,
          packIds: r.options === undefined ? null : r.options.filter((o) => o.productId === p.id).map((o) => o.id),
        })),
      transformErrorResponse: cloudOnlyError,
    }),
    /** Age of the server's copy of the shop data in seconds (null until the first copy). */
    getSnapshotAge: b.query<number | null, void>({
      query: () => ({ path: '/health', auth: false, schema: healthSchema }),
      transformResponse: (r: { snapshotAgeSeconds?: number | null }) => r.snapshotAgeSeconds ?? null,
    }),
  }),
})

export const { useGetStockQuery, useGetCatalogQuery, useGetSnapshotAgeQuery } = catalogApi

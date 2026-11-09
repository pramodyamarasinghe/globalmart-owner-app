import { z } from 'zod'

const int = z.number().int()

export const stockRowSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  sku: z.string(),
  baseUnitCode: z.string(),
  baseUnitDecimals: int,
  onHandMilli: int,
  valueCents: int,
  packs: z.array(
    z.object({ id: z.string(), label: z.string(), baseQtyMilli: int, isDefault: z.boolean() })
  ),
})
export const stockReportSchema = z.object({ rows: z.array(stockRowSchema) })

/** SQLite hands back 0/1 for allowLoose. */
export const catalogSchema = z.object({
  products: z.array(
    z.object({ id: z.string(), allowLoose: z.union([z.boolean(), z.number()]).transform(Boolean) })
  ),
})

export type StockRow = z.infer<typeof stockRowSchema>
export type CatalogProduct = z.infer<typeof catalogSchema>['products'][number]

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

/**
 * SQLite hands back 0/1 for allowLoose. The API lists only what has a selling price: allowLoose means the loose
 * price is set, and options are the packs with a price. Older servers send no options; then every pack counts.
 */
export const catalogSchema = z.object({
  products: z.array(
    z.object({ id: z.string(), allowLoose: z.union([z.boolean(), z.number()]).transform(Boolean) })
  ),
  options: z.array(z.object({ id: z.string(), productId: z.string() })).optional(),
})

export type StockRow = z.infer<typeof stockRowSchema>
/** packIds: the priced packs of the product; null when the server does not say (older API). */
export type CatalogProduct = z.infer<typeof catalogSchema>['products'][number] & { packIds: string[] | null }

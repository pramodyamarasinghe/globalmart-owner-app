import type { CatalogProduct, StockRow } from '@/src/features/catalog/catalog.schemas'
import type { SellRow } from './sell.types'

/**
 * The till refuses a product that is not sold loose unless the line names a pack, so those
 * products are sold one default pack at a time. A product with no priced pack, or not in the catalog, is left out:
 * prices come from deliveries, and the till refuses anything without a selling price.
 */
export function toSellRows(stock: StockRow[], catalog: CatalogProduct[]): SellRow[] {
  const byId = new Map(catalog.map((p) => [p.id, p]))
  const rows: SellRow[] = []
  for (const r of stock) {
    const product = byId.get(r.productId)
    if (product === undefined) continue
    if (product.allowLoose) {
      rows.push({ ...r, optionId: null, stepMilli: 10 ** Math.max(0, r.baseUnitDecimals) })
      continue
    }
    const priced = product.packIds === null ? r.packs : r.packs.filter((p) => product.packIds?.includes(p.id))
    const pack = priced.find((p) => p.isDefault) ?? priced[0]
    if (pack) rows.push({ ...r, optionId: pack.id, stepMilli: pack.baseQtyMilli })
  }
  return rows
}

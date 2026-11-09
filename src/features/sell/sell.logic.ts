import type { CatalogProduct, StockRow } from '@/src/features/catalog/catalog.schemas'
import type { SellRow } from './sell.types'

/**
 * The till refuses a product that is not sold loose unless the line names a pack, so those
 * products are sold one default pack at a time. A product with no pack, or not in the catalog, is left out.
 */
export function toSellRows(stock: StockRow[], catalog: CatalogProduct[]): SellRow[] {
  const loose = new Map(catalog.map((p) => [p.id, p.allowLoose]))
  const rows: SellRow[] = []
  for (const r of stock) {
    const allowLoose = loose.get(r.productId)
    if (allowLoose === undefined) continue
    if (allowLoose) {
      rows.push({ ...r, optionId: null, stepMilli: 10 ** Math.max(0, r.baseUnitDecimals) })
      continue
    }
    const pack = r.packs.find((p) => p.isDefault) ?? r.packs[0]
    if (pack) rows.push({ ...r, optionId: pack.id, stepMilli: pack.baseQtyMilli })
  }
  return rows
}

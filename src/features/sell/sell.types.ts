import type { StockRow } from '@/src/features/catalog/catalog.schemas'

/** A product as the Sell screen offers it: the unit one tap adds, and the pack the till prices it by. */
export type SellRow = StockRow & { optionId: string | null; stepMilli: number }

import { create } from 'zustand'
import type { StockRow } from '@/src/api/reports'
import { unitStepMilli } from '@/src/lib/money'

export type CartLine = {
  productId: string
  productName: string
  sku: string
  baseUnitCode: string
  baseUnitDecimals: number
  qtyMilli: number
  onHandMilli: number
}

type CartState = {
  lines: CartLine[]
  addProduct: (row: StockRow) => void
  /** Remove one unit step; drops the line at zero. */
  removeOne: (row: StockRow) => void
  setQty: (productId: string, qtyMilli: number) => void
  remove: (productId: string) => void
  clear: () => void
  lineCount: () => number
  totalUnits: () => number
}

export const useCart = create<CartState>((set, get) => ({
  lines: [],

  addProduct: (row) => {
    const step = unitStepMilli(row.baseUnitDecimals)
    set((state) => {
      const existing = state.lines.find((l) => l.productId === row.productId)
      if (existing) {
        const nextQty = Math.min(existing.qtyMilli + step, row.onHandMilli)
        return {
          lines: state.lines.map((l) =>
            l.productId === row.productId
              ? { ...l, qtyMilli: nextQty, onHandMilli: row.onHandMilli }
              : l
          ),
        }
      }
      if (row.onHandMilli < step) return state
      return {
        lines: [
          ...state.lines,
          {
            productId: row.productId,
            productName: row.productName,
            sku: row.sku,
            baseUnitCode: row.baseUnitCode,
            baseUnitDecimals: row.baseUnitDecimals,
            qtyMilli: step,
            onHandMilli: row.onHandMilli,
          },
        ],
      }
    })
  },

  removeOne: (row) => {
    const step = unitStepMilli(row.baseUnitDecimals)
    set((state) => {
      const existing = state.lines.find((l) => l.productId === row.productId)
      if (!existing) return state
      const nextQty = existing.qtyMilli - step
      if (nextQty <= 0) {
        return { lines: state.lines.filter((l) => l.productId !== row.productId) }
      }
      return {
        lines: state.lines.map((l) =>
          l.productId === row.productId ? { ...l, qtyMilli: nextQty } : l
        ),
      }
    })
  },

  setQty: (productId, qtyMilli) => {
    set((state) => ({
      lines: state.lines
        .map((l) => {
          if (l.productId !== productId) return l
          const clamped = Math.max(0, Math.min(qtyMilli, l.onHandMilli))
          return { ...l, qtyMilli: clamped }
        })
        .filter((l) => l.qtyMilli > 0),
    }))
  },

  remove: (productId) => {
    set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) }))
  },

  clear: () => set({ lines: [] }),

  lineCount: () => get().lines.length,

  totalUnits: () => get().lines.reduce((n, l) => n + l.qtyMilli, 0),
}))

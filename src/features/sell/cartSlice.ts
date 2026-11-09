import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { logout } from '@/src/features/auth/authSlice'
import type { SellRow } from './sell.types'

export type CartLine = {
  productId: string
  productName: string
  sku: string
  baseUnitCode: string
  baseUnitDecimals: number
  /** Pack the till prices this line by; null = sold loose. */
  optionId: string | null
  /** One tap / one pack, in the same milli unit as qtyMilli. */
  stepMilli: number
  qtyMilli: number
  onHandMilli: number
}

export type CartState = { lines: CartLine[] }

const slice = createSlice({
  name: 'cart',
  initialState: { lines: [] } as CartState,
  reducers: {
    addProduct: (s, { payload: row }: PayloadAction<SellRow>) => {
      const step = row.stepMilli
      const line = s.lines.find((l) => l.productId === row.productId)
      if (line) {
        if (line.qtyMilli + step > row.onHandMilli) return
        line.qtyMilli += step
        line.onHandMilli = row.onHandMilli
        return
      }
      if (row.onHandMilli < step) return
      s.lines.push({
        productId: row.productId,
        productName: row.productName,
        sku: row.sku,
        baseUnitCode: row.baseUnitCode,
        baseUnitDecimals: row.baseUnitDecimals,
        optionId: row.optionId,
        stepMilli: step,
        qtyMilli: step,
        onHandMilli: row.onHandMilli,
      })
    },
    /** Remove one step; drops the line at zero. */
    removeOne: (s, { payload: row }: PayloadAction<SellRow>) => {
      const line = s.lines.find((l) => l.productId === row.productId)
      if (!line) return
      line.qtyMilli -= row.stepMilli
      if (line.qtyMilli <= 0) s.lines = s.lines.filter((l) => l !== line)
    },
    setQty: (s, { payload }: PayloadAction<{ productId: string; qtyMilli: number }>) => {
      const line = s.lines.find((l) => l.productId === payload.productId)
      if (!line) return
      line.qtyMilli = Math.max(0, Math.min(payload.qtyMilli, line.onHandMilli))
      if (line.qtyMilli === 0) s.lines = s.lines.filter((l) => l !== line)
    },
    removeLine: (s, { payload }: PayloadAction<string>) => {
      s.lines = s.lines.filter((l) => l.productId !== payload)
    },
    clearCart: (s) => {
      s.lines = []
    },
  },
  extraReducers: (b) => {
    // A different login must not inherit the previous user's cart.
    b.addCase(logout.fulfilled, (s) => {
      s.lines = []
    })
  },
})

export const { addProduct, removeOne, setQty, removeLine, clearCart } = slice.actions
export const cartReducer = slice.reducer

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { addProduct, clearCart, removeLine, removeOne, setQty } from './cartSlice'
import type { SellRow } from './sell.types'

/** Handlers are stable across renders so memoized list rows are not re-rendered by a cart change elsewhere. */
export function useCart() {
  const dispatch = useAppDispatch()
  const lines = useAppSelector((s) => s.cart.lines)
  return {
    lines,
    add: useCallback((row: SellRow) => void dispatch(addProduct(row)), [dispatch]),
    removeOne: useCallback((row: SellRow) => void dispatch(removeOne(row)), [dispatch]),
    setQty: useCallback(
      (productId: string, qtyMilli: number) => void dispatch(setQty({ productId, qtyMilli })),
      [dispatch]
    ),
    remove: useCallback((productId: string) => void dispatch(removeLine(productId)), [dispatch]),
    clear: useCallback(() => void dispatch(clearCart()), [dispatch]),
  }
}

import { useRef, useState } from 'react'
import { uuidv7 } from '@/src/shared/lib/uuid7'
import { errorMessage } from '@/src/shared/lib/errors'
import { useCreateOrderMutation } from '@/src/features/orders/ordersApi'
import { useCart } from './useCart'
import { toOrderLines, validateOrder } from './sell.validation'

/** Turns the cart into an order. The same cart keeps the same order id, so a retry after a dropped connection cannot double-send. */
export function useSendOrder() {
  const { lines, clear } = useCart()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const [error, setError] = useState<string | null>(null)
  const attempt = useRef<{ key: string; id: string } | null>(null)

  /** Resolves true once the cashier has the order. */
  async function send(): Promise<boolean> {
    if (lines.length === 0 || isLoading) return false
    const orderLines = toOrderLines(lines)
    const key = JSON.stringify(orderLines)
    if (attempt.current?.key !== key) attempt.current = { key, id: uuidv7() }

    const checked = validateOrder({ id: attempt.current.id, customer_id: null, lines: orderLines, note: '' })
    if (!checked.ok) {
      setError(checked.message)
      return false
    }
    setError(null)
    const result = await createOrder(checked.order)
    if ('error' in result) {
      setError(errorMessage(result.error, 'Could not send the order. Try again.'))
      return false
    }
    attempt.current = null
    clear()
    return true
  }

  return { send, sending: isLoading, error }
}

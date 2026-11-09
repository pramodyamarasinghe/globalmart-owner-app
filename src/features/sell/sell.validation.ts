import { orderInput, type OrderInput } from '@/src/features/orders/orders.schemas'
import type { CartLine } from './cartSlice'

/** Cart lines in the order API shape. */
export function toOrderLines(lines: CartLine[]): OrderInput['lines'] {
  return lines.map((l) => ({
    product_id: l.productId,
    selling_option_id: l.optionId,
    qty_milli: l.qtyMilli,
  }))
}

/** Checks an order before it leaves the phone; the message is shown to the user as is. */
export function validateOrder(order: OrderInput): { ok: true; order: OrderInput } | { ok: false; message: string } {
  const parsed = orderInput.safeParse(order)
  return parsed.success
    ? { ok: true, order: parsed.data }
    : { ok: false, message: parsed.error.issues[0]?.message ?? 'The order is not valid.' }
}

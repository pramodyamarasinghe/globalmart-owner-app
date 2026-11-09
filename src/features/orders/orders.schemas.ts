import { z } from 'zod'

const int = z.number().int()

/** Mirrors globalmart-report-api/src/orders.ts. */
export const orderInput = z.strictObject({
  id: z.uuid({ version: 'v7' }),
  customer_id: z.uuid().nullable(),
  lines: z
    .array(
      z.strictObject({
        product_id: z.uuid(),
        selling_option_id: z.uuid().nullable(),
        qty_milli: z
          .int()
          .min(1, 'Quantities must be at least one.')
          .max(1_000_000_000, 'A quantity is too large.'),
      })
    )
    .min(1, 'The cart is empty.')
    .max(100, 'An order can have at most 100 products.'),
  note: z.string().max(500),
})

export const orderStatus = z.enum(['pending', 'claimed', 'held', 'posted', 'cancelled', 'rejected'])

export const orderRowSchema = z.object({
  id: z.string(),
  status: orderStatus,
  reject_reason: z.string().nullable(),
  created_at: z.string(),
  lines: z.array(z.object({ product_id: z.string(), qty_milli: int })),
})
export const orderListSchema = z.array(orderRowSchema)

export const idSchema = z.object({ id: z.string() })

export type OrderInput = z.infer<typeof orderInput>
export type OrderRow = z.infer<typeof orderRowSchema>

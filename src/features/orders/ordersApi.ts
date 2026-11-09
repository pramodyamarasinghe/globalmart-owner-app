import { baseApi } from '@/src/api/baseApi'
import { cloudOnlyError } from '@/src/shared/lib/errors'
import { idSchema, orderListSchema, type OrderInput, type OrderRow } from './orders.schemas'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listOrders: b.query<OrderRow[], void>({
      query: () => ({ path: '/orders', schema: orderListSchema }),
      transformErrorResponse: cloudOnlyError,
      providesTags: ['Orders'],
    }),
    /** The order id is the API's idempotency key: sending the same id again stores nothing new. */
    createOrder: b.mutation<{ id: string }, OrderInput>({
      query: (body) => ({ path: '/orders', method: 'POST', body, schema: idSchema }),
      transformErrorResponse: cloudOnlyError,
      invalidatesTags: ['Orders'],
    }),
    cancelOrder: b.mutation<{ id: string }, string>({
      query: (id) => ({ path: `/orders/${encodeURIComponent(id)}/cancel`, method: 'POST', schema: idSchema }),
      transformErrorResponse: cloudOnlyError,
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const { useListOrdersQuery, useCreateOrderMutation, useCancelOrderMutation } = ordersApi

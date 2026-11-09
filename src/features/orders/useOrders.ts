import { useCallback, useMemo, useState } from 'react'
import { useGetStockQuery } from '@/src/features/catalog/catalogApi'
import { errorMessage } from '@/src/shared/lib/errors'
import { useRefetchOnFocus } from '@/src/shared/hooks/useRefetchOnFocus'
import { useCancelOrderMutation, useListOrdersQuery } from './ordersApi'

export function useOrders() {
  const orders = useListOrdersQuery()
  const stock = useGetStockQuery()
  const [cancel] = useCancelOrderMutation()
  const [cancelError, setCancelError] = useState<string | null>(null)

  useRefetchOnFocus(() => {
    void orders.refetch()
    void stock.refetch()
  })

  const cancelOrder = useCallback(
    async (id: string) => {
      setCancelError(null)
      const result = await cancel(id)
      if ('error' in result) setCancelError(errorMessage(result.error, 'Could not cancel the order.'))
    },
    [cancel]
  )

  const products = useMemo(() => new Map((stock.data ?? []).map((r) => [r.productId, r])), [stock.data])
  const list = orders.data ?? []
  const failure = orders.error ?? stock.error

  return {
    orders: list,
    products,
    waiting: list.filter((o) => o.status === 'pending').length,
    loading: orders.isLoading || stock.isLoading,
    refreshing: orders.isFetching && !orders.isLoading,
    error: cancelError ?? (failure ? errorMessage(failure, 'Failed to load orders.') : null),
    refetch: () => {
      setCancelError(null)
      void orders.refetch()
      void stock.refetch()
    },
    cancel: cancelOrder,
  }
}

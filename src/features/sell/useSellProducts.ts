import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useGetCatalogQuery, useGetSnapshotAgeQuery, useGetStockQuery } from '@/src/features/catalog/catalogApi'
import { errorMessage } from '@/src/shared/lib/errors'
import { useRefetchOnFocus } from '@/src/shared/hooks/useRefetchOnFocus'
import { toSellRows } from './sell.logic'

/** Products on the Sell screen: stock + catalog joined, searchable, with the age of the server's data. */
export function useSellProducts() {
  const stock = useGetStockQuery()
  const catalog = useGetCatalogQuery()
  const age = useGetSnapshotAgeQuery()
  const [query, setQuery] = useState('')
  // The input stays instant; the grid re-filters at lower priority while typing.
  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(
    () => (stock.data && catalog.data ? toSellRows(stock.data, catalog.data) : []),
    [stock.data, catalog.data]
  )
  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => r.productName.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q))
  }, [rows, deferredQuery])

  const refetch = useCallback(() => {
    void stock.refetch()
    void catalog.refetch()
    void age.refetch()
  }, [stock.refetch, catalog.refetch, age.refetch])
  useRefetchOnFocus(refetch)

  const failure = stock.error ?? catalog.error
  return {
    rows,
    filtered,
    query,
    setQuery,
    ageSeconds: age.data ?? null,
    loading: stock.isLoading || catalog.isLoading,
    refreshing: (stock.isFetching || catalog.isFetching) && !(stock.isLoading || catalog.isLoading),
    error: failure ? errorMessage(failure, 'Failed to load stock.') : null,
    refetch,
  }
}

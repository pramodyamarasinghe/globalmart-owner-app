import { useCallback, useState } from 'react'
import { Alert, FlatList, RefreshControl, View } from 'react-native'
import { AppHeader } from '@/src/shared/components/AppHeader'
import { Content, EmptyState, ErrorBanner, LoadingBlock, Screen } from '@/src/shared/components/ui'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { space } from '@/src/shared/theme/tokens'
import { OrderCard } from './components/OrderCard'
import { useOrders } from './useOrders'

export default function OrdersScreen() {
  const { orders, products, waiting, loading, refreshing, error, refetch, cancel } = useOrders()
  const [openId, setOpenId] = useState<string | null>(null)
  const { gutter, contentMaxWidth, listBottomPad } = useLayout()

  const toggle = useCallback((id: string) => setOpenId((cur) => (cur === id ? null : id)), [])
  const confirmCancel = useCallback(
    (id: string) => {
      Alert.alert('Cancel this order?', 'The cashier will not see it.', [
        { text: 'Keep', style: 'cancel' },
        { text: 'Cancel order', style: 'destructive', onPress: () => void cancel(id) },
      ])
    },
    [cancel]
  )

  return (
    <Screen>
      <AppHeader
        title="Orders"
        subtitle={waiting ? `${waiting} waiting for cashier` : 'Recent orders'}
      />

      {error ? (
        <Content style={{ paddingTop: space.md }}>
          <ErrorBanner message={error} onRetry={refetch} />
        </Content>
      ) : null}

      {loading ? (
        <LoadingBlock label="Loading orders…" />
      ) : orders.length === 0 && !error ? (
        <EmptyState
          title="No orders yet"
          message="Add products on Sell, then tap Send to cashier."
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
          contentContainerStyle={{
            paddingHorizontal: gutter,
            paddingTop: space.md,
            paddingBottom: listBottomPad,
          }}
          renderItem={({ item }) => (
            <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
              <OrderCard
                order={item}
                products={products}
                expanded={openId === item.id}
                onToggle={toggle}
                onCancel={confirmCancel}
              />
            </View>
          )}
        />
      )}
    </Screen>
  )
}

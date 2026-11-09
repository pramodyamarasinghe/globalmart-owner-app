import { useCallback, useMemo, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { ApiError } from '@/src/api/client'
import { getStock, type StockRow } from '@/src/api/reports'
import { AppHeader } from '@/src/components/AppHeader'
import { CartSheet } from '@/src/components/CartSheet'
import { ProductTile } from '@/src/components/ProductTile'
import { Content, EmptyState, ErrorBanner, LoadingBlock, Screen } from '@/src/components/ui'
import { useLayout } from '@/src/layout/useLayout'
import { useCart } from '@/src/store/cart'
import { useCashierQueue } from '@/src/store/cashierQueue'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'

export default function PosScreen() {
  const router = useRouter()
  const c = useColors()
  const { gutter, contentMaxWidth, floatingBottom, listBottomPad, touchMin, isTablet, width } =
    useLayout()
  const cols = isTablet ? 4 : width >= 400 ? 3 : 2

  const [rows, setRows] = useState<StockRow[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const lines = useCart((s) => s.lines)
  const addProduct = useCart((s) => s.addProduct)
  const removeOne = useCart((s) => s.removeOne)
  const clearCart = useCart((s) => s.clear)
  const enqueue = useCashierQueue((s) => s.enqueue)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      setRows(await getStock())
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load stock.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load])
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) => r.productName.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
    )
  }, [rows, query])

  const qtyMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const l of lines) m.set(l.productId, l.qtyMilli)
    return m
  }, [lines])

  function onSend() {
    if (lines.length === 0) return
    enqueue(lines)
    clearCart()
    setCartOpen(false)
    setToast('Sent to cashier')
    setTimeout(() => setToast(null), 1800)
    router.push('/(tabs)/cashier')
  }

  const bottomPad = listBottomPad + 92

  return (
    <Screen>
      <AppHeader title="Sell" subtitle={`${filtered.length} products available`} />

      <View style={[styles.toolbar, { backgroundColor: c.surface, borderBottomColor: c.lineSoft, paddingHorizontal: gutter }]}>
        <View style={[styles.searchWrap, { maxWidth: contentMaxWidth, backgroundColor: c.searchBg, borderColor: c.line }]}>
          <Ionicons name="search" size={18} color={c.inkFaint} style={{ marginLeft: 14 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products or SKU"
            placeholderTextColor={c.inkFaint}
            style={[styles.search, { color: c.ink, minHeight: touchMin - 2 }]}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="close-circle" size={18} color={c.inkFaint} />
            </Pressable>
          ) : (
            <View style={{ width: 12 }} />
          )}
        </View>
        <Text style={[type.caption, { color: c.inkMuted, marginTop: 8, maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          Tap − on the left to remove · Tap + on the right to add
        </Text>
      </View>

      {error ? (
        <Content style={{ paddingTop: space.md }}>
          <ErrorBanner message={error} onRetry={() => void load()} />
        </Content>
      ) : null}

      {loading ? (
        <LoadingBlock label="Loading products…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? 'No stock' : 'No matches'}
          message={rows.length === 0 ? 'Nothing on hand right now.' : 'Try another search.'}
          actionLabel={rows.length === 0 ? 'Retry' : undefined}
          onAction={rows.length === 0 ? () => void load() : undefined}
        />
      ) : (
        <FlatList
          data={filtered}
          key={cols}
          keyExtractor={(item) => item.productId}
          numColumns={cols}
          columnWrapperStyle={{ gap: space.sm, paddingHorizontal: gutter }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 / cols }}>
              <ProductTile
                row={item}
                qtyInCart={qtyMap.get(item.productId)}
                onAdd={() => addProduct(item)}
                onRemove={() => removeOne(item)}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={c.accent} />
          }
          contentContainerStyle={{
            paddingTop: space.md,
            paddingBottom: bottomPad,
            maxWidth: contentMaxWidth + gutter * 2,
            width: '100%',
            alignSelf: 'center',
          }}
        />
      )}

      <View style={[styles.dock, { backgroundColor: c.panel, borderTopColor: c.line, paddingBottom: floatingBottom, paddingHorizontal: gutter }]}>
        <View style={[styles.dockInner, { maxWidth: contentMaxWidth }]}>
          <Pressable style={[styles.dockCart, { backgroundColor: c.searchBg }]} onPress={() => setCartOpen(true)}>
            <Ionicons name="cart-outline" size={20} color={c.accentDark} />
            <View>
              <Text style={[type.caption, { color: c.inkMuted }]}>Cart</Text>
              <Text style={[type.bodyStrong, { color: c.ink }]}>
                {lines.length} item{lines.length === 1 ? '' : 's'}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[styles.dockSend, { backgroundColor: lines.length ? c.accent : c.lineSoft }]}
            onPress={onSend}
            disabled={lines.length === 0}
          >
            <Text style={[type.bodyStrong, { color: lines.length ? '#fff' : c.inkFaint }]}>Send to cashier</Text>
            <Ionicons name="arrow-forward" size={18} color={lines.length ? '#fff' : c.inkFaint} />
          </Pressable>
        </View>
      </View>

      {toast ? (
        <View style={[styles.toast, { backgroundColor: c.accentDark }]}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={[type.captionStrong, { color: '#fff' }]}>{toast}</Text>
        </View>
      ) : null}

      <CartSheet visible={cartOpen} onClose={() => setCartOpen(false)} onSend={onSend} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  toolbar: { paddingTop: space.md, paddingBottom: space.sm, borderBottomWidth: 1 },
  searchWrap: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
  },
  search: {
    ...type.body,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingTop: space.sm,
  },
  dockInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: space.sm,
  },
  dockCart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  dockSend: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    minHeight: 52,
  },
  toast: {
    position: 'absolute',
    top: '42%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.full,
  },
})

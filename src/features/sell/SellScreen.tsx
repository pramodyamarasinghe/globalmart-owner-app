import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useRouter } from 'expo-router'
import { AppHeader } from '@/src/shared/components/AppHeader'
import { Content, EmptyState, ErrorBanner, LoadingBlock, Screen } from '@/src/shared/components/ui'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space, type } from '@/src/shared/theme/tokens'
import { ProductTile } from './components/ProductTile'
import type { SellRow } from './sell.types'
import { useCart } from './useCart'
import { useSellProducts } from './useSellProducts'
import { useSendOrder } from './useSendOrder'

// The cart sheet is only needed once the cart is opened, so it loads on first open.
const CartSheet = lazy(() =>
  import('./components/CartSheet').then((m) => ({ default: m.CartSheet }))
)

// Module-level, so the list keeps one separator type instead of remounting every row per render.
const Separator = () => <View style={{ height: space.sm }} />

export default function SellScreen() {
  const router = useRouter()
  const c = useColors()
  const { gutter, contentMaxWidth, floatingBottom, listBottomPad, touchMin, isTablet, width } =
    useLayout()
  const cols = isTablet ? 4 : width >= 400 ? 3 : 2

  const { filtered, rows, query, setQuery, ageSeconds, loading, refreshing, error, refetch } =
    useSellProducts()
  const { lines, add, removeOne } = useCart()
  const { send, sending, error: sendError } = useSendOrder()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartLoaded, setCartLoaded] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => void (toastTimer.current && clearTimeout(toastTimer.current)), [])

  const openCart = useCallback(() => {
    setCartLoaded(true)
    setCartOpen(true)
  }, [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const columnWrapperStyle = useMemo(() => ({ gap: space.sm, paddingHorizontal: gutter }), [gutter])
  const renderItem = useCallback(
    ({ item }: { item: SellRow }) => (
      <View style={{ flex: 1 / cols }}>
        <ProductTile row={item} onAdd={add} onRemove={removeOne} />
      </View>
    ),
    [cols, add, removeOne]
  )

  async function onSend() {
    if (!(await send())) return
    setCartOpen(false)
    setToast('Sent to cashier')
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
    router.push('/(tabs)/orders')
  }

  const bottomPad = listBottomPad + 92

  return (
    <Screen>
      <AppHeader title="Sell" subtitle={`${filtered.length} products available${ageSeconds === null ? '' : ` · data ${Math.ceil(ageSeconds / 60)} min old`}`} />

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
          <ErrorBanner message={error} onRetry={refetch} />
        </Content>
      ) : null}

      {loading ? (
        <LoadingBlock label="Loading products…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? 'No stock' : 'No matches'}
          message={rows.length === 0 ? 'Nothing on hand right now.' : 'Try another search.'}
          actionLabel={rows.length === 0 ? 'Retry' : undefined}
          onAction={rows.length === 0 ? refetch : undefined}
        />
      ) : (
        <FlatList
          data={filtered}
          key={cols}
          keyExtractor={(item) => item.productId}
          numColumns={cols}
          columnWrapperStyle={columnWrapperStyle}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          windowSize={7}
          initialNumToRender={cols * 4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={c.accent} />
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
          <Pressable style={[styles.dockCart, { backgroundColor: c.searchBg }]} onPress={openCart}>
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
            onPress={() => void onSend()}
            disabled={lines.length === 0 || sending}
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

      {cartLoaded ? (
        <Suspense fallback={null}>
          <CartSheet
            visible={cartOpen}
            onClose={closeCart}
            onSend={() => void onSend()}
            sending={sending}
            error={sendError}
          />
        </Suspense>
      ) : null}
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

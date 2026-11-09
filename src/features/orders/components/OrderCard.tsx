import { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatMilli } from '@/src/shared/lib/money'
import { Button } from '@/src/shared/components/ui'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space, type } from '@/src/shared/theme/tokens'
import type { StockRow } from '@/src/features/catalog/catalog.schemas'
import type { OrderRow } from '../orders.schemas'

const STATUS_LABEL: Record<OrderRow['status'], string> = {
  pending: 'Waiting for cashier',
  claimed: 'At the till',
  held: 'At the till',
  posted: 'Done',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
}

export const OrderCard = memo(function OrderCard({
  order,
  products,
  expanded,
  onToggle,
  onCancel,
}: {
  order: OrderRow
  products: Map<string, StockRow>
  expanded: boolean
  onToggle: (id: string) => void
  onCancel: (id: string) => void
}) {
  const c = useColors()
  const when = new Date(order.created_at)
  const time = when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const bad = order.status === 'rejected' || order.status === 'cancelled'

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.panel, borderColor: c.line, shadowColor: c.cardShadow },
      ]}
    >
      <Pressable onPress={() => onToggle(order.id)} style={styles.head}>
        <View style={[styles.icon, { backgroundColor: c.accentSoft }]}>
          <Ionicons name="receipt-outline" size={18} color={c.accentDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.bodyStrong, { color: c.ink }]}>{STATUS_LABEL[order.status]}</Text>
          <Text style={[type.caption, { color: c.inkMuted }]}>
            {when.toLocaleDateString()} {time} · {order.lines.length} items
          </Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={c.inkFaint} />
      </Pressable>

      {order.status === 'rejected' && order.reject_reason ? (
        <Text style={[type.caption, { color: bad ? c.danger : c.inkMuted }]}>{order.reject_reason}</Text>
      ) : null}

      {expanded ? (
        <View style={[styles.lines, { borderTopColor: c.lineSoft }]}>
          {order.lines.map((line, i) => {
            const p = products.get(line.product_id)
            return (
              <View key={`${line.product_id}-${i}`} style={styles.line}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[type.bodyStrong, { color: c.ink }]} numberOfLines={1}>
                    {p?.productName ?? 'Unknown product'}
                  </Text>
                  <Text style={[type.caption, { color: c.inkFaint }]}>{p?.sku ?? ''}</Text>
                </View>
                <Text style={[type.mono, { color: c.ink }]}>
                  {formatMilli(line.qty_milli, p?.baseUnitDecimals)} {p?.baseUnitCode ?? ''}
                </Text>
              </View>
            )
          })}
        </View>
      ) : null}

      {order.status === 'pending' ? <Button label="Cancel order" variant="danger" onPress={() => onCancel(order.id)} /> : null}
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.md,
    marginBottom: space.md,
    gap: space.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lines: { borderTopWidth: 1, paddingTop: space.sm, gap: 4 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 6,
  },
  actions: { flexDirection: 'row', gap: space.sm },
})

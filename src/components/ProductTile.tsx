import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { StockRow } from '@/src/api/reports'
import { formatMilli } from '@/src/lib/money'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'

export function ProductTile({
  row,
  qtyInCart,
  onAdd,
  onRemove,
}: {
  row: StockRow
  qtyInCart?: number
  onAdd: () => void
  onRemove: () => void
}) {
  const c = useColors()
  const qty = qtyInCart ?? 0
  const selected = qty > 0

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: c.panel,
          borderColor: selected ? c.accent : c.line,
          shadowColor: c.cardShadow,
        },
        selected && { backgroundColor: c.accentSoft, borderWidth: 1.5 },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.sku, { color: c.inkFaint }]} numberOfLines={1}>
          {row.sku}
        </Text>
        <Text style={[styles.name, { color: c.ink }]} numberOfLines={2}>
          {row.productName}
        </Text>
        <Text style={[styles.stock, { color: c.success }]}>
          {formatMilli(row.onHandMilli, row.baseUnitDecimals)} {row.baseUnitCode}
        </Text>
        {selected ? (
          <View style={[styles.qtyPill, { backgroundColor: c.accent }]}>
            <Text style={styles.qtyPillText}>{formatMilli(qty, row.baseUnitDecimals)}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.split, { borderTopColor: c.lineSoft }]}>
        <Pressable
          onPress={onRemove}
          disabled={qty <= 0}
          style={({ pressed }) => [
            styles.half,
            styles.halfLeft,
            { backgroundColor: pressed ? c.dangerSoft : 'transparent', opacity: qty <= 0 ? 0.35 : 1 },
          ]}
          accessibilityLabel="Remove one"
        >
          <Ionicons name="remove" size={22} color={c.danger} />
        </Pressable>
        <View style={[styles.divider, { backgroundColor: c.line }]} />
        <Pressable
          onPress={onAdd}
          style={({ pressed }) => [
            styles.half,
            styles.halfRight,
            { backgroundColor: pressed ? c.accentSoft : 'transparent' },
          ]}
          accessibilityLabel="Add one"
        >
          <Ionicons name="add" size={22} color={c.accentDark} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 148,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  info: { flex: 1, padding: space.md, gap: 4 },
  sku: { ...type.label, letterSpacing: 0.4, textTransform: 'uppercase' },
  name: { ...type.bodyStrong, minHeight: 40 },
  stock: { ...type.captionStrong, marginTop: 4 },
  qtyPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  qtyPillText: { ...type.captionStrong, color: '#fff' },
  split: {
    flexDirection: 'row',
    borderTopWidth: 1,
    minHeight: 44,
  },
  half: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  halfLeft: {},
  halfRight: {},
  divider: { width: 1 },
})

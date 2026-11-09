import { StyleSheet, Text, View } from 'react-native'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { formatCents, formatMilli } from '@/src/shared/lib/money'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space, type } from '@/src/shared/theme/tokens'
import { Caption } from '@/src/shared/components/ui'

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/Cents$/i, '')
    .replace(/Milli$/i, '')
    .replace(/Id$/i, '')
    .replace(/^./, (ch) => ch.toUpperCase())
    .trim()
}

function formatValue(key: string, value: unknown, decimals = 3): string {
  if (value == null) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    if (/Cents$/i.test(key)) return formatCents(value)
    if (/Milli$/i.test(key)) return formatMilli(value, decimals)
    if (/Bp$/i.test(key)) return `${(value / 100).toFixed(2)}%`
    return value.toLocaleString('en-LK')
  }
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

const SKIP = new Set(['forms', 'packs', 'batches', 'products', 'payments'])

function RowCard({ item }: { item: Record<string, unknown> }) {
  const c = useColors()
  const title =
    (item.productName as string) ||
    (item.groupLabel as string) ||
    (item.period as string) ||
    (item.methodName as string) ||
    (item.supplierName as string) ||
    (item.customerName as string) ||
    (item.userName as string) ||
    (item.invoiceNumber as string) ||
    (item.sku as string) ||
    null

  const decimals = typeof item.baseUnitDecimals === 'number' ? item.baseUnitDecimals : 3
  const entries = Object.entries(item).filter(([k, v]) => {
    if (SKIP.has(k)) return false
    if (k === 'productName' || k === 'groupLabel' || k === 'period') return false
    if (typeof v === 'object' && v !== null) return false
    return true
  })

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.panel, borderColor: c.line, shadowColor: c.cardShadow },
      ]}
    >
      {title ? <Text style={[type.heading, { color: c.ink, marginBottom: 4 }]}>{title}</Text> : null}
      {entries.map(([k, v]) => (
        <View key={k} style={styles.kv}>
          <Text style={[type.label, { color: c.inkFaint, flex: 1 }]}>{humanize(k)}</Text>
          <Text style={[type.mono, { color: c.ink, textAlign: 'right', maxWidth: '55%' }]}>
            {formatValue(k, v, decimals)}
          </Text>
        </View>
      ))}
    </View>
  )
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== 'object') return []
  const obj = data as Record<string, unknown>
  for (const key of ['items', 'rows', 'entries', 'lines']) {
    const list = obj[key]
    if (Array.isArray(list)) {
      return list.filter((x) => x && typeof x === 'object') as Record<string, unknown>[]
    }
  }
  if (Array.isArray(data)) {
    return data.filter((x) => x && typeof x === 'object') as Record<string, unknown>[]
  }
  return [obj]
}

export function ReportViewer({ data }: { data: unknown }) {
  const { gutter, contentMaxWidth } = useLayout()
  const c = useColors()
  const list = extractList(data)
  const totals =
    data && typeof data === 'object' && 'totals' in (data as object)
      ? (data as { totals: Record<string, unknown> }).totals
      : null

  if (list.length === 0) {
    return (
      <View style={{ paddingHorizontal: gutter, paddingTop: space.lg }}>
        <Caption muted>No rows for this period.</Caption>
      </View>
    )
  }

  return (
    <View style={[styles.wrap, { paddingHorizontal: gutter }]}>
      <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', gap: space.md }}>
        {totals ? (
          <View
            style={[
              styles.card,
              {
                backgroundColor: c.accentSoft,
                borderColor: c.accentMuted,
                shadowColor: c.cardShadow,
              },
            ]}
          >
            <Text style={[type.heading, { color: c.ink, marginBottom: 4 }]}>Totals</Text>
            {Object.entries(totals)
              .filter(([, v]) => typeof v !== 'object')
              .map(([k, v]) => (
                <View key={k} style={styles.kv}>
                  <Text style={[type.label, { color: c.inkFaint, flex: 1 }]}>{humanize(k)}</Text>
                  <Text style={[type.mono, { color: c.ink }]}>{formatValue(k, v)}</Text>
                </View>
              ))}
          </View>
        ) : null}
        {list.map((item, i) => (
          <RowCard key={i} item={item} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: space.md, paddingVertical: space.lg },
  card: {
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    gap: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
})

import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatMilli } from '@/src/lib/money'
import { AppHeader } from '@/src/components/AppHeader'
import { EmptyState, Button, Screen } from '@/src/components/ui'
import { useLayout } from '@/src/layout/useLayout'
import { useCashierQueue, type CashierTicket } from '@/src/store/cashierQueue'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'

function TicketCard({
  ticket,
  expanded,
  onToggle,
  onDone,
  index,
}: {
  ticket: CashierTicket
  expanded: boolean
  onToggle: () => void
  onDone: () => void
  index: number
}) {
  const c = useColors()
  const when = new Date(ticket.createdAt)
  const time = when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.panel, borderColor: c.line, shadowColor: c.cardShadow },
      ]}
    >
      <Pressable onPress={onToggle} style={styles.head}>
        <View style={[styles.icon, { backgroundColor: c.accentSoft }]}>
          <Ionicons name="receipt-outline" size={18} color={c.accentDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.bodyStrong, { color: c.ink }]}>Ticket #{1000 + index}</Text>
          <Text style={[type.caption, { color: c.inkMuted }]}>
            {time} · {ticket.lines.length} items
          </Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={c.inkFaint} />
      </Pressable>

      {expanded ? (
        <View style={[styles.lines, { borderTopColor: c.lineSoft }]}>
          {ticket.lines.map((line) => (
            <View key={line.productId} style={styles.line}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[type.bodyStrong, { color: c.ink }]} numberOfLines={1}>
                  {line.productName}
                </Text>
                <Text style={[type.caption, { color: c.inkFaint }]}>{line.sku}</Text>
              </View>
              <Text style={[type.mono, { color: c.ink }]}>
                {formatMilli(line.qtyMilli, line.baseUnitDecimals)} {line.baseUnitCode}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        <View style={{ flex: 1 }}>
          <Button label="Pay — soon" disabled onPress={() => {}} variant="secondary" />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Done" onPress={onDone} />
        </View>
      </View>
    </View>
  )
}

export default function CashierScreen() {
  const tickets = useCashierQueue((s) => s.tickets)
  const markDone = useCashierQueue((s) => s.markDone)
  const clearAll = useCashierQueue((s) => s.clearAll)
  const [openId, setOpenId] = useState<string | null>(tickets[0]?.id ?? null)
  const { gutter, contentMaxWidth, listBottomPad } = useLayout()
  const c = useColors()

  return (
    <Screen>
      <AppHeader
        title="Cashier"
        subtitle={tickets.length ? `${tickets.length} pending` : 'Queue empty'}
        right={
          tickets.length > 0 ? (
            <Pressable onPress={clearAll} hitSlop={8}>
              <Text style={[type.captionStrong, { color: c.danger }]}>Clear all</Text>
            </Pressable>
          ) : null
        }
      />

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          message="Add products on Sell, then tap Send to cashier."
        />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{
            paddingHorizontal: gutter,
            paddingTop: space.md,
            paddingBottom: listBottomPad,
          }}
          renderItem={({ item, index }) => (
            <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
              <TicketCard
                ticket={item}
                index={tickets.length - index}
                expanded={openId === item.id}
                onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
                onDone={() => markDone(item.id)}
              />
            </View>
          )}
        />
      )}
    </Screen>
  )
}

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

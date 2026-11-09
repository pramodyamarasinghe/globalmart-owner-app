import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLayout } from '@/src/layout/useLayout'
import { formatMilli, unitStepMilli } from '@/src/lib/money'
import { useCart } from '@/src/store/cart'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'
import { Button, Caption } from './ui'

export function CartSheet({
  visible,
  onClose,
  onSend,
  sending,
}: {
  visible: boolean
  onClose: () => void
  onSend: () => void
  sending?: boolean
}) {
  const insets = useSafeAreaInsets()
  const c = useColors()
  const { height, contentMaxWidth, gutter, touchMin } = useLayout()
  const lines = useCart((s) => s.lines)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const listMax = Math.min(380, Math.round(height * 0.45))

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: c.panel,
            paddingBottom: Math.max(insets.bottom, space.lg),
            paddingHorizontal: gutter,
            borderTopColor: c.accent,
          },
        ]}
      >
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', gap: space.md }}>
          <View style={[styles.handle, { backgroundColor: c.line }]} />
          <View style={styles.head}>
            <Ionicons name="cart" size={20} color={c.accentDark} />
            <Text style={[type.title, { color: c.ink }]}>Cart</Text>
          </View>

          {lines.length === 0 ? (
            <Caption muted>Use + / − on product cards to build the cart.</Caption>
          ) : (
            <ScrollView style={{ maxHeight: listMax }} showsVerticalScrollIndicator={false}>
              {lines.map((line) => {
                const step = unitStepMilli(line.baseUnitDecimals)
                return (
                  <View
                    key={line.productId}
                    style={[styles.line, { borderBottomColor: c.lineSoft }]}
                  >
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={[type.bodyStrong, { color: c.ink }]} numberOfLines={1}>
                        {line.productName}
                      </Text>
                      <Text style={[type.caption, { color: c.inkFaint }]}>{line.sku}</Text>
                    </View>
                    <View style={styles.stepper}>
                      <Pressable
                        style={[
                          styles.stepBtn,
                          {
                            width: touchMin - 6,
                            height: touchMin - 6,
                            backgroundColor: c.dangerSoft,
                          },
                        ]}
                        onPress={() => setQty(line.productId, line.qtyMilli - step)}
                      >
                        <Ionicons name="remove" size={18} color={c.danger} />
                      </Pressable>
                      <Text style={[type.mono, { color: c.ink, minWidth: 48, textAlign: 'center' }]}>
                        {formatMilli(line.qtyMilli, line.baseUnitDecimals)}
                      </Text>
                      <Pressable
                        style={[
                          styles.stepBtn,
                          {
                            width: touchMin - 6,
                            height: touchMin - 6,
                            backgroundColor: c.accentSoft,
                          },
                        ]}
                        onPress={() => setQty(line.productId, line.qtyMilli + step)}
                        disabled={line.qtyMilli + step > line.onHandMilli}
                      >
                        <Ionicons name="add" size={18} color={c.accentDark} />
                      </Pressable>
                    </View>
                    <Pressable onPress={() => remove(line.productId)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={18} color={c.danger} />
                    </Pressable>
                  </View>
                )
              })}
            </ScrollView>
          )}

          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button label="Close" variant="secondary" onPress={onClose} />
            </View>
            <View style={{ flex: 1.4 }}>
              <Button
                label="Send to cashier"
                onPress={onSend}
                disabled={lines.length === 0}
                loading={sending}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: space.md,
    borderTopWidth: 3,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
})

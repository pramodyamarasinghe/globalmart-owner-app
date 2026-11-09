import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '@/src/store/theme'
import { space, type } from '@/src/theme/tokens'

export function AppHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  const insets = useSafeAreaInsets()
  const c = useColors()
  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: Math.max(insets.top, space.sm),
          backgroundColor: c.header,
          borderBottomColor: c.lineSoft,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: c.headerText }]} numberOfLines={1}>
            <Text style={{ color: c.accentDark }}>GlobalMart</Text>
            <Text style={{ color: c.headerText }}> {title}</Text>
          </Text>
          {subtitle ? <Text style={[styles.sub, { color: c.inkMuted }]}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    borderBottomWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  title: { ...type.title },
  sub: { ...type.caption, marginTop: 2 },
})

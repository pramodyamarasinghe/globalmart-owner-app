import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { lightColors, space, type } from '@/src/shared/theme/tokens'

/** Full-screen branded splash while fonts / session hydrate. */
export function BrandSplash() {
  const c = lightColors
  return (
    <View style={[styles.root, { backgroundColor: c.canvas }]}>
      <View style={styles.center}>
        <View style={[styles.mark, { backgroundColor: c.accentSoft, borderColor: c.accentMuted }]}>
          <Ionicons name="storefront" size={36} color={c.accentDark} />
        </View>
        <Text style={[styles.brand, { color: c.accentDark }]}>GlobalMart</Text>
        <Text style={[styles.welcome, { color: c.ink }]}>GlobalMart Mobile Welcome</Text>
        <Text style={[styles.tag, { color: c.inkMuted }]}>Owner companion</Text>
        <ActivityIndicator color={c.accent} style={{ marginTop: space.xl }} />
      </View>
      <Text style={[styles.footer, { color: c.inkFaint }]}>Secure · Reports · Stock</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  center: { alignItems: 'center', width: '100%' },
  mark: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: space.xl,
  },
  brand: {
    ...type.brand,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: 0.4,
  },
  welcome: {
    ...type.heading,
    marginTop: space.md,
    textAlign: 'center',
  },
  tag: {
    ...type.caption,
    marginTop: space.sm,
    letterSpacing: 0.6,
  },
  footer: {
    ...type.label,
    position: 'absolute',
    bottom: 48,
    letterSpacing: 1,
  },
})

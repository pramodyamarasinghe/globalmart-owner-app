import { Switch, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AppHeader } from '@/src/components/AppHeader'
import { Button, Content, Screen } from '@/src/components/ui'
import { useSession } from '@/src/store/session'
import { useColors, useThemeStore } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'

export default function SettingsScreen() {
  const logout = useSession((s) => s.logout)
  const nightMode = useThemeStore((s) => s.nightMode)
  const setNightMode = useThemeStore((s) => s.setNightMode)
  const c = useColors()

  return (
    <Screen>
      <AppHeader title="Settings" subtitle="Preferences" />
      <Content style={{ paddingTop: space.xl, gap: space.md }}>
        <View style={[styles.card, { backgroundColor: c.panel, borderColor: c.line, shadowColor: c.cardShadow }]}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: c.accentSoft }]}>
              <Ionicons name={nightMode ? 'moon' : 'sunny-outline'} size={20} color={c.accentDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyStrong, { color: c.ink }]}>Night mode</Text>
              <Text style={[type.caption, { color: c.inkMuted, marginTop: 2 }]}>
                Switch to a darker look for low light
              </Text>
            </View>
            <Switch
              value={nightMode}
              onValueChange={(v) => void setNightMode(v)}
              trackColor={{ false: c.line, true: c.accentMuted }}
              thumbColor={nightMode ? c.accent : '#f4f4f5'}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: c.panel, borderColor: c.line, shadowColor: c.cardShadow }]}>
          <Button label="Log out" variant="danger" onPress={() => void logout()} />
        </View>
      </Content>
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

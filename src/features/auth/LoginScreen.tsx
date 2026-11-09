import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, Content, Screen } from '@/src/shared/components/ui'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space, type } from '@/src/shared/theme/tokens'
import { LoginField } from './components/LoginField'
import { useLoginForm } from './useAuth'

export default function LoginScreen() {
  const { insets, isTablet } = useLayout()
  const c = useColors()
  const { baseUrl, setBaseUrl, user, setUser, password, setPassword, busy, error, submit } =
    useLoginForm()

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']} style={{ backgroundColor: c.canvas }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Content>
            <View style={[styles.wrap, isTablet && { maxWidth: 420, alignSelf: 'center', width: '100%' }]}>
              {/* Brand */}
              <View style={styles.brandBlock}>
                <View style={[styles.logo, { backgroundColor: c.accent, shadowColor: c.cardShadow }]}>
                  <Ionicons name="storefront" size={30} color="#FFFFFF" />
                </View>
                <Text style={[styles.brand, { color: c.ink }]}>GlobalMart</Text>
                <Text style={[styles.welcome, { color: c.inkMuted }]}>
                  Welcome back. Sign in to continue.
                </Text>
              </View>

              {/* Form card */}
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: c.panel,
                    borderColor: c.lineSoft,
                    shadowColor: c.cardShadow,
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { color: c.ink }]}>Sign in</Text>

                {error ? (
                  <View style={[styles.errorBox, { backgroundColor: c.dangerSoft, borderColor: c.danger }]}>
                    <Ionicons name="alert-circle" size={18} color={c.danger} />
                    <Text style={[type.caption, { color: c.danger, flex: 1 }]}>{error}</Text>
                  </View>
                ) : null}

                <LoginField
                  label="Server"
                  hint="Shop report API address"
                  icon="globe-outline"
                  value={baseUrl}
                  onChangeText={setBaseUrl}
                  placeholder="https://api.example.com or http://192.168.x.x:4100"
                  keyboardType="url"
                  autoComplete="off"
                  returnKeyType="next"
                />
                <LoginField
                  label="Username"
                  hint="Your operator login"
                  icon="person-outline"
                  value={user}
                  onChangeText={setUser}
                  placeholder="Enter username"
                  autoComplete="username"
                  returnKeyType="next"
                />
                <LoginField
                  label="Password"
                  hint="Keep this private"
                  icon="lock-closed-outline"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  secure
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={() => void submit()}
                />

                <View style={{ marginTop: space.sm }}>
                  <Button label={busy ? 'Signing in…' : 'Sign in'} onPress={submit} loading={busy} />
                </View>
              </View>

              <Text style={[styles.footer, { color: c.inkFaint }]}>
                GlobalMart Mobile · Secure connection
              </Text>
            </View>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center' },
  wrap: { gap: space.xl },
  brandBlock: { alignItems: 'center', gap: space.sm },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  brand: {
    ...type.brand,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 0.3,
  },
  welcome: {
    ...type.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: space.xl,
    gap: space.lg,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 3,
  },
  cardTitle: {
    ...type.title,
    marginBottom: -space.xs,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  footer: {
    ...type.caption,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
})

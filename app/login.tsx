import { useState, type ComponentProps } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ApiError } from '@/src/api/client'
import { Button, Content, Screen } from '@/src/components/ui'
import { useLayout } from '@/src/layout/useLayout'
import { useSession } from '@/src/store/session'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'

function LoginField({
  label,
  icon,
  hint,
  secure,
  ...props
}: {
  label: string
  icon: ComponentProps<typeof Ionicons>['name']
  hint?: string
  secure?: boolean
} & ComponentProps<typeof TextInput>) {
  const c = useColors()
  const { touchMin } = useLayout()
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.fieldBlock}>
      <Text style={[type.label, { color: c.ink }]}>{label}</Text>
      {hint ? <Text style={[type.caption, { color: c.inkMuted, marginTop: 2 }]}>{hint}</Text> : null}
      <View
        style={[
          styles.inputRow,
          {
            minHeight: Math.max(52, touchMin),
            backgroundColor: c.searchBg,
            borderColor: focused ? c.accent : c.line,
            borderWidth: focused ? 1.5 : 1,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={focused ? c.accentDark : c.inkFaint} style={{ marginLeft: 14 }} />
        <TextInput
          {...props}
          secureTextEntry={secure && !show}
          placeholderTextColor={c.inkFaint}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          style={[type.body, styles.input, { color: c.ink }]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secure ? (
          <Pressable onPress={() => setShow((v) => !v)} hitSlop={10} style={styles.eye}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={c.inkFaint} />
          </Pressable>
        ) : (
          <View style={{ width: 12 }} />
        )}
      </View>
    </View>
  )
}

export default function LoginScreen() {
  const { insets, isTablet } = useLayout()
  const c = useColors()
  const connect = useSession((s) => s.connect)
  const savedBase = useSession((s) => s.baseUrl)
  const savedUser = useSession((s) => s.user)

  const [baseUrl, setBaseUrl] = useState(savedBase || 'http://192.168.8.142:4100')
  const [user, setUser] = useState(savedUser || '')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onConnect() {
    setError(null)
    if (!baseUrl.trim() || !user.trim() || !password) {
      setError('Please fill in server, username, and password.')
      return
    }
    setBusy(true)
    try {
      await connect({ baseUrl, user, password })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Sign in failed. Check your details and try again.')
    } finally {
      setBusy(false)
    }
  }

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
                  onSubmitEditing={() => void onConnect()}
                />

                <View style={{ marginTop: space.sm }}>
                  <Button label={busy ? 'Signing in…' : 'Sign in'} onPress={onConnect} loading={busy} />
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
  fieldBlock: { gap: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  eye: { paddingHorizontal: 14, paddingVertical: 10 },
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

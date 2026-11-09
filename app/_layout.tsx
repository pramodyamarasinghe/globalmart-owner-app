import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { setOnUnauthorized } from '@/src/api/client'
import { BrandSplash } from '@/src/components/BrandSplash'
import { useSession } from '@/src/store/session'
import { useThemeStore } from '@/src/store/theme'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

const WELCOME_MS = 1600

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  })
  const hydrate = useSession((s) => s.hydrate)
  const hydrated = useSession((s) => s.hydrated)
  const connected = useSession((s) => s.connected)
  const logout = useSession((s) => s.logout)
  const hydrateTheme = useThemeStore((s) => s.hydrate)
  const themeHydrated = useThemeStore((s) => s.hydrated)
  const nightMode = useThemeStore((s) => s.nightMode)
  const colors = useThemeStore((s) => s.colors)
  const segments = useSegments()
  const router = useRouter()
  const [welcomeDone, setWelcomeDone] = useState(false)

  const ready = fontsLoaded && hydrated && themeHydrated

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    void hydrate()
    void hydrateTheme()
  }, [hydrate, hydrateTheme])

  useEffect(() => {
    setOnUnauthorized(() => {
      void logout()
    })
    return () => setOnUnauthorized(null)
  }, [logout])

  useEffect(() => {
    if (!ready) return
    SplashScreen.hideAsync()
    const t = setTimeout(() => setWelcomeDone(true), WELCOME_MS)
    return () => clearTimeout(t)
  }, [ready])

  useEffect(() => {
    if (!hydrated || !welcomeDone) return
    const onLogin = segments[0] === 'login'
    if (!connected && !onLogin) {
      router.replace('/login')
    } else if (connected && onLogin) {
      router.replace('/(tabs)/pos')
    }
  }, [hydrated, connected, segments, router, welcomeDone])

  if (!ready || !welcomeDone) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <BrandSplash />
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={nightMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.accentDark,
          headerTitleStyle: {
            fontFamily: 'DMSans_600SemiBold',
            fontSize: 16,
            color: colors.ink,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  )
}

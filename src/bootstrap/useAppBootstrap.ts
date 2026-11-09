import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans'
import { useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { hydrateAuth } from '@/src/features/auth/authSlice'
import { hydrateTheme } from '@/src/features/theme/themeSlice'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'

SplashScreen.preventAutoHideAsync()

const WELCOME_MS = 1600

/** Loads fonts and saved state, shows the welcome splash, then keeps the user on the right side of the login. */
export function useAppBootstrap(): { ready: boolean } {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const segments = useSegments()
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  })
  const authHydrated = useAppSelector((s) => s.auth.hydrated)
  const connected = useAppSelector((s) => s.auth.connected)
  const themeHydrated = useAppSelector((s) => s.theme.hydrated)
  const [welcomeDone, setWelcomeDone] = useState(false)

  const loaded = fontsLoaded && authHydrated && themeHydrated

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    void dispatch(hydrateAuth())
    void dispatch(hydrateTheme())
  }, [dispatch])

  useEffect(() => {
    if (!loaded) return
    SplashScreen.hideAsync()
    const t = setTimeout(() => setWelcomeDone(true), WELCOME_MS)
    return () => clearTimeout(t)
  }, [loaded])

  useEffect(() => {
    if (!authHydrated || !welcomeDone) return
    const onLogin = segments[0] === 'login'
    if (!connected && !onLogin) router.replace('/login')
    else if (connected && onLogin) router.replace('/(tabs)/sell')
  }, [authHydrated, connected, segments, router, welcomeDone])

  return { ready: loaded && welcomeDone }
}

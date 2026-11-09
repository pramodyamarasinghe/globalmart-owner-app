import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAppBootstrap } from '@/src/bootstrap/useAppBootstrap'
import { useColors, useNightMode } from '@/src/features/theme/useTheme'
import { BrandSplash } from '@/src/shared/components/BrandSplash'
import { store } from '@/src/store'

export { ErrorBoundary } from 'expo-router'

function Root() {
  const { ready } = useAppBootstrap()
  const colors = useColors()
  const { nightMode } = useNightMode()

  if (!ready) {
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

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}

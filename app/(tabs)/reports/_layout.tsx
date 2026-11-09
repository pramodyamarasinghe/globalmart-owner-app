import { Stack } from 'expo-router'
import { useColors } from '@/src/features/theme/useTheme'

export default function ReportsLayout() {
  const c = useColors()
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.header },
        headerTintColor: c.accentDark,
        headerTitleStyle: {
          fontFamily: 'DMSans_600SemiBold',
          fontSize: 16,
          color: c.ink,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: c.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[name]" options={{ title: 'Report' }} />
    </Stack>
  )
}

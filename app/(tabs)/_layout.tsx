import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'

export default function TabsLayout() {
  const { tabBarHeight, insets } = useLayout()
  const c = useColors()

  const icon = (name: React.ComponentProps<typeof Ionicons>['name'], color: unknown, size: number) => (
    <Ionicons
      name={name}
      size={size}
      color={typeof color === 'string' ? color : c.tabInactive}
    />
  )

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.tabBar,
          borderTopColor: c.lineSoft,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarActiveTintColor: c.accentDark,
        tabBarInactiveTintColor: c.tabInactive,
        tabBarLabelStyle: {
          fontFamily: 'DMSans_600SemiBold',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color, size }) => icon('grid-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => icon('receipt-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => icon('bar-chart-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => icon('settings-outline', color, size),
        }}
      />
    </Tabs>
  )
}

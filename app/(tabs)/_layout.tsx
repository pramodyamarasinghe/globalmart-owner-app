import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { useLayout } from '@/src/layout/useLayout'
import { useCashierQueue } from '@/src/store/cashierQueue'
import { useColors } from '@/src/store/theme'

export default function TabsLayout() {
  const ticketCount = useCashierQueue((s) => s.tickets.length)
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
        name="pos"
        options={{
          title: 'Sell',
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color, size }) => icon('grid-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="cashier"
        options={{
          title: 'Cashier',
          tabBarLabel: 'Cashier',
          tabBarBadge: ticketCount > 0 ? ticketCount : undefined,
          tabBarBadgeStyle: { backgroundColor: c.accent, color: '#fff', fontSize: 10 },
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
